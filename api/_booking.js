export const bookingTimeZone = 'Europe/Bucharest'

export const defaultBookingSettings = {
  start_time: '10:00',
  end_time: '18:00',
}

function minutesFromTime(value) {
  const time = normalizeTime(value)
  if (!time) return null
  const [hour, minute] = time.split(':').map(Number)
  if (hour > 23 || minute > 59) return null
  return hour * 60 + minute
}

function timeFromMinutes(value) {
  const hour = String(Math.floor(value / 60)).padStart(2, '0')
  const minute = String(value % 60).padStart(2, '0')
  return `${hour}:${minute}`
}

export function normalizeBookingSettings(settings = {}) {
  const defaultStart = minutesFromTime(defaultBookingSettings.start_time)
  const defaultEnd = minutesFromTime(defaultBookingSettings.end_time)
  const startMinutes = minutesFromTime(settings.start_time)
  const endMinutes = minutesFromTime(settings.end_time)
  const safeStart = startMinutes === null ? defaultStart : startMinutes
  const safeEnd = endMinutes === null ? defaultEnd : endMinutes

  if (safeEnd <= safeStart) {
    return { ...defaultBookingSettings }
  }

  return {
    start_time: timeFromMinutes(safeStart),
    end_time: timeFromMinutes(safeEnd),
  }
}

function generateDefaultBookingSlots() {
  return bookingSlots(defaultBookingSettings)
}

export function bookingSlots(settings = null) {
  const slots = []
  const bookingSettings = settings ? normalizeBookingSettings(settings) : null

  if (!bookingSettings) {
    return defaultBookingSlots
  }

  const startMinutes = minutesFromTime(bookingSettings.start_time)
  const endMinutes = minutesFromTime(bookingSettings.end_time)

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 15) {
    slots.push(timeFromMinutes(minutes))
  }

  return slots
}

export const defaultBookingSlots = generateDefaultBookingSlots()

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

export async function readBookingSettings(config) {
  const result = await supabaseBookingFetch(config, 'site_settings?key=eq.booking&select=value')
  if (!result.ok) return normalizeBookingSettings()

  const rows = await result.json()
  return normalizeBookingSettings(rows[0]?.value || {})
}

export async function saveBookingSettings(config, settings) {
  const payload = {
    key: 'booking',
    value: normalizeBookingSettings(settings),
  }

  const updateResult = await supabaseBookingFetch(config, 'site_settings?key=eq.booking', {
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

  if (!insertResult.ok) throw new Error('Orele de programari nu au putut fi salvate.')

  const rows = await insertResult.json()
  return rows[0]?.value || payload.value
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
  const bookingSettings = await readBookingSettings(config)
  const slots = bookingSlots(bookingSettings)
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
