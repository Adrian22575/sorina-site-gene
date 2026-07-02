alter table public.site_services
  add column if not exists image_alt_text text not null default '';

alter table public.site_results
  add column if not exists before_alt_text text not null default '',
  add column if not exists after_alt_text text not null default '',
  add column if not exists caption text not null default '';
