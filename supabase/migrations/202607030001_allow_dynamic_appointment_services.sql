alter table public.appointments
drop constraint if exists appointments_service_check;

alter table public.appointments
add constraint appointments_service_length_check
check (char_length(service) between 2 and 160);
