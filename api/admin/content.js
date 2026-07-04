import crypto from 'node:crypto'
import {
  cleanString,
  collectionConfig,
  contactPayload,
  getSupabaseConfig,
  hasServiceRoleAccess,
  itemPayload,
  legalPayload,
  listSiteContent,
  readBody,
  sendJson,
  supabaseFetch,
  uploadGalleryImage,
  validatePayload,
} from '../_site-content.js'

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

async function saveSettings(config, settings) {
  const payloads = []
  if (settings.contact) payloads.push({ key: 'contact', value: contactPayload(settings.contact), error: 'Datele de contact nu au putut fi salvate.' })
  if (settings.legal) payloads.push({ key: 'legal', value: legalPayload(settings.legal), error: 'Datele legale nu au putut fi salvate.' })

  await Promise.all(payloads.map(async (payload) => {
    const result = await supabaseFetch(config, `site_settings?key=eq.${payload.key}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ key: payload.key, value: payload.value }),
    })

    if (result.ok) {
      const rows = await result.json().catch(() => [])
      if (Array.isArray(rows) && rows.length > 0) return
    }

    const insertResult = await supabaseFetch(config, 'site_settings', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ key: payload.key, value: payload.value }),
    })

    if (!insertResult.ok) throw new Error(payload.error)
  }))
}

async function createItem(config, type, body) {
  const collection = collectionConfig[type]
  if (!collection) throw new Error('Tipul de continut nu este valid.')

  const payload = itemPayload(type, body)
  if (type === 'gallery') {
    const imageUrl = await uploadGalleryImage(config, body)
    if (imageUrl) payload.image_url = imageUrl
    if (!payload.alt_text) payload.alt_text = payload.title
  }
  if (type === 'results') {
    const beforeImageUrl = await uploadGalleryImage(config, body, 'before_image_data', 'before_image_name')
    const afterImageUrl = await uploadGalleryImage(config, body, 'after_image_data', 'after_image_name')
    if (beforeImageUrl) payload.before_image_url = beforeImageUrl
    if (afterImageUrl) payload.after_image_url = afterImageUrl
  }

  const validationError = validatePayload(type, payload)
  if (validationError) return { error: validationError, status: 400 }

  const result = await supabaseFetch(config, collection.table, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })

  if (!result.ok) return { error: 'Elementul nu a putut fi creat.', status: 400 }
  return { item: (await result.json())[0], status: 201 }
}

async function updateItem(config, type, id, body) {
  const collection = collectionConfig[type]
  if (!collection) throw new Error('Tipul de continut nu este valid.')

  const payload = itemPayload(type, body)
  if (type === 'gallery') {
    const imageUrl = await uploadGalleryImage(config, body)
    if (imageUrl) payload.image_url = imageUrl
    if (!payload.alt_text) payload.alt_text = payload.title
  }
  if (type === 'results') {
    const beforeImageUrl = await uploadGalleryImage(config, body, 'before_image_data', 'before_image_name')
    const afterImageUrl = await uploadGalleryImage(config, body, 'after_image_data', 'after_image_name')
    if (beforeImageUrl) payload.before_image_url = beforeImageUrl
    if (afterImageUrl) payload.after_image_url = afterImageUrl
  }

  const validationError = validatePayload(type, payload)
  if (validationError) return { error: validationError, status: 400 }

  const result = await supabaseFetch(config, `${collection.table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })

  if (!result.ok) return { error: 'Elementul nu a putut fi actualizat.', status: 400 }
  return { item: (await result.json())[0], status: 200 }
}

async function deleteItem(config, type, id) {
  const collection = collectionConfig[type]
  if (!collection) throw new Error('Tipul de continut nu este valid.')

  const result = await supabaseFetch(config, `${collection.table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  if (!result.ok) return { error: 'Elementul nu a putut fi sters.', status: 400 }
  return { ok: true, status: 200 }
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
  if (!config) return sendJson(response, 503, { error: 'Supabase nu este configurat pentru admin.' })
  if (!hasServiceRoleAccess(config)) {
    return sendJson(response, 503, { error: 'SUPABASE_SERVICE_ROLE_KEY nu este o cheie service_role valida.' })
  }

  try {
    if (request.method === 'GET') {
      return sendJson(response, 200, await listSiteContent(config, false))
    }

    const body = await readBody(request)

    if (request.method === 'PATCH' && body.settings) {
      await saveSettings(config, body.settings)
      return sendJson(response, 200, { settings: (await listSiteContent(config, false)).settings })
    }

    const type = cleanString(request.query.type, 40)
    const id = cleanString(request.query.id, 80)

    if (request.method === 'POST') {
      const result = await createItem(config, type, body)
      return sendJson(response, result.status, result.error ? { error: result.error } : { item: result.item })
    }

    if (!id) return sendJson(response, 400, { error: 'ID-ul elementului lipseste.' })

    if (request.method === 'PATCH') {
      const result = await updateItem(config, type, id, body)
      return sendJson(response, result.status, result.error ? { error: result.error } : { item: result.item })
    }

    const result = await deleteItem(config, type, id)
    return sendJson(response, result.status, result.error ? { error: result.error } : { ok: true })
  } catch (error) {
    return sendJson(response, 500, { error: error.message || 'A aparut o eroare.' })
  }
}
