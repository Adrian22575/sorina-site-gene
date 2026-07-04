import crypto from 'node:crypto'
import {
  bookingTimeZone,
  cleanString,
  isValidDate,
  normalizeTime,
  supabaseBookingFetch,
  todayInBucharest,
  tomorrowInBucharest,
} from './_booking.js'

const defaultNotificationSettings = {
  email: '',
  notify_new: true,
  notify_daily: true,
  notify_before: true,
  notify_client_day_before: true,
  notify_client_hour_before: true,
}

const activeStatuses = new Set(['new', 'contacted', 'confirmed'])
const reminderStatuses = new Set(['confirmed'])

export function normalizeNotificationSettings(settings = {}) {
  const email = cleanString(settings.email || process.env.NOTIFICATION_EMAIL || '', 180)

  return {
    email,
    notify_new: settings.notify_new !== false,
    notify_daily: settings.notify_daily !== false,
    notify_before: settings.notify_before !== false,
    notify_client_day_before: settings.notify_client_day_before !== false,
    notify_client_hour_before: settings.notify_client_hour_before !== false,
  }
}

export function notificationSettingsPayload(settings = {}) {
  return normalizeNotificationSettings({
    ...defaultNotificationSettings,
    ...settings,
  })
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanString(value, 180))
}

export async function readNotificationSettings(config) {
  const result = await supabaseBookingFetch(config, 'site_settings?key=eq.notifications&select=value')
  if (!result.ok) return normalizeNotificationSettings()

  const rows = await result.json()
  return normalizeNotificationSettings(rows[0]?.value || {})
}

export async function saveNotificationSettings(config, settings) {
  const payload = {
    key: 'notifications',
    value: notificationSettingsPayload(settings),
  }

  const updateResult = await supabaseBookingFetch(config, 'site_settings?key=eq.notifications', {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })

  if (updateResult.ok) {
    const rows = await updateResult.json().catch(() => [])
    if (rows.length) return rows[0].value
  }

  const insertResult = await supabaseBookingFetch(config, 'site_settings', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })

  if (!insertResult.ok) throw new Error('Setarile de notificari nu au putut fi salvate.')

  const rows = await insertResult.json()
  return rows[0]?.value || payload.value
}

function escapeHtml(value) {
  return cleanString(String(value ?? ''), 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function appointmentTitle(appointment) {
  const name = appointment.full_name || 'Clienta'
  const date = appointment.preferred_date || 'data nealeasa'
  const time = normalizeTime(appointment.preferred_time) || 'ora nealeasa'
  return `${name} - ${date} ${time}`
}

function publicBaseUrl() {
  const explicitUrl = cleanString(process.env.PUBLIC_SITE_URL || '', 300)
  const vercelUrl = cleanString(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '', 300)
  const rawUrl = explicitUrl || (vercelUrl ? `https://${vercelUrl.replace(/^https?:\/\//, '')}` : '')
  return rawUrl.replace(/\/$/, '')
}

function actionSecret() {
  return process.env.APPOINTMENT_ACTION_SECRET
    || process.env.ADMIN_PASSWORD
    || process.env.CRON_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || ''
}

export function appointmentActionToken(appointmentId, action = 'confirm') {
  const id = cleanString(appointmentId, 120)
  const secret = actionSecret()
  if (!id || !secret) return ''

  return crypto
    .createHmac('sha256', secret)
    .update(`${cleanString(action, 40)}:${id}`)
    .digest('base64url')
}

export function verifyAppointmentActionToken(appointmentId, action, token) {
  const expected = appointmentActionToken(appointmentId, action)
  const received = cleanString(token, 120)
  if (!expected || !received) return false

  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(received)
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

function appointmentActionLinks(appointment) {
  const baseUrl = publicBaseUrl()
  if (!baseUrl || !appointment?.id) return []

  const appointmentId = encodeURIComponent(appointment.id)
  const confirmToken = appointmentActionToken(appointment.id, 'confirm')
  const links = []

  if (confirmToken) {
    links.push({
      label: 'Confirma din email',
      href: `${baseUrl}/api/admin/appointments?action=confirm&id=${appointmentId}&token=${encodeURIComponent(confirmToken)}`,
      primary: true,
    })
  }

  links.push({
    label: 'Deschide programarea',
    href: `${baseUrl}/admin/programari?appointment=${appointmentId}`,
    primary: false,
  })

  return links
}

function emailActionsHtml(actions = []) {
  if (!actions.length) return ''

  return `
    <div style="margin:22px 0 6px">
      ${actions.map((action) => `
        <a href="${escapeHtml(action.href)}" style="display:inline-block;margin:0 10px 10px 0;padding:12px 16px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #7a1024;background:${action.primary ? '#7a1024' : '#fffaf6'};color:${action.primary ? '#ffffff' : '#7a1024'}">${escapeHtml(action.label)}</a>
      `).join('')}
    </div>
  `
}

function appointmentHtml(title, appointment, intro, actions = []) {
  const rows = [
    ['Clienta', appointment.full_name],
    ['Telefon', appointment.phone],
    ['Email', appointment.email],
    ['Serviciu', appointment.service],
    ['Data', appointment.preferred_date],
    ['Ora', normalizeTime(appointment.preferred_time)],
    ['Status', appointment.status || 'new'],
    ['Mesaj', appointment.message],
    ['Note interne', appointment.internal_notes],
  ].filter(([, value]) => cleanString(value || '', 1200))

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#241917">
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px">${escapeHtml(intro)}</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border-top:1px solid #eaded7;padding:10px 12px;font-weight:700;width:130px">${escapeHtml(label)}</td>
            <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      ${emailActionsHtml(actions)}
      <p style="font-size:12px;color:#705f58;margin-top:18px">Email automat din site-ul Sorina Lash Studio.</p>
    </div>
  `
}

function clientAppointmentHtml(title, appointment, intro) {
  const rows = [
    ['Serviciu', appointment.service],
    ['Data', appointment.preferred_date],
    ['Ora', normalizeTime(appointment.preferred_time)],
    ['Telefon studio', process.env.PUBLIC_CONTACT_PHONE || 'Telefonul studioului este afisat pe site.'],
  ].filter(([, value]) => cleanString(value || '', 1200))

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#241917">
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
      <p style="margin:0 0 18px">${escapeHtml(intro)}</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="border-top:1px solid #eaded7;padding:10px 12px;font-weight:700;width:130px">${escapeHtml(label)}</td>
            <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      <p style="font-size:12px;color:#705f58;margin-top:18px">Email automat din site-ul Sorina Lash Studio. Daca nu mai poti ajunge, te rugam sa contactezi studioul cat mai repede.</p>
    </div>
  `
}

function digestHtml(date, appointments) {
  const rows = appointments.map((appointment) => `
    <tr>
      <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(normalizeTime(appointment.preferred_time) || '-')}</td>
      <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(appointment.full_name || 'Clienta')}</td>
      <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(appointment.service || '-')}</td>
      <td style="border-top:1px solid #eaded7;padding:10px 12px">${escapeHtml(appointment.phone || '-')}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#241917">
      <h1 style="font-size:20px;margin:0 0 12px">Programari pentru maine</h1>
      <p style="margin:0 0 18px">Pentru ${escapeHtml(date)} ai ${appointments.length} programari active.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th align="left" style="padding:10px 12px">Ora</th>
            <th align="left" style="padding:10px 12px">Clienta</th>
            <th align="left" style="padding:10px 12px">Serviciu</th>
            <th align="left" style="padding:10px 12px">Telefon</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:12px;color:#705f58;margin-top:18px">Email automat din site-ul Sorina Lash Studio.</p>
    </div>
  `
}

function testEmailHtml() {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#241917">
      <h1 style="font-size:20px;margin:0 0 12px">Email test Sorina Lash Studio</h1>
      <p style="margin:0 0 18px">Acesta este un email de test pentru confirmarile si reminder-ele automate ale site-ului.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
        <tr>
          <td style="border-top:1px solid #eaded7;padding:10px 12px;font-weight:700;width:130px">Status</td>
          <td style="border-top:1px solid #eaded7;padding:10px 12px">Daca ai primit acest email, conexiunea Resend functioneaza.</td>
        </tr>
        <tr>
          <td style="border-top:1px solid #eaded7;padding:10px 12px;font-weight:700;width:130px">Urmatorul pas</td>
          <td style="border-top:1px solid #eaded7;padding:10px 12px">Testeaza o programare reala si verifica notificarea catre Sorina si catre clienta.</td>
        </tr>
      </table>
      <p style="font-size:12px;color:#705f58;margin-top:18px">Email automat din site-ul Sorina Lash Studio.</p>
    </div>
  `
}

function resendUsageHeaders(headers) {
  return {
    daily_quota: headers.get('x-resend-daily-quota') || '',
    monthly_quota: headers.get('x-resend-monthly-quota') || '',
    rate_limit: headers.get('ratelimit-limit') || '',
    rate_remaining: headers.get('ratelimit-remaining') || '',
    rate_reset: headers.get('ratelimit-reset') || '',
  }
}

async function resendRequest(path, options = {}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { skipped: true, reason: 'RESEND_API_KEY lipseste.' }

  const result = await fetch(`https://api.resend.com/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await result.json().catch(() => ({}))
  const usage = resendUsageHeaders(result.headers)
  if (!result.ok) {
    return { skipped: false, error: data.message || data.error || 'Emailul nu a putut fi trimis.', usage }
  }

  return { data, usage }
}

async function sendResendEmail({ to, subject, html, scheduledAt, idempotencyKey }) {
  const from = cleanString(process.env.RESEND_FROM_EMAIL || 'Sorina Studio <onboarding@resend.dev>', 180)
  if (!isValidEmail(to)) return { skipped: true, reason: 'Emailul de notificari nu este valid.' }

  const body = {
    from,
    to: [to],
    subject,
    html,
  }

  if (scheduledAt) body.scheduled_at = scheduledAt

  return resendRequest('emails', {
    method: 'POST',
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    body: JSON.stringify(body),
  })
}

async function logNotification(config, payload) {
  const result = await supabaseBookingFetch(config, 'appointment_notifications', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  })

  return result.ok
}

async function markNotification(config, id, payload) {
  const result = await supabaseBookingFetch(config, `appointment_notifications?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  })

  return result.ok
}

async function reminderRows(config, appointmentId) {
  const result = await supabaseBookingFetch(
    config,
    `appointment_notifications?appointment_id=eq.${encodeURIComponent(appointmentId)}&notification_type=in.(one_hour_before,client_one_day_before,client_one_hour_before)&select=id,resend_email_id,status`,
  )

  if (!result.ok) return []
  return result.json()
}

async function cancelResendEmail(emailId) {
  if (!emailId) return
  await resendRequest(`emails/${encodeURIComponent(emailId)}/cancel`, { method: 'POST' })
}

async function cancelExistingAppointmentReminder(config, appointmentId) {
  const rows = await reminderRows(config, appointmentId)
  await Promise.all(rows.map(async (row) => {
    if (row.resend_email_id && row.status === 'pending') await cancelResendEmail(row.resend_email_id)
    await markNotification(config, row.id, { status: 'skipped', error_message: 'Reminder inlocuit sau anulat.' })
  }))
}

async function hasSentNotification(config, appointmentId, type) {
  const result = await supabaseBookingFetch(
    config,
    `appointment_notifications?appointment_id=eq.${encodeURIComponent(appointmentId)}&notification_type=eq.${encodeURIComponent(type)}&status=eq.sent&select=id&limit=1`,
  )

  if (!result.ok) return false
  const rows = await result.json()
  return rows.length > 0
}

function zonedDateTimeToUtc(date, time, timeZone = bookingTimeZone) {
  if (!isValidDate(date) || !normalizeTime(time)) return null

  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = normalizeTime(time).split(':').map(Number)
  const targetUtc = Date.UTC(year, month - 1, day, hour, minute)
  let estimate = new Date(targetUtc)

  for (let index = 0; index < 3; index += 1) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      timeZone,
      year: 'numeric',
    }).formatToParts(estimate)
    const part = (type) => parts.find((item) => item.type === type)?.value || '0'
    const renderedUtc = Date.UTC(Number(part('year')), Number(part('month')) - 1, Number(part('day')), Number(part('hour')), Number(part('minute')))
    estimate = new Date(estimate.getTime() - (renderedUtc - targetUtc))
  }

  return estimate
}

function reminderDateForAppointment(appointment, minutesBefore = 60) {
  const appointmentDate = zonedDateTimeToUtc(appointment.preferred_date, appointment.preferred_time)
  if (!appointmentDate) return null

  const reminderDate = new Date(appointmentDate.getTime() - minutesBefore * 60 * 1000)
  const minDate = new Date(Date.now() + 2 * 60 * 1000)
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  if (reminderDate <= minDate || reminderDate > maxDate) return null
  return reminderDate
}

export async function sendNewAppointmentEmail(config, appointment) {
  const settings = await readNotificationSettings(config)
  if (!settings.notify_new || !settings.email) {
    await logNotification(config, {
      appointment_id: appointment.id,
      notification_type: 'new_appointment',
      recipient_email: settings.email || 'not-configured',
      resend_email_id: null,
      status: 'skipped',
      error_message: settings.notify_new
        ? 'Emailul Sorinei nu este configurat pentru notificari.'
        : 'Notificarea pentru programare noua este dezactivata.',
    })
    return
  }

  const subject = `Programare noua: ${appointmentTitle(appointment)}`
  const result = await sendResendEmail({
    to: settings.email,
    subject,
    html: appointmentHtml(subject, appointment, 'A intrat o cerere noua de programare.', appointmentActionLinks(appointment)),
    idempotencyKey: `new-${appointment.id}`,
  })

  await logNotification(config, {
    appointment_id: appointment.id,
    notification_type: 'new_appointment',
    recipient_email: settings.email,
    resend_email_id: result.data?.id || null,
    status: result.data?.id ? 'sent' : (result.skipped ? 'skipped' : 'failed'),
    error_message: result.reason || result.error || '',
  })
}

export async function sendTestNotificationEmail(config, settingsInput = {}) {
  const settings = normalizeNotificationSettings(settingsInput.email ? settingsInput : await readNotificationSettings(config))

  if (!settings.email || !isValidEmail(settings.email)) {
    const error = new Error('Adresa de email pentru test nu este valida.')
    error.status = 400
    throw error
  }

  const subject = 'Email test Sorina Lash Studio'
  const result = await sendResendEmail({
    to: settings.email,
    subject,
    html: testEmailHtml(),
    idempotencyKey: `test-${settings.email}-${Date.now()}`,
  })

  if (result.skipped || result.error) {
    const error = new Error(result.reason || result.error || 'Emailul test nu a putut fi trimis.')
    error.status = result.skipped ? 503 : 502
    error.usage = result.usage || {}
    throw error
  }

  return {
    id: result.data?.id || '',
    to: settings.email,
    usage: result.usage || {},
  }
}

export async function sendClientConfirmedEmail(config, appointment) {
  if (!appointment?.id || !isValidEmail(appointment.email)) return { skipped: true, reason: 'Clienta nu are email valid.' }

  const notificationType = 'client_confirmed'
  if (await hasSentNotification(config, appointment.id, notificationType)) {
    return { skipped: true, reason: 'Confirmarea catre clienta a fost deja trimisa.' }
  }

  const subject = 'Programarea ta la Sorina a fost confirmata'
  const result = await sendResendEmail({
    to: appointment.email,
    subject,
    html: clientAppointmentHtml(
      subject,
      appointment,
      'Buna! Programarea ta a fost confirmata. Te asteptam la data si ora de mai jos.',
    ),
    idempotencyKey: `client-confirmed-${appointment.id}-${appointment.preferred_date}-${normalizeTime(appointment.preferred_time)}`,
  })

  await logNotification(config, {
    appointment_id: appointment.id,
    notification_type: notificationType,
    recipient_email: appointment.email,
    resend_email_id: result.data?.id || null,
    status: result.data?.id ? 'sent' : (result.skipped ? 'skipped' : 'failed'),
    error_message: result.reason || result.error || '',
  })

  return {
    ok: Boolean(result.data?.id || result.skipped),
    skipped: Boolean(result.skipped),
    error: result.reason || result.error || '',
  }
}

export async function replaceAppointmentReminder(config, appointment) {
  if (!appointment?.id) return
  await cancelExistingAppointmentReminder(config, appointment.id)

  const settings = await readNotificationSettings(config)
  if (!activeStatuses.has(appointment.status || 'new')) return
  if (!reminderStatuses.has(appointment.status || 'new')) return

  const ownerReminderDate = reminderDateForAppointment(appointment)
  if (settings.notify_before && settings.email && ownerReminderDate) {
    const subject = `Reminder peste o ora: ${appointmentTitle(appointment)}`
    const result = await sendResendEmail({
      to: settings.email,
      subject,
      html: appointmentHtml(subject, appointment, 'Programarea aceasta incepe in aproximativ o ora.'),
      scheduledAt: ownerReminderDate.toISOString(),
      idempotencyKey: `one-hour-${appointment.id}-${appointment.preferred_date}-${normalizeTime(appointment.preferred_time)}`,
    })

    await logNotification(config, {
      appointment_id: appointment.id,
      notification_type: 'one_hour_before',
      recipient_email: settings.email,
      resend_email_id: result.data?.id || null,
      scheduled_for: ownerReminderDate.toISOString(),
      status: result.data?.id ? 'pending' : (result.skipped ? 'skipped' : 'failed'),
      error_message: result.reason || result.error || '',
    })
  }

  if (!isValidEmail(appointment.email)) return

  if (settings.notify_client_day_before) {
    const clientDayReminderDate = reminderDateForAppointment(appointment, 24 * 60)
    if (clientDayReminderDate) {
      const subject = 'Reminder programare maine la Sorina'
      const result = await sendResendEmail({
        to: appointment.email,
        subject,
        html: clientAppointmentHtml(subject, appointment, 'Buna! Iti reamintim ca ai programare maine la Sorina Lash Studio.'),
        scheduledAt: clientDayReminderDate.toISOString(),
        idempotencyKey: `client-day-${appointment.id}-${appointment.preferred_date}-${normalizeTime(appointment.preferred_time)}`,
      })

      await logNotification(config, {
        appointment_id: appointment.id,
        notification_type: 'client_one_day_before',
        recipient_email: appointment.email,
        resend_email_id: result.data?.id || null,
        scheduled_for: clientDayReminderDate.toISOString(),
        status: result.data?.id ? 'pending' : (result.skipped ? 'skipped' : 'failed'),
        error_message: result.reason || result.error || '',
      })
    }
  }

  if (settings.notify_client_hour_before) {
    const clientHourReminderDate = reminderDateForAppointment(appointment)
    if (clientHourReminderDate) {
      const subject = 'Programarea ta incepe intr-o ora'
      const result = await sendResendEmail({
        to: appointment.email,
        subject,
        html: clientAppointmentHtml(subject, appointment, 'Buna! Programarea ta la Sorina Lash Studio incepe in aproximativ o ora.'),
        scheduledAt: clientHourReminderDate.toISOString(),
        idempotencyKey: `client-hour-${appointment.id}-${appointment.preferred_date}-${normalizeTime(appointment.preferred_time)}`,
      })

      await logNotification(config, {
        appointment_id: appointment.id,
        notification_type: 'client_one_hour_before',
        recipient_email: appointment.email,
        resend_email_id: result.data?.id || null,
        scheduled_for: clientHourReminderDate.toISOString(),
        status: result.data?.id ? 'pending' : (result.skipped ? 'skipped' : 'failed'),
        error_message: result.reason || result.error || '',
      })
    }
  }
}

async function notificationExists(config, type, digestDate) {
  const result = await supabaseBookingFetch(
    config,
    `appointment_notifications?notification_type=eq.${type}&digest_date=eq.${digestDate}&select=id`,
  )

  if (!result.ok) return false
  const rows = await result.json()
  return rows.length > 0
}

async function appointmentsForDate(config, date) {
  const result = await supabaseBookingFetch(
    config,
    `appointments?preferred_date=eq.${date}&status=in.(new,contacted,confirmed)&select=id,full_name,phone,email,service,preferred_date,preferred_time,message,status,internal_notes&order=preferred_time.asc`,
  )

  if (!result.ok) throw new Error('Programarile pentru sumar nu au putut fi citite.')
  return result.json()
}

function dateAfterDays(dateValue, days) {
  if (!isValidDate(dateValue)) return dateValue
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))
  return date.toISOString().slice(0, 10)
}

async function upcomingConfirmedAppointments(config) {
  const startDate = todayInBucharest()
  const endDate = dateAfterDays(startDate, 30)
  const result = await supabaseBookingFetch(
    config,
    `appointments?preferred_date=gte.${startDate}&preferred_date=lte.${endDate}&status=eq.confirmed&select=id,full_name,phone,email,service,preferred_date,preferred_time,message,status,internal_notes&order=preferred_date.asc,preferred_time.asc&limit=300`,
  )

  if (!result.ok) throw new Error('Programarile confirmate pentru remindere nu au putut fi citite.')
  return result.json()
}

export async function ensureUpcomingAppointmentReminders(config) {
  const appointments = await upcomingConfirmedAppointments(config)
  let scheduled = 0

  await Promise.allSettled(appointments.map(async (appointment) => {
    const rows = await reminderRows(config, appointment.id)
    if (rows.some((row) => row.status === 'pending')) return

    await replaceAppointmentReminder(config, appointment)
    scheduled += 1
  }))

  return { checked: appointments.length, scheduled }
}

export async function sendTomorrowAppointmentDigest(config) {
  const settings = await readNotificationSettings(config)
  const digestDate = tomorrowInBucharest()

  if (!settings.notify_daily || !settings.email) {
    return { ok: true, skipped: true, reason: 'Notificarile zilnice nu sunt configurate.' }
  }

  if (await notificationExists(config, 'daily_tomorrow', digestDate)) {
    return { ok: true, skipped: true, reason: 'Sumarul pentru aceasta data exista deja.' }
  }

  const appointments = await appointmentsForDate(config, digestDate)
  const subject = `Maine ai ${appointments.length} programari`
  const result = await sendResendEmail({
    to: settings.email,
    subject,
    html: digestHtml(digestDate, appointments),
    idempotencyKey: `daily-${digestDate}`,
  })

  await logNotification(config, {
    digest_date: digestDate,
    notification_type: 'daily_tomorrow',
    recipient_email: settings.email,
    resend_email_id: result.data?.id || null,
    status: result.data?.id ? 'sent' : (result.skipped ? 'skipped' : 'failed'),
    error_message: result.reason || result.error || '',
  })

  return { ok: Boolean(result.data?.id || result.skipped), count: appointments.length, skipped: Boolean(result.skipped), error: result.error || '' }
}
