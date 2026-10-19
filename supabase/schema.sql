-- Spiele-Tracker Datenbankschema
-- Im Supabase Dashboard unter "SQL Editor" einfügen und ausführen.

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  win_condition text not null default 'higher' check (win_condition in ('higher', 'lower')),
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  played_at date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player text not null check (player in ('Anja', 'Valentin')),
  score numeric not null
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security aktivieren
alter table games enable row level security;
alter table matches enable row level security;
alter table scores enable row level security;
alter table notes enable row level security;

-- Dies ist eine private Spaß-App für zwei Personen mit dem öffentlichen
-- anon-Key. Jeder, der den Supabase-URL + anon-Key kennt, kann lesen und
-- schreiben. Für diesen Anwendungsfall ausreichend, aber nicht für
-- sensible Daten geeignet.
create policy "allow all select games" on games for select using (true);
create policy "allow all insert games" on games for insert with check (true);
create policy "allow all delete games" on games for delete using (true);

create policy "allow all select matches" on matches for select using (true);
create policy "allow all insert matches" on matches for insert with check (true);
create policy "allow all delete matches" on matches for delete using (true);

create policy "allow all select scores" on scores for select using (true);
create policy "allow all insert scores" on scores for insert with check (true);
create policy "allow all delete scores" on scores for delete using (true);

create policy "allow all select notes" on notes for select using (true);
create policy "allow all insert notes" on notes for insert with check (true);
create policy "allow all delete notes" on notes for delete using (true);
