create unique index if not exists appointments_unique_active_slot_idx
on public.appointments (preferred_date, preferred_time)
where preferred_time is not null
  and status in ('new', 'contacted', 'confirmed');
