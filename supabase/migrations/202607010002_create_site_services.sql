create table if not exists public.site_services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique check (char_length(slug) between 2 and 140),
  duration text not null default '',
  price_label text not null default 'Pret de completat',
  note text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_services enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_services_set_updated_at on public.site_services;
create trigger site_services_set_updated_at
before update on public.site_services
for each row
execute function public.set_updated_at();

insert into public.site_services (title, slug, duration, price_label, note, sort_order, is_active)
values
  ('Efect natural', 'efect-natural', '60 min', 'Pret de completat', 'Gene fine, aerisite, pentru un rezultat discret si elegant.', 10, true),
  ('Volum delicat', 'volum-delicat', '90 min', 'Pret de completat', 'Volum fin, privire luminoasa si linie rafinata.', 20, true),
  ('Efect intens', 'efect-intens', '120 min', 'Pret de completat', 'Efect vizibil, construit cu atentie dupa forma ochilor.', 30, true),
  ('Laminare gene / sprancene', 'laminare-gene-sprancene', '60 min', 'Pret de completat', 'Definire si aranjare pentru gene sau sprancene naturale.', 40, true)
on conflict (slug) do update set
  title = excluded.title,
  duration = excluded.duration,
  price_label = excluded.price_label,
  note = excluded.note,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
