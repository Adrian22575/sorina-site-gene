import {
  fallbackContent,
  getSupabaseConfig,
  hasServiceRoleAccess,
  listSiteContent,
  sendJson,
} from './_site-content.js'

const fallbackServices = [
  {
    title: 'Efect natural',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Gene fine, aerisite, pentru un rezultat discret si elegant.',
    image_url: '',
  },
  {
    title: 'Volum delicat',
    duration: '90 min',
    price: 'Pret de completat',
    note: 'Volum fin, privire luminoasa si linie rafinata.',
    image_url: '',
  },
  {
    title: 'Efect intens',
    duration: '120 min',
    price: 'Pret de completat',
    note: 'Efect vizibil, construit cu atentie dupa forma ochilor.',
    image_url: '',
  },
  {
    title: 'Laminare gene / sprancene',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Definire si aranjare pentru gene sau sprancene naturale.',
    image_url: '',
  },
]

function mapService(row) {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration,
    price: row.price_label,
    note: row.note,
    image_url: row.image_url,
    image_alt_text: row.image_alt_text,
    isActive: row.is_active,
    sort_order: row.sort_order,
  }
}

async function listServices(config) {
  const endpoint = new URL(`${config.baseUrl}/rest/v1/site_services`)
  endpoint.searchParams.set('select', 'id,title,duration,price_label,note,image_url,image_alt_text,is_active,sort_order')
  endpoint.searchParams.set('is_active', 'eq.true')
  endpoint.searchParams.set('order', 'sort_order.asc,title.asc')

  const supabaseResponse = await fetch(endpoint, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
  })

  if (!supabaseResponse.ok) throw new Error('Serviciile nu au putut fi citite.')

  const rows = await supabaseResponse.json()
  return rows.length ? rows.map(mapService) : fallbackServices
}

function fallbackPayload() {
  return {
    services: fallbackServices,
    ...fallbackContent,
    source: 'fallback',
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Metoda nu este permisa.' })
  }

  const config = getSupabaseConfig()
  if (!config || !hasServiceRoleAccess(config)) {
    return sendJson(response, 200, fallbackPayload(), 's-maxage=60, stale-while-revalidate=300')
  }

  try {
    const [services, content] = await Promise.all([
      listServices(config),
      listSiteContent(config, true),
    ])

    return sendJson(response, 200, {
      services,
      settings: { ...fallbackContent.settings, ...content.settings },
      gallery: content.gallery.length ? content.gallery : fallbackContent.gallery,
      results: content.results.length ? content.results : fallbackContent.results,
      reviews: content.reviews.length ? content.reviews : fallbackContent.reviews,
      promotions: content.promotions.length ? content.promotions : fallbackContent.promotions,
      faqs: content.faqs.length ? content.faqs : fallbackContent.faqs,
      source: 'database',
    }, 's-maxage=60, stale-while-revalidate=300')
  } catch {
    return sendJson(response, 200, fallbackPayload(), 's-maxage=60, stale-while-revalidate=300')
  }
}
