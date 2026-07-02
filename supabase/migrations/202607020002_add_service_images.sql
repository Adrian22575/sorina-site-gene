alter table public.site_services
add column if not exists image_url text not null default '';
