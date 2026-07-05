-- DiSIMpline habit tracker — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).
-- Stores one JSON blob per authenticated user; Row Level Security ensures a user
-- can only ever read or write their own row, even though the anon key is public.

create table if not exists public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

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
