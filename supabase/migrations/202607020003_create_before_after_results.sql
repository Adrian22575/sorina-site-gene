create table if not exists public.site_results (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 140),
  before_image_url text not null default '',
  after_image_url text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_results enable row level security;

drop trigger if exists site_results_set_updated_at on public.site_results;
create trigger site_results_set_updated_at
before update on public.site_results
for each row
execute function public.set_updated_at();

insert into public.site_results (title, before_image_url, after_image_url, sort_order, is_active)
values
  ('Ridicare naturala', '', '', 10, true),
  ('Volum delicat', '', '', 20, true),
  ('Set intens', '', '', 30, true)
on conflict do nothing;
