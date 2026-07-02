export const bookingTimeZone = 'Europe/Bucharest'

export const defaultBookingSlots = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

export function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

export function cleanString(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function normalizeTime(value) {
  const cleanValue = cleanString(value, 20)
  const match = cleanValue.match(/^(\d{2}):(\d{2})(?::\d{2})?$/)
  if (!match) return ''
  return `${match[1]}:${match[2]}`
}

export function bookingSlots() {
  const envSlots = cleanString(process.env.BOOKING_SLOT_TIMES, 500)
    .split(',')
    .map((slot) => normalizeTime(slot))
    .filter(Boolean)

  return envSlots.length ? [...new Set(envSlots)] : defaultBookingSlots
}

export function todayInBucharest(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    timeZone: bookingTimeZone,
    year: 'numeric',
  }).formatToParts(date)
  const part = (type) => parts.find((item) => item.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function tomorrowInBucharest() {
  return todayInBucharest(new Date(Date.now() + 24 * 60 * 60 * 1000))
}

export function isPastDate(value) {
  return isValidDate(value) && value < todayInBucharest()
}

export function readJwtRole(key) {
  const parts = key.split('.')
  if (parts.length < 2) return ''

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return typeof payload.role === 'string' ? payload.role : ''
  } catch {
    return ''
  }
}

export function getSupabaseBookingConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  return {
    baseUrl: supabaseUrl.replace(/\/$/, ''),
    serviceRoleKey,
    keyRole: readJwtRole(serviceRoleKey),
  }
}

export function hasBookingConfig(config) {
  return Boolean(config && (!config.keyRole || config.keyRole === 'service_role'))
}

export async function supabaseBookingFetch(config, path, options = {}) {
  return fetch(`${config.baseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

export async function bookedTimesForDate(config, date) {
  const endpoint = new URL(`${config.baseUrl}/rest/v1/appointments`)
  endpoint.searchParams.set('select', 'preferred_time,status')
  endpoint.searchParams.set('preferred_date', `eq.${date}`)
  endpoint.searchParams.set('status', 'neq.cancelled')

  const result = await fetch(endpoint, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
  })

  if (!result.ok) throw new Error('Sloturile ocupate nu au putut fi citite.')

  const rows = await result.json()
  return new Set(rows.map((row) => normalizeTime(row.preferred_time)).filter(Boolean))
}

export async function bookedTimesForDateExcept(config, date, appointmentId = '') {
  const endpoint = new URL(`${config.baseUrl}/rest/v1/appointments`)
  endpoint.searchParams.set('select', 'id,preferred_time,status')
  endpoint.searchParams.set('preferred_date', `eq.${date}`)
  endpoint.searchParams.set('status', 'neq.cancelled')
  if (appointmentId) endpoint.searchParams.set('id', `neq.${appointmentId}`)

  const result = await fetch(endpoint, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
  })

  if (!result.ok) throw new Error('Sloturile ocupate nu au putut fi citite.')

  const rows = await result.json()
  return new Set(rows.map((row) => normalizeTime(row.preferred_time)).filter(Boolean))
}

export async function availabilityForDate(config, date) {
  const slots = bookingSlots()
  const bookedTimes = isValidDate(date) && !isPastDate(date)
    ? await bookedTimesForDate(config, date)
    : new Set()

  return slots.map((time) => ({
    time,
    label: time,
    is_booked: bookedTimes.has(time),
    is_available: isValidDate(date) && !isPastDate(date) && !bookedTimes.has(time),
  }))
}
