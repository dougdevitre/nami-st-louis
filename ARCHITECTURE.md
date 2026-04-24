# Serverless backend plan — NAMI STL Community Hub

Status: proposed. This document is a plan, not an implementation. Nothing on the live site changes until a decision is made.

---

## What needs a backend

Today the site is a static PWA. All user content lives in `localStorage` on one device. That's deliberate for the private tools (safety plan, wallet cards, mood check-in, stories, bookmarks, advocacy log) — and that stays.

What the static model can't do, and what this plan is for:

| Feature | Why it needs a backend |
|---|---|
| Shared community calendar | Events posted by one person must be visible to everyone |
| Event RSVPs / volunteer signups | Organizer needs to see who signed up, send confirmations |
| Moderated community board | Posts must be shared; moderation queue must be admin-only; spam + safe-messaging review needs a server |
| Warm-handoff referrals to partners | Referral has to actually reach the partner's intake inbox |
| Live Missouri bill tracking | Ingest LegiScan / mo-gov data and serve it |
| Advocacy action alerts | Send legislative alerts to subscribers |
| Partner directory maintenance | Staff need a non-Git way to update entries |
| Staff impact dashboard | Aggregate anonymous usage signals for grant reporting |

Everything else — safety plan, coping tools, supporter guide, mood, stories, wallet cards, bookmarks, display preferences — stays on-device. **We do not move private content server-side.**

---

## Recommended stack

### Primary choice — **Supabase**

Supabase is serverless Postgres + auth + storage + realtime + edge functions, all behind one SDK. For a low-to-mid-traffic community site with a small team, it hits the sweet spot of capability and operational burden.

- **Database**: Postgres with Row Level Security (RLS). Every table gets policies so the browser can talk to it directly without a custom API.
- **Auth**: email magic-link + Google / Apple. No passwords to manage. `auth.users` referenced by foreign keys.
- **Edge Functions**: Deno-based serverless functions for things that can't happen in the browser — email sends, LegiScan ingest cron, moderator actions that need service-role credentials.
- **Storage**: for partner logos, event flyers, any image uploads.
- **Realtime**: optional live updates for the calendar and community board.

Supabase's free tier covers this prototype's early life (500 MB DB, 5 GB bandwidth, 50K monthly active users). Moving off free tier is a single config change.

### Hosting

Stay on **GitHub Pages** for the static shell. Supabase JS SDK is loaded from the Supabase CDN or bundled. No new hosting contract needed.

If GitHub Pages becomes a limitation (redirects, headers, preview deploys), **Cloudflare Pages** is the easy next step — free, fast, same static-site model.

### Why not…

- **Firebase** — similar feature set, but lock-in is higher and RLS-equivalent (Security Rules) is harder to reason about than Postgres policies. Supabase is also more portable off-platform.
- **AWS Lambda + DynamoDB** — more flexibility, massively more operational burden. Overkill for this.
- **Pure Netlify/Vercel functions + a separate DB** — works, but stitching auth + DB + storage yourself is what Supabase is already doing. Don't rebuild that.
- **Airtable as a backend** — fine for admin-edited reference data (partners, programs) while the team is small. Use it *in addition to* Supabase, not instead.
- **Self-hosted Node + Postgres** — highest control, highest burden. Not proposed.

---

## Data model — initial tables

```sql
-- Public reference data (editable by staff via admin UI)
create table partners (
  id            text primary key,
  name          text not null,
  short         text,
  description   text,
  phone         text,
  website       text,
  services      text[],
  populations   text[],
  languages     text[],
  medicaid      boolean,
  sliding_scale boolean,
  hours         text,
  region        text,
  urgent        boolean default false,
  updated_at    timestamptz default now()
);

-- Community calendar
create table events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null,
  time        text,
  type        text,
  location    text,
  description text,
  author_id   uuid references auth.users(id),
  author_name text,
  status      text default 'pending',      -- 'pending' | 'approved' | 'rejected'
  created_at  timestamptz default now()
);

-- Volunteer opportunities + signups
create table volunteer_opportunities (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  program     text,
  date        date,
  time        text,
  location    text,
  spots       int,
  description text,
  contact     text,
  author_id   uuid references auth.users(id),
  status      text default 'pending',
  created_at  timestamptz default now()
);

create table volunteer_signups (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid references volunteer_opportunities(id) on delete cascade,
  name           text not null,
  contact        text,
  note           text,
  user_id        uuid references auth.users(id),
  created_at     timestamptz default now()
);

-- Community board
create table posts (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                -- 'announcement' | 'story' | 'question' | 'resource'
  title       text,
  body        text not null,
  author_id   uuid references auth.users(id),
  author_name text,
  status      text default 'pending',
  flag_count  int default 0,
  created_at  timestamptz default now()
);

create table post_flags (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references posts(id) on delete cascade,
  user_id    uuid references auth.users(id),
  reason     text,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- Bill tracking (ingested from LegiScan / mo-gov)
create table bills (
  id         text primary key,              -- e.g. 'MO-2026-SB123'
  session    text,
  number     text,
  title      text,
  status     text,
  summary    text,
  url        text,
  committees text[],
  topics     text[],
  last_action       text,
  last_action_at    date,
  updated_at        timestamptz default now()
);

-- Referral (warm handoff to a partner)
create table referrals (
  id               uuid primary key default gen_random_uuid(),
  partner_id       text references partners(id),
  requester_name   text,
  requester_phone  text,
  requester_email  text,
  notes            text,
  consent          boolean not null,
  status           text default 'new',      -- 'new' | 'sent' | 'acknowledged' | 'closed'
  created_at       timestamptz default now()
);

-- Action alert subscriptions (opt-in)
create table action_alert_subscribers (
  user_id    uuid primary key references auth.users(id),
  topics     text[],                         -- ['988','cit','parity','holds','youth']
  email      text,
  created_at timestamptz default now()
);
```

### Row Level Security

RLS policies enforce privacy from the browser directly. Examples:

```sql
-- Events: anyone can read approved events; authors can update their own
alter table events enable row level security;
create policy events_select on events for select
  using (status = 'approved' or author_id = auth.uid());
create policy events_insert on events for insert
  with check (auth.uid() is not null and author_id = auth.uid() and status = 'pending');
create policy events_author_update on events for update
  using (author_id = auth.uid()) with check (author_id = auth.uid() and status in ('pending','approved'));

-- Posts: approved visible to all; author can edit theirs; moderators can change status
create policy posts_select on posts for select using (status = 'approved' or author_id = auth.uid());
create policy posts_insert on posts for insert with check (auth.uid() = author_id);
create policy posts_moderate on posts for update using (
  exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'moderator')
);
```

A `user_roles` helper table identifies moderators/admins; staff tooling writes there.

---

## Migration path

### Phase 1 — Wire up, shared calendar only (1 week)
Lowest-risk feature to prove the stack. The calendar already has `Store.push("events", ...)` boundaries — swap to Supabase client calls without touching any module rendering.

1. Create Supabase project; apply the `events` table + RLS.
2. Add `supabase-js` to `index.html` (or bundle).
3. New `src/data.js` abstraction that mirrors `Store`'s API and falls back to it when offline. `data.events.list()`, `data.events.create()`, etc.
4. Add magic-link sign-in — a small *Sign in to post events* flow; reading is anonymous.
5. Build a staff moderation view at `#admin/events` (gated by `user_roles.role = 'moderator'`).
6. Flip `renderCalendar` + `saveEvent` to use `data.events`.

Acceptance: two devices see the same event once it's approved.

### Phase 2 — Community board + volunteer signups + partner directory (2 weeks)
Same pattern.

- Port `Store.get("posts")` → `data.posts` with moderation queue.
- Port volunteer opportunities + signups.
- Promote `partners-data.js` from static JS to `partners` table; staff edit via a lightweight admin UI (or directly in Supabase's table editor at first).
- Add post flags + report flow; safe-messaging review queue for moderators.

### Phase 3 — Live bill tracking + action alerts (2 weeks)
Starts touching Edge Functions and cron.

- Edge Function `ingest-bills` runs hourly via Supabase Cron; fetches from LegiScan (or mo-gov's file outputs), upserts into `bills`.
- Policy module gains a "Current bills" panel pulled from `bills`.
- Action Alert subscription UI in the Advocacy module — opt-in by topic; email send via Edge Function (Resend, Postmark, or SendGrid).

### Phase 4 — Warm-handoff referrals + staff dashboard (1–2 weeks)

- "Refer me to this partner" button on partner cards. Captures consent explicitly. Edge Function forwards the referral to the partner's intake email.
- Staff dashboard: aggregated, anonymous counts (page views, crisis-card prints, safety-plans-started, referrals-sent). No PII.

---

## Things that stay on-device forever

Non-negotiable for the product. Safety plan, coping tools, supporter guide, mood check-in, stories, wallet cards, bookmarks, display preferences — **never syncs, never leaves the device**. The `Store` boundary stays as-is for these. The copy on every one of these pages promises this in plain language; we keep the promise.

If users later want optional cross-device sync for their own data, that's a separate, explicitly-opt-in feature with end-to-end encryption.

---

## Security + privacy notes

- **RLS on every table.** No exceptions. Default-deny, add policies as features ship.
- **Service-role key only used server-side** (Edge Functions). Never in client JS.
- **No PII in anonymous signals.** The staff dashboard only gets counts and bucketed timings.
- **Referrals require explicit consent** and only send what the user typed into the consent form.
- **Posts are pending by default** and only become public after moderator review.
- **Flag + unflag** flow gives users a way to remove harmful content fast; flag count thresholds can auto-hide pending review.
- **Safe-messaging guidelines** embedded in the post composer (no method/detail language in stories).
- **Rate limits** on post/event create via Edge Function check; blocks obvious spam.
- **2FA required** for admin / moderator accounts.
- **Data export + delete** endpoints for every authenticated user (GDPR-adjacent good hygiene, even though we're not GDPR-governed).
- **Backups** — Supabase's daily backups are enabled by default; restore tested quarterly.

---

## Cost estimate

- **Supabase free tier**: covers development and likely Phase 1–2. $0/month.
- **Pro tier (if/when needed)**: $25/month for 8 GB DB, 250 GB bandwidth. Probably sufficient for this traffic for a long time.
- **Transactional email** (Resend / Postmark): $0–15/month at low volume.
- **Domain + DNS**: whatever you're paying now, unchanged.

Total projected steady-state: **$0–40/month**.

---

## When to pull the trigger

- Right now the static prototype is complete end-to-end. It can be shared, used, and printed.
- Pull the trigger on Phase 1 if: (a) NAMI STL staff want to post real events that persist across devices, or (b) the community board needs to be real.
- Don't pull the trigger for: private features (they don't need it), nor for "because it's more real" (it's less private with a backend, not more).

---

## Open questions

1. **Email domain for auth / alerts** — do we want `@namistl.org` or a subdomain? Mail deliverability is better with a configured domain.
2. **Moderator coverage** — who's on call to review posts? The community board only works if pending posts clear within hours, not days. Without that, we should not ship the community board server-side.
3. **LegiScan access** — free tier is 30 API calls / 30 seconds; probably enough for hourly ingest, but we should confirm licensing for the data we'd redistribute.
4. **HIPAA surface area** — we do not hold PHI today. Referrals blur the line. We should keep referrals transmission-only (don't store PHI server-side; forward + discard) or get a Supabase Business tier BAA if we must store.
5. **Bilingual content plan** — if Spanish/Bosnian translations come via a CMS, that's its own table. If translations are in-repo, no DB change.

---

## Recommendation

**Adopt Supabase. Implement Phase 1 (shared calendar) as the smoke test. Reassess after that ships.** The rest of the roadmap follows the same pattern, so Phase 1 proves or disproves the approach with the least risk.
