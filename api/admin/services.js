import crypto from 'node:crypto'

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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140)
}

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

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return {
    baseUrl: supabaseUrl.replace(/\/$/, ''),
    serviceRoleKey,
  }
}

function servicePayload(body) {
  const title = cleanString(body.title, 120)
  const slug = cleanString(body.slug, 140) || slugify(title)
  const duration = cleanString(body.duration, 40)
  const priceLabel = cleanString(body.price || body.price_label, 80)
  const note = cleanString(body.note, 500)
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0
  const isActive = body.is_active === false || body.is_active === 'false' ? false : true

  return {
    title,
    slug,
    duration,
    price_label: priceLabel || 'Pret de completat',
    note,
    sort_order: sortOrder,
    is_active: isActive,
  }
}

async function readBody(request) {
  if (typeof request.body === 'string') {
    return JSON.parse(request.body || '{}')
  }

  if (typeof request.body === 'object' && request.body !== null) {
    return request.body
  }

  return {}
}

async function supabaseFetch(config, path, options = {}) {
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

async function listServices(config) {
  const endpoint = 'site_services?select=id,title,slug,duration,price_label,note,sort_order,is_active&order=sort_order.asc,title.asc'
  const result = await supabaseFetch(config, endpoint)

  if (!result.ok) {
    throw new Error('Serviciile nu au putut fi citite.')
  }

  return result.json()
}

export default async function handler(request, response) {
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return sendJson(response, 405, { error: 'Metoda nu este permisa.' })
  }

  if (!isAuthorized(request)) {
    return sendJson(response, 401, { error: 'Parola de admin nu este valida sau nu este configurata.' })
  }

  const config = getSupabaseConfig()
  if (!config) {
    return sendJson(response, 503, { error: 'Supabase nu este configurat pentru admin.' })
  }

  try {
    if (request.method === 'GET') {
      return sendJson(response, 200, { services: await listServices(config) })
    }

    if (request.method === 'POST') {
      const body = await readBody(request)
      const payload = servicePayload(body)

      if (!payload.title || !payload.slug) {
        return sendJson(response, 400, { error: 'Titlul serviciului este obligatoriu.' })
      }

      const result = await supabaseFetch(config, 'site_services', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload),
      })

      if (!result.ok) {
        return sendJson(response, 400, { error: 'Serviciul nu a putut fi creat.' })
      }

      return sendJson(response, 201, { service: (await result.json())[0] })
    }

    const id = cleanString(request.query.id, 80)
    if (!id) {
      return sendJson(response, 400, { error: 'ID-ul serviciului lipseste.' })
    }

    if (request.method === 'PATCH') {
      const body = await readBody(request)
      const payload = servicePayload(body)

      if (!payload.title || !payload.slug) {
        return sendJson(response, 400, { error: 'Titlul serviciului este obligatoriu.' })
      }

      const result = await supabaseFetch(config, `site_services?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload),
      })

      if (!result.ok) {
        return sendJson(response, 400, { error: 'Serviciul nu a putut fi actualizat.' })
      }

      return sendJson(response, 200, { service: (await result.json())[0] })
    }

    const result = await supabaseFetch(config, `site_services?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })

    if (!result.ok) {
      return sendJson(response, 400, { error: 'Serviciul nu a putut fi sters.' })
    }

    return sendJson(response, 200, { ok: true })
  } catch (error) {
    return sendJson(response, 500, { error: error.message || 'A aparut o eroare.' })
  }
}
