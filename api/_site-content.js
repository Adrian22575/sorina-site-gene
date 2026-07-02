import crypto from 'node:crypto'

export const fallbackContent = {
  settings: {
    contact: {
      area: 'Zona Izvor, Bucuresti - de confirmat',
      phone: 'Telefon de completat',
      instagram: 'Instagram de completat',
      schedule: 'Program de completat',
      map_label: 'Harta sau zona de acces',
    },
  },
  gallery: [
    { title: 'Fotografie principala din galerie', image_url: '', alt_text: 'Fotografie principala din galerie' },
    { title: 'Detaliu lucrare', image_url: '', alt_text: 'Detaliu lucrare' },
    { title: 'Portret', image_url: '', alt_text: 'Portret' },
    { title: 'Atmosfera studio', image_url: '', alt_text: 'Atmosfera studio' },
    { title: 'Rezultat final', image_url: '', alt_text: 'Rezultat final' },
  ],
  results: [
    { title: 'Ridicare naturala', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 10, is_active: true },
    { title: 'Volum delicat', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 20, is_active: true },
    { title: 'Set intens', before_image_url: '', after_image_url: '', before_alt_text: '', after_alt_text: '', caption: '', sort_order: 30, is_active: true },
  ],
  reviews: [
    {
      customer_name: 'Nume clienta de completat',
      review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
      rating: 5,
    },
    {
      customer_name: 'Nume clienta de completat',
      review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
      rating: 5,
    },
    {
      customer_name: 'Nume clienta de completat',
      review_text: 'Recenzie reala de completat dupa ce primim acordul clientei pentru publicare.',
      rating: 5,
    },
  ],
  promotions: [
    {
      eyebrow: 'Oferta speciala',
      title: 'Promotie de completat',
      description: 'Loc rezervat pentru o reducere reala, un pachet sau o campanie cu termen clar.',
      cta_label: 'Cere detalii',
    },
  ],
  faqs: [
    {
      question: 'Cat rezista extensiile de gene?',
      answer: 'Rezistenta depinde de ritmul natural de crestere, tipul genelor si ingrijirea de acasa. Intervalul potrivit pentru intretinere se stabileste la consultatie.',
    },
    {
      question: 'Doare aplicarea extensiilor?',
      answer: 'Aplicarea trebuie sa fie confortabila. Daca apare sensibilitate, se ajusteaza pozitia sau tehnica pentru ca programarea sa ramana calma.',
    },
    {
      question: 'Pot afecta genele naturale?',
      answer: 'Extensiile sunt gandite sa respecte genele naturale atunci cand lungimea, grosimea si densitatea sunt alese corect.',
    },
    {
      question: 'Cum ma pregatesc inainte de programare?',
      answer: 'Vino fara machiaj in zona ochilor si evita produsele uleioase inainte de aplicare. Confirmarea finala se face inainte de programare.',
    },
    {
      question: 'La cat timp se face intretinerea?',
      answer: 'Ritmul de intretinere se recomanda individual, dupa stilul de viata si felul in care se pastreaza extensiile.',
    },
  ],
}

export const collectionConfig = {
  gallery: {
    table: 'site_gallery',
    select: 'id,title,image_url,alt_text,sort_order,is_active',
    order: 'sort_order.asc,title.asc',
  },
  reviews: {
    table: 'site_reviews',
    select: 'id,customer_name,review_text,rating,sort_order,is_active',
    order: 'sort_order.asc,customer_name.asc',
  },
  results: {
    table: 'site_results',
    select: 'id,title,before_image_url,after_image_url,before_alt_text,after_alt_text,caption,sort_order,is_active',
    order: 'sort_order.asc,title.asc',
  },
  promotions: {
    table: 'site_promotions',
    select: 'id,eyebrow,title,description,cta_label,sort_order,is_active',
    order: 'sort_order.asc,title.asc',
  },
  faqs: {
    table: 'site_faqs',
    select: 'id,question,answer,sort_order,is_active',
    order: 'sort_order.asc,question.asc',
  },
}

export function sendJson(response, status, payload, cacheControl = 'no-store') {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Cache-Control', cacheControl)
  response.end(JSON.stringify(payload))
}

export function cleanString(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

export function cleanInteger(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback
}

export function cleanBoolean(value) {
  return value === false || value === 'false' ? false : true
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) return null

  return {
    baseUrl: supabaseUrl.replace(/\/$/, ''),
    serviceRoleKey,
    keyRole: readJwtRole(serviceRoleKey),
  }
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

export function hasServiceRoleAccess(config) {
  return Boolean(config && (!config.keyRole || config.keyRole === 'service_role'))
}

export async function readBody(request) {
  if (typeof request.body === 'string') return JSON.parse(request.body || '{}')
  if (typeof request.body === 'object' && request.body !== null) return request.body
  return {}
}

export async function supabaseFetch(config, path, options = {}) {
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

export async function listCollection(config, type, activeOnly = true) {
  const collection = collectionConfig[type]
  if (!collection) throw new Error('Colectia nu este valida.')

  const endpoint = new URL(`${config.baseUrl}/rest/v1/${collection.table}`)
  endpoint.searchParams.set('select', collection.select)
  endpoint.searchParams.set('order', collection.order)
  if (activeOnly) endpoint.searchParams.set('is_active', 'eq.true')

  const result = await fetch(endpoint, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
  })

  if (!result.ok) throw new Error(`Colectia ${type} nu a putut fi citita.`)
  return result.json()
}

export async function listSettings(config) {
  const result = await supabaseFetch(config, 'site_settings?select=key,value')
  if (!result.ok) throw new Error('Setarile nu au putut fi citite.')

  const rows = await result.json()
  return rows.reduce((settings, row) => ({ ...settings, [row.key]: row.value || {} }), {})
}

export async function listSiteContent(config, activeOnly = true) {
  const [settings, gallery, results, reviews, promotions, faqs] = await Promise.all([
    listSettings(config),
    listCollection(config, 'gallery', activeOnly),
    listCollection(config, 'results', activeOnly),
    listCollection(config, 'reviews', activeOnly),
    listCollection(config, 'promotions', activeOnly),
    listCollection(config, 'faqs', activeOnly),
  ])

  return { settings, gallery, results, reviews, promotions, faqs }
}

function baseItemPayload(body) {
  return {
    sort_order: cleanInteger(body.sort_order),
    is_active: cleanBoolean(body.is_active),
  }
}

export function itemPayload(type, body) {
  if (type === 'gallery') {
    return {
      ...baseItemPayload(body),
      title: cleanString(body.title, 140),
      image_url: cleanString(body.image_url, 900),
      alt_text: cleanString(body.alt_text, 180),
    }
  }

  if (type === 'reviews') {
    return {
      ...baseItemPayload(body),
      customer_name: cleanString(body.customer_name, 120) || 'Nume clienta de completat',
      review_text: cleanString(body.review_text, 700),
      rating: Math.min(5, Math.max(1, cleanInteger(body.rating, 5))),
    }
  }

  if (type === 'results') {
    return {
      ...baseItemPayload(body),
      title: cleanString(body.title, 140),
      before_image_url: cleanString(body.before_image_url, 900),
      after_image_url: cleanString(body.after_image_url, 900),
      before_alt_text: cleanString(body.before_alt_text, 220),
      after_alt_text: cleanString(body.after_alt_text, 220),
      caption: cleanString(body.caption, 220),
    }
  }

  if (type === 'promotions') {
    return {
      ...baseItemPayload(body),
      eyebrow: cleanString(body.eyebrow, 80) || 'Oferta speciala',
      title: cleanString(body.title, 140),
      description: cleanString(body.description, 700),
      cta_label: cleanString(body.cta_label, 80) || 'Cere detalii',
    }
  }

  if (type === 'faqs') {
    return {
      ...baseItemPayload(body),
      question: cleanString(body.question, 180),
      answer: cleanString(body.answer, 900),
    }
  }

  throw new Error('Tipul de continut nu este valid.')
}

export function validatePayload(type, payload) {
  if (type === 'gallery' && !payload.title) return 'Titlul imaginii este obligatoriu.'
  if (type === 'results' && !payload.title) return 'Titlul rezultatului este obligatoriu.'
  if (type === 'reviews' && !payload.review_text) return 'Textul recenziei este obligatoriu.'
  if (type === 'promotions' && (!payload.title || !payload.description)) return 'Titlul si descrierea promotiei sunt obligatorii.'
  if (type === 'faqs' && (!payload.question || !payload.answer)) return 'Intrebarea si raspunsul sunt obligatorii.'
  return ''
}

export function contactPayload(body) {
  return {
    area: cleanString(body.area, 180),
    phone: cleanString(body.phone, 80),
    instagram: cleanString(body.instagram, 120),
    schedule: cleanString(body.schedule, 180),
    map_label: cleanString(body.map_label, 180),
  }
}

export async function uploadGalleryImage(config, body, dataField = 'image_data', nameField = 'image_name') {
  const dataUrl = cleanString(body[dataField], 15_000_000)
  if (!dataUrl) return ''

  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/)
  if (!match) throw new Error('Imaginea trebuie sa fie JPG, PNG sau WEBP.')

  const [, mimeType, base64Data] = match
  const buffer = Buffer.from(base64Data, 'base64')
  if (buffer.length > 10 * 1024 * 1024) throw new Error('Imaginea trebuie sa fie sub 10 MB.')

  const extension = mimeType.split('/')[1].replace('jpeg', 'jpg')
  const safeName = cleanString(body[nameField], 100).replace(/[^a-zA-Z0-9._-]/g, '-')
  const objectName = `${Date.now()}-${crypto.randomUUID()}-${safeName || `galerie.${extension}`}`

  const result = await fetch(`${config.baseUrl}/storage/v1/object/site-gallery/${objectName}`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': mimeType,
      'x-upsert': 'false',
    },
    body: buffer,
  })

  if (!result.ok) throw new Error('Imaginea nu a putut fi incarcata.')

  return `${config.baseUrl}/storage/v1/object/public/site-gallery/${encodeURIComponent(objectName)}`
}
