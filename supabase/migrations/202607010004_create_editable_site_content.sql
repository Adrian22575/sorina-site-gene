create table if not exists public.site_settings (
  key text primary key check (char_length(key) between 2 and 80),
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 140),
  image_url text not null default '',
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null default 'Nume clienta de completat' check (char_length(customer_name) between 2 and 120),
  review_text text not null check (char_length(review_text) between 10 and 700),
  rating integer not null default 5 check (rating between 1 and 5),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_promotions (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default 'Oferta speciala' check (char_length(eyebrow) between 2 and 80),
  title text not null check (char_length(title) between 2 and 140),
  description text not null check (char_length(description) between 10 and 700),
  cta_label text not null default 'Cere detalii' check (char_length(cta_label) between 2 and 80),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 5 and 180),
  answer text not null check (char_length(answer) between 10 and 900),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.site_gallery enable row level security;
alter table public.site_reviews enable row level security;
alter table public.site_promotions enable row level security;
alter table public.site_faqs enable row level security;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists site_gallery_set_updated_at on public.site_gallery;
create trigger site_gallery_set_updated_at
before update on public.site_gallery
for each row
execute function public.set_updated_at();

drop trigger if exists site_reviews_set_updated_at on public.site_reviews;
create trigger site_reviews_set_updated_at
before update on public.site_reviews
for each row
execute function public.set_updated_at();

drop trigger if exists site_promotions_set_updated_at on public.site_promotions;
create trigger site_promotions_set_updated_at
before update on public.site_promotions
for each row
execute function public.set_updated_at();

drop trigger if exists site_faqs_set_updated_at on public.site_faqs;
create trigger site_faqs_set_updated_at
before update on public.site_faqs
for each row
execute function public.set_updated_at();

insert into public.site_settings (key, value)
values (
  'contact',
  '{
    "area": "Zona Izvor, Bucuresti - de confirmat",
    "phone": "Telefon de completat",
    "instagram": "Instagram de completat",
    "schedule": "Program de completat",
    "map_label": "Harta sau zona de acces"
  }'::jsonb
)
on conflict (key) do nothing;

insert into public.site_gallery (title, image_url, alt_text, sort_order, is_active)
values
  ('Fotografie principala din galerie', '', 'Fotografie principala din galerie', 10, true),
  ('Detaliu lucrare', '', 'Detaliu lucrare', 20, true),
  ('Portret', '', 'Portret', 30, true),
  ('Atmosfera studio', '', 'Atmosfera studio', 40, true),
  ('Rezultat final', '', 'Rezultat final', 50, true)
on conflict do nothing;

insert into public.site_reviews (customer_name, review_text, rating, sort_order, is_active)
values
  ('Nume clienta de completat', 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.', 5, 10, true),
  ('Nume clienta de completat', 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.', 5, 20, true),
  ('Nume clienta de completat', 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.', 5, 30, true)
on conflict do nothing;

insert into public.site_promotions (eyebrow, title, description, cta_label, sort_order, is_active)
values (
  'Oferta speciala',
  'Promotie de completat',
  'Loc rezervat pentru o reducere reala, un pachet sau o campanie cu termen clar.',
  'Cere detalii',
  10,
  true
)
on conflict do nothing;

insert into public.site_faqs (question, answer, sort_order, is_active)
values
  ('Cat rezista extensiile de gene?', 'Rezistenta depinde de ritmul natural de crestere, tipul genelor si ingrijirea de acasa. Intervalul potrivit pentru intretinere se stabileste la consultatie.', 10, true),
  ('Doare aplicarea extensiilor?', 'Aplicarea trebuie sa fie confortabila. Daca apare sensibilitate, se ajusteaza pozitia sau tehnica pentru ca programarea sa ramana calma.', 20, true),
  ('Pot afecta genele naturale?', 'Extensiile sunt gandite sa respecte genele naturale atunci cand lungimea, grosimea si densitatea sunt alese corect.', 30, true),
  ('Cum ma pregatesc inainte de programare?', 'Vino fara machiaj in zona ochilor si evita produsele uleioase inainte de aplicare. Confirmarea finala se face inainte de programare.', 40, true),
  ('La cat timp se face intretinerea?', 'Ritmul de intretinere se recomanda individual, dupa stilul de viata si felul in care se pastreaza extensiile.', 50, true)
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-gallery',
  'site-gallery',
  true,
  4194304,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
