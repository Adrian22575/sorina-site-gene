import crypto from 'node:crypto'
import {
  bookingSlots,
  bookedAppointmentsForDate,
  cleanString,
  getSupabaseBookingConfig,
  hasBookingConfig,
  isValidDate,
  normalizeTime,
  normalizeBookingSettings,
  readBookingSettings,
  saveBookingSettings,
  sendJson,
  serviceDurationMinutes,
  slotOverlapsAppointments,
  supabaseBookingFetch,
} from '../_booking.js'
import {
  isValidEmail,
  normalizeNotificationSettings,
  readNotificationSettings,
  replaceAppointmentReminder,
  saveNotificationSettings,
  sendTestNotificationEmail,
} from '../_email.js'

const statuses = new Set(['new', 'contacted', 'confirmed', 'cancelled'])
const activeStatuses = new Set(['new', 'contacted', 'confirmed'])
const fallbackServiceDurations = new Map([
  ['Efect natural', 60],
  ['Volum delicat', 90],
  ['Efect intens', 120],
  ['Laminare gene / sprancene', 60],
])

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function isAuthorized(request) {
  const expected = process.env.ADMIN_PASSWORD || ''
  const received = request.headers['x-admin-password'] || ''
  return Boolean(expected && received && safeEqual(received, expected))
}

async function readBody(request) {
  if (typeof request.body === 'string') return JSON.parse(request.body || '{}')
  if (typeof request.body === 'object' && request.body !== null) return request.body
  return {}
}

function appointmentPayload(body, fallback = {}) {
  const status = cleanString(body.status ?? fallback.status ?? 'new', 40)

  return {
    full_name: cleanString(body.full_name ?? fallback.full_name, 120),
    phone: cleanString(body.phone ?? fallback.phone, 40),
    email: cleanString(body.email ?? fallback.email, 160),
    service: cleanString(body.service ?? fallback.service, 80),
    preferred_date: cleanString(body.preferred_date ?? fallback.preferred_date, 20),
    preferred_time: normalizeTime(body.preferred_time ?? fallback.preferred_time),
    message: cleanString(body.message ?? fallback.message, 1200),
    internal_notes: cleanString(body.internal_notes ?? fallback.internal_notes, 1200),
    status: statuses.has(status) ? status : 'new',
  }
}

function validateAppointment(payload, slots) {
  if (!payload.full_name) return 'Numele clientei este obligatoriu.'
  if (!payload.phone) return 'Telefonul clientei este obligatoriu.'
  if (!payload.service) return 'Serviciul este obligatoriu.'
  if (!isValidDate(payload.preferred_date)) return 'Alege o data valida.'
  if (!slots.includes(payload.preferred_time)) return 'Alege o ora din sloturile configurate.'
  return ''
}

async function ensureAvailableSlot(config, payload, appointmentId = '') {
  if (!activeStatuses.has(payload.status)) return

  const serviceDurations = await readServiceDurations(config)
  const appointmentDuration = serviceDurationMinutes(payload.service, serviceDurations)
  const bookedAppointments = await bookedAppointmentsForDate(config, payload.preferred_date, appointmentId)

  if (slotOverlapsAppointments(payload.preferred_time, appointmentDuration, bookedAppointments, serviceDurations)) {
    const error = new Error('Acest interval este deja ocupat de alta clienta.')
    error.status = 409
    throw error
  }
}

async function readServiceDurations(config) {
  const result = await supabaseBookingFetch(config, 'site_services?select=title,duration&order=sort_order.asc,title.asc')

  if (!result.ok) return new Map(fallbackServiceDurations)

  const rows = await result.json()
  return rows.length
    ? new Map(rows.map((service) => [service.title, serviceDurationMinutes(service)]))
    : new Map(fallbackServiceDurations)
}

async function listAppointments(config) {
  const result = await supabaseBookingFetch(
    config,
    'appointments?select=id,full_name,phone,email,service,preferred_date,preferred_time,message,status,source,internal_notes,created_at,updated_at&order=preferred_date.asc,preferred_time.asc,created_at.desc&limit=300',
  )

  if (!result.ok) throw new Error('Programarile nu au putut fi citite.')
  return result.json()
}

async function createAppointment(config, body) {
  const payload = appointmentPayload(body)
  const bookingSettings = await readBookingSettings(config)
  const validationError = validateAppointment(payload, bookingSlots(bookingSettings))
  if (validationError) return { status: 400, error: validationError }

  await ensureAvailableSlot(config, payload)

  const result = await supabaseBookingFetch(config, 'appointments', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      ...payload,
      source: 'admin',
      user_agent: 'admin',
    }),
  })

  if (!result.ok) return { status: result.status === 409 ? 409 : 400, error: 'Programarea nu a putut fi creata.' }

  const appointment = (await result.json())[0]
  await replaceAppointmentReminder(config, appointment)
  return { status: 201, appointment }
}

async function readAppointment(config, id) {
  const result = await supabaseBookingFetch(
    config,
    `appointments?id=eq.${encodeURIComponent(id)}&select=id,full_name,phone,email,service,preferred_date,preferred_time,message,status,source,internal_notes,created_at,updated_at`,
  )

  if (!result.ok) throw new Error('Programarea nu a putut fi citita.')
  const rows = await result.json()
  return rows[0] || null
}

async function updateAppointment(config, id, body) {
  const current = await readAppointment(config, id)
  if (!current) return { status: 404, error: 'Programarea nu exista.' }

  const payload = appointmentPayload(body, current)
  const bookingSettings = await readBookingSettings(config)
  const validationError = validateAppointment(payload, bookingSlots(bookingSettings))
  if (validationError) return { status: 400, error: validationError }

  await ensureAvailableSlot(config, payload, id)

  const result = await supabaseBookingFetch(config, `appointments?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })

  if (!result.ok) return { status: result.status === 409 ? 409 : 400, error: 'Programarea nu a putut fi salvata.' }

  const appointment = (await result.json())[0]
  await replaceAppointmentReminder(config, appointment)
  return { status: 200, appointment }
}

async function deleteAppointment(config, id) {
  const current = await readAppointment(config, id)
  if (!current) return { status: 404, error: 'Programarea nu exista.' }

  await replaceAppointmentReminder(config, { ...current, status: 'cancelled' })

  const result = await supabaseBookingFetch(config, `appointments?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  if (!result.ok) return { status: 400, error: 'Programarea nu a putut fi stearsa.' }
  return { status: 200, ok: true }
}

export default async function handler(request, response) {
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return sendJson(response, 405, { error: 'Metoda nu este permisa.' })
  }

  if (!isAuthorized(request)) {
    return sendJson(response, 401, { error: 'Parola de admin nu este valida sau nu este configurata.' })
  }

  const config = getSupabaseBookingConfig()
  if (!config) return sendJson(response, 503, { error: 'Supabase nu este configurat pentru programari.' })
  if (!hasBookingConfig(config)) return sendJson(response, 503, { error: 'SUPABASE_SERVICE_ROLE_KEY nu este o cheie service_role valida.' })

  try {
    if (request.method === 'GET') {
      const bookingSettings = await readBookingSettings(config)
      return sendJson(response, 200, {
        appointments: await listAppointments(config),
        notifications: await readNotificationSettings(config),
        booking_settings: bookingSettings,
        slots: bookingSlots(bookingSettings),
      })
    }

    const body = await readBody(request)

    if (body.test_email) {
      const testSettings = body.notifications ? normalizeNotificationSettings(body.notifications) : await readNotificationSettings(config)
      if (!testSettings.email || !isValidEmail(testSettings.email)) {
        return sendJson(response, 400, { error: 'Adresa de email pentru test nu este valida.' })
      }

      const testResult = await sendTestNotificationEmail(config, testSettings)
      return sendJson(response, 200, { ok: true, test: testResult })
    }

    if (body.booking_settings) {
      const bookingSettings = normalizeBookingSettings(body.booking_settings)
      const savedSettings = await saveBookingSettings(config, bookingSettings)
      return sendJson(response, 200, {
        booking_settings: savedSettings,
        slots: bookingSlots(savedSettings),
      })
    }

    if (body.notifications) {
      const notifications = normalizeNotificationSettings(body.notifications)
      if (notifications.email && !isValidEmail(notifications.email)) {
        return sendJson(response, 400, { error: 'Adresa de email pentru notificari nu este valida.' })
      }

      const savedSettings = await saveNotificationSettings(config, notifications)
      const activeAppointments = (await listAppointments(config)).filter((appointment) => activeStatuses.has(appointment.status))
      await Promise.allSettled(activeAppointments.map((appointment) => replaceAppointmentReminder(config, appointment)))
      return sendJson(response, 200, { notifications: savedSettings })
    }

    if (request.method === 'POST') {
      const result = await createAppointment(config, body)
      return sendJson(response, result.status, result.error ? { error: result.error } : { appointment: result.appointment })
    }

    const id = cleanString(request.query.id, 80)
    if (!id) return sendJson(response, 400, { error: 'ID-ul programarii lipseste.' })

    if (request.method === 'DELETE') {
      const result = await deleteAppointment(config, id)
      return sendJson(response, result.status, result.error ? { error: result.error } : { ok: true })
    }

    const result = await updateAppointment(config, id, body)
    return sendJson(response, result.status, result.error ? { error: result.error } : { appointment: result.appointment })
  } catch (error) {
    return sendJson(response, error.status || 500, { error: error.message || 'A aparut o eroare.' })
  }
}
