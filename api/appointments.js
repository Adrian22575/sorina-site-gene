import {
  availabilityForDate,
  bookedTimesForDate,
  bookingSlots,
  cleanString,
  getSupabaseBookingConfig,
  hasBookingConfig,
  isPastDate,
  isValidDate,
  normalizeTime,
  sendJson,
  supabaseBookingFetch,
  todayInBucharest,
} from './_booking.js'
import { replaceAppointmentReminder, sendNewAppointmentEmail } from './_email.js'

const allowedMethods = ['GET', 'POST']
const fallbackServices = [
  'Efect natural',
  'Volum delicat',
  'Efect intens',
  'Laminare gene / sprancene',
]

async function getAllowedServices(supabaseUrl, serviceRoleKey) {
  const endpoint = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/site_services`)
  endpoint.searchParams.set('select', 'title')
  endpoint.searchParams.set('is_active', 'eq.true')
  endpoint.searchParams.set('order', 'sort_order.asc,title.asc')

  const supabaseResponse = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  })

  if (!supabaseResponse.ok) {
    return new Set(fallbackServices)
  }

  const rows = await supabaseResponse.json()
  return new Set(rows.length ? rows.map((row) => row.title) : fallbackServices)
}

export default async function handler(request, response) {
  if (!allowedMethods.includes(request.method)) {
    return sendJson(response, 405, { error: 'Method not allowed' })
  }

  const config = getSupabaseBookingConfig()

  if (!config) {
    return sendJson(response, 503, { error: 'Programarile nu sunt configurate inca.' })
  }

  if (!hasBookingConfig(config)) {
    return sendJson(response, 503, { error: 'Programarile nu sunt configurate cu o cheie service_role valida.' })
  }

  if (request.method === 'GET') {
    const date = cleanString(request.query.date, 20)
    if (!isValidDate(date)) return sendJson(response, 400, { error: 'Alege o data valida.' })

    try {
      return sendJson(response, 200, {
        date,
        min_date: todayInBucharest(),
        slots: await availabilityForDate(config, date),
      })
    } catch (error) {
      return sendJson(response, 500, { error: error.message || 'Sloturile nu au putut fi incarcate.' })
    }
  }

  let body = {}
  if (typeof request.body === 'string') {
    try {
      body = JSON.parse(request.body)
    } catch {
      return sendJson(response, 400, { error: 'Cererea trimisa nu este valida.' })
    }
  } else if (typeof request.body === 'object' && request.body !== null) {
    body = request.body
  }

  if (cleanString(body.company, 80)) {
    return sendJson(response, 200, { ok: true })
  }

  const appointment = {
    full_name: cleanString(body.full_name, 120),
    phone: cleanString(body.phone, 40),
    email: cleanString(body.email, 160),
    service: cleanString(body.service, 80),
    preferred_date: cleanString(body.preferred_date, 20),
    preferred_time: normalizeTime(body.preferred_time),
    message: cleanString(body.message, 1200),
    source: 'website',
    user_agent: cleanString(request.headers['user-agent'] || '', 300),
  }

  if (body.privacy_consent !== 'yes') {
    return sendJson(response, 400, { error: 'Este nevoie de acordul pentru prelucrarea datelor de programare.' })
  }

  if (!appointment.full_name || !appointment.phone || !appointment.service || !appointment.preferred_date || !appointment.preferred_time) {
    return sendJson(response, 400, { error: 'Completeaza numele, telefonul, serviciul, data si ora.' })
  }

  const allowedServices = await getAllowedServices(config.baseUrl, config.serviceRoleKey)
  if (!allowedServices.has(appointment.service)) {
    return sendJson(response, 400, { error: 'Serviciul ales nu este valid.' })
  }

  if (!isValidDate(appointment.preferred_date) || isPastDate(appointment.preferred_date)) {
    return sendJson(response, 400, { error: 'Data sau ora nu este valida.' })
  }

  if (!bookingSlots().includes(appointment.preferred_time)) {
    return sendJson(response, 400, { error: 'Ora aleasa nu este disponibila pentru programari online.' })
  }

  const bookedTimes = await bookedTimesForDate(config, appointment.preferred_date)
  if (bookedTimes.has(appointment.preferred_time)) {
    return sendJson(response, 409, { error: 'Acest interval este deja blocat. Alege alta ora.' })
  }

  const supabaseResponse = await supabaseBookingFetch(config, 'appointments', {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(appointment),
  })

  if (!supabaseResponse.ok) {
    if (supabaseResponse.status === 409) {
      return sendJson(response, 409, { error: 'Acest interval tocmai a fost ocupat. Alege alta ora.' })
    }
    return sendJson(response, 502, { error: 'Programarea nu a putut fi salvata.' })
  }

  const savedAppointment = (await supabaseResponse.json())[0]
  await Promise.allSettled([
    sendNewAppointmentEmail(config, savedAppointment),
    replaceAppointmentReminder(config, savedAppointment),
  ])

  return sendJson(response, 200, { ok: true })
}
