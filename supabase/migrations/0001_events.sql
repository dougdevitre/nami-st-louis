-- Phase 1 schema: shared community calendar
-- Apply via Supabase SQL editor, or run `supabase db push` with the CLI.

-- === events ===
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  date          date not null,
  time          text,
  type          text,
  location      text,
  description   text,
  author_id     uuid references auth.users(id) on delete set null,
  author_name   text,
  status        text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists events_status_date_idx on public.events (status, date);

-- === user_roles (staff + moderators) ===
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('moderator','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_moderator()
returns boolean
language sql security definer set search_path = public as $$
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('moderator','admin')
  );
$$;

-- === Row Level Security ===
alter table public.events enable row level security;
alter table public.user_roles enable row level security;

-- Events: anyone (including anonymous) can read approved events; authors can read their own pending ones
drop policy if exists events_select_approved on public.events;
create policy events_select_approved on public.events
  for select
  using (status = 'approved' or author_id = auth.uid() or public.is_moderator());

-- Authenticated users can insert pending events attributed to themselves
drop policy if exists events_insert on public.events;
create policy events_insert on public.events
  for insert
  with check (
    auth.uid() is not null
    and author_id = auth.uid()
    and status = 'pending'
  );

-- Authors can update title/date/etc on their own events while still pending
drop policy if exists events_author_update on public.events;
create policy events_author_update on public.events
  for update
  using (author_id = auth.uid() and status in ('pending','approved'))
  with check (author_id = auth.uid() and status in ('pending','approved'));

-- Moderators can update any event (including setting status to approved or rejected)
drop policy if exists events_mod_update on public.events;
create policy events_mod_update on public.events
  for update
  using (public.is_moderator())
  with check (public.is_moderator());

-- Authors can delete their own events; moderators can delete any
drop policy if exists events_delete on public.events;
create policy events_delete on public.events
  for delete
  using (author_id = auth.uid() or public.is_moderator());

-- user_roles: visible to the row owner only; writable only by admins
drop policy if exists user_roles_self_select on public.user_roles;
create policy user_roles_self_select on public.user_roles
  for select using (user_id = auth.uid() or public.is_moderator());

-- (Admin writes to user_roles go through the service-role key via the Supabase
-- dashboard or an Edge Function. No public policies for INSERT/UPDATE here.)

-- === updated_at trigger ===
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
  for each row execute function public.set_updated_at();
