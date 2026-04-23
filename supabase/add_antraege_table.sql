-- Anträge-Tabelle: Speichert ausgefüllte Pflegegrad-Anträge pro Nutzer
-- Ausführen in: Supabase Dashboard → SQL Editor

create table if not exists antraege (
  id           uuid         primary key default gen_random_uuid(),
  user_id      uuid         references auth.users(id) on delete cascade not null,
  created_at   timestamptz  default now(),
  title        text         not null,
  pflegegrad   int,
  antrag_json  text         not null   -- JSON-kodierte AntragData
);

-- Row Level Security
alter table antraege enable row level security;

create policy "Users can manage own antraege"
  on antraege for all
  using (auth.uid() = user_id);
