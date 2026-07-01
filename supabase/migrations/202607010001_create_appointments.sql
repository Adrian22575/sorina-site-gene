create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 5 and 40),
  email text check (email is null or char_length(email) <= 160),
  service text not null check (service in (
    'Natural Effect',
    'Soft Effect',
    'Intense Effect',
    'Lash / Brow Lamination'
  )),
  preferred_date date not null,
  preferred_time time,
  message text check (message is null or char_length(message) <= 1200),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled')),
  source text not null default 'website',
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

revoke all on table public.appointments from anon;
revoke all on table public.appointments from authenticated;

create index if not exists appointments_created_at_idx on public.appointments (created_at desc);
create index if not exists appointments_status_created_at_idx on public.appointments (status, created_at desc);
