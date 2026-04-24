# Supabase setup — Phase 1 (shared calendar)

This brings the calendar online as a shared feature. Without this setup the site still works — every module falls back to `localStorage` as before.

## Prerequisites
- A Supabase account (free tier is enough for this phase)
- A project domain or local host you'll serve the site from

## 1. Create the project
1. Go to https://app.supabase.com and create a new project.
2. Region: pick one close to St. Louis (e.g., `us-east-1`).
3. Save the database password somewhere safe.

## 2. Apply the schema
Either route works.

**Via the SQL editor (easiest):**
1. Open the SQL editor in the Supabase dashboard.
2. Paste the contents of `supabase/migrations/0001_events.sql`.
3. Run it.

**Via the Supabase CLI:**
```bash
supabase link --project-ref YOUR-REF
supabase db push
```

## 3. Configure auth
1. Authentication → Providers → **Email** — enable "Email confirmations" OFF (we use magic links only).
2. Authentication → URL configuration → **Site URL**: set to the site's root (e.g., `https://dougdevitre.github.io/nami-st-louis/`).
3. Authentication → Email templates → "Magic Link": fine as-is; customize wording if you like.

## 4. Make yourself a moderator
Run this in the SQL editor once you've signed in to the live site at least once (so your `auth.users` row exists):

```sql
insert into public.user_roles (user_id, role)
select id, 'moderator' from auth.users where email = 'you@example.com';
```

## 5. Wire the site to Supabase
1. In the site repo, copy `config.js.example` to `config.js`.
2. Fill in:
   - `supabaseUrl`: Settings → API → URL
   - `supabaseAnonKey`: Settings → API → anon public key
3. Deploy. (`config.js` is gitignored; add it to your hosting environment as a build step or commit to a private deploy branch — do not commit to the public repo.)

> The anon public key is **public-safe**: Row Level Security decides what it can actually do. Never deploy the `service_role` key to the browser.

## 6. Smoke test
1. Open the site in two browsers / devices.
2. In browser A, sign in (click the link in the footer), then post a new event.
3. Expect the event to show up as **pending** — readers don't see it yet.
4. In browser B (signed in as the moderator you created in step 4), visit the Calendar tab. A "Review pending events" card at the top shows the event; click **Approve**.
5. Browser A now sees the event in the grid.

If that works, Phase 1 is live. Move on to Phase 2 in the main `ARCHITECTURE.md` roadmap.

## Rolling back
Delete `config.js` and the site instantly reverts to local-only mode. No data loss: the events in Supabase stay there; the site just stops reading them. Paste `config.js` back whenever you're ready.

## What's stored

Only events. Nothing about the safety plan, mood check-in, stories, wallet cards, bookmarks, coping tools, supporter guide, or reading preferences leaves the device — Phase 1 does not touch any of that.
