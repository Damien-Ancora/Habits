-- DiSIMpline habit tracker — Supabase schema
-- Idempotent: safe to run again over an existing database (SQL Editor > New query > Run).
--
-- IMPORTANT: the app stores ALL its data (habits, day plan, trainings, weekly
-- reports, nutrition, settings…) inside a single JSONB blob per user. New app
-- features add keys to that blob, so this schema does NOT need to change when
-- the app evolves. Running this file is only useful to (re)create the table or
-- to apply the optional robustness improvements below.

create table if not exists public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Backfill columns if the table already existed without them
alter table public.app_state add column if not exists created_at timestamptz not null default now();

alter table public.app_state enable row level security;

-- Keep updated_at authoritative on the server (independent of the client clock)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_state_set_updated_at on public.app_state;
create trigger app_state_set_updated_at
  before update on public.app_state
  for each row execute function public.set_updated_at();

-- Row Level Security: each user can only ever touch their own row,
-- even though the anon/publishable key is public.
drop policy if exists "Users can read their own state" on public.app_state;
create policy "Users can read their own state"
  on public.app_state for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own state" on public.app_state;
create policy "Users can insert their own state"
  on public.app_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own state" on public.app_state;
create policy "Users can update their own state"
  on public.app_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own state" on public.app_state;
create policy "Users can delete their own state"
  on public.app_state for delete
  using (auth.uid() = user_id);
