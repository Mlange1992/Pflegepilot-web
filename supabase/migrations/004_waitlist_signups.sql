create table if not exists waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'homepage',
  created_at timestamptz default now()
);

alter table waitlist_signups enable row level security;

-- Nur der Service-Role-Key darf lesen/schreiben (kein Public-Zugriff)
create policy "service_only" on waitlist_signups
  as restrictive
  for all
  using (false);
