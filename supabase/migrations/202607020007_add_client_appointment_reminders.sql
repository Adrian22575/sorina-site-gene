alter table public.appointment_notifications
  drop constraint if exists appointment_notifications_notification_type_check;

alter table public.appointment_notifications
  add constraint appointment_notifications_notification_type_check
  check (notification_type in (
    'new_appointment',
    'one_hour_before',
    'daily_tomorrow',
    'client_one_day_before',
    'client_one_hour_before'
  ));
