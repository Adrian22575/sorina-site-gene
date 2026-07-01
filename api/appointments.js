const allowedMethods = ['POST']
const allowedServices = new Set([
  'Natural Effect',
  'Soft Effect',
  'Intense Effect',
  'Lash / Brow Lamination',
])

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidTime(value) {
  return value === '' || /^\d{2}:\d{2}$/.test(value)
}

export default async function handler(request, response) {
  if (!allowedMethods.includes(request.method)) {
    return sendJson(response, 405, { error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(response, 503, { error: 'Booking is not configured yet.' })
  }

  let body = {}
  if (typeof request.body === 'string') {
    try {
      body = JSON.parse(request.body)
    } catch {
      return sendJson(response, 400, { error: 'Invalid request body.' })
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
    preferred_time: cleanString(body.preferred_time, 20),
    message: cleanString(body.message, 1200),
    source: 'website',
    user_agent: cleanString(request.headers['user-agent'] || '', 300),
  }

  if (body.privacy_consent !== 'yes') {
    return sendJson(response, 400, { error: 'Este nevoie de acordul pentru prelucrarea datelor de programare.' })
  }

  if (!appointment.full_name || !appointment.phone || !appointment.service || !appointment.preferred_date) {
    return sendJson(response, 400, { error: 'Completeaza numele, telefonul, serviciul si data preferata.' })
  }

  if (!allowedServices.has(appointment.service)) {
    return sendJson(response, 400, { error: 'Serviciul ales nu este valid.' })
  }

  if (!isValidDate(appointment.preferred_date) || !isValidTime(appointment.preferred_time)) {
    return sendJson(response, 400, { error: 'Data sau ora nu este valida.' })
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/appointments`
  const supabaseResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(appointment),
  })

  if (!supabaseResponse.ok) {
    return sendJson(response, 502, { error: 'Programarea nu a putut fi salvata.' })
  }

  return sendJson(response, 200, { ok: true })
}
