-- Saved enquiry list for the portfolio contact form.
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run.
-- The public (anon) key can only INSERT. Nobody can read enquiries with that key;
-- review them in Dashboard → Table Editor → enquiries.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  company text default '' check (char_length(company) <= 160),
  topic text not null check (char_length(topic) <= 80),
  message text not null check (char_length(message) between 1 and 4000),
  source text default 'portfolio',
  status text not null default 'new'
);

alter table public.enquiries enable row level security;

drop policy if exists "public can submit enquiries" on public.enquiries;
create policy "public can submit enquiries"
  on public.enquiries for insert
  to anon
  with check (status = 'new');

-- No select/update/delete policies for anon: enquiries stay private.
