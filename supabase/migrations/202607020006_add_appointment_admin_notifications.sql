alter table public.appointments
  add column if not exists internal_notes text not null default '',
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.appointment_notifications (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete cascade,
  notification_type text not null check (notification_type in ('new_appointment', 'one_hour_before', 'daily_tomorrow')),
  digest_date date,
  recipient_email text not null,
  resend_email_id text,
  scheduled_for timestamptz,
  status text not null default 'pending' check (status in ('pending', 'sent', 'skipped', 'failed')),
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (notification_type = 'daily_tomorrow' and digest_date is not null)
    or (notification_type <> 'daily_tomorrow' and appointment_id is not null)
  )
);

alter table public.appointment_notifications enable row level security;

revoke all on table public.appointment_notifications from anon;
revoke all on table public.appointment_notifications from authenticated;

create unique index if not exists appointment_notifications_appointment_type_idx
on public.appointment_notifications (appointment_id, notification_type)
where appointment_id is not null
  and status in ('pending', 'sent');

create unique index if not exists appointment_notifications_digest_type_idx
on public.appointment_notifications (digest_date, notification_type)
where digest_date is not null
  and status in ('pending', 'sent');

create index if not exists appointments_date_time_idx
on public.appointments (preferred_date, preferred_time);

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

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

drop trigger if exists appointment_notifications_set_updated_at on public.appointment_notifications;
create trigger appointment_notifications_set_updated_at
before update on public.appointment_notifications
for each row execute function public.set_updated_at();
