const fallbackServices = [
  {
    title: 'Efect natural',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Gene fine, aerisite, pentru un rezultat discret si elegant.',
  },
  {
    title: 'Volum delicat',
    duration: '90 min',
    price: 'Pret de completat',
    note: 'Volum fin, privire luminoasa si linie rafinata.',
  },
  {
    title: 'Efect intens',
    duration: '120 min',
    price: 'Pret de completat',
    note: 'Efect vizibil, construit cu atentie dupa forma ochilor.',
  },
  {
    title: 'Laminare gene / sprancene',
    duration: '60 min',
    price: 'Pret de completat',
    note: 'Definire si aranjare pentru gene sau sprancene naturale.',
  },
]

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  response.end(JSON.stringify(payload))
}

function mapService(row) {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration,
    price: row.price_label,
    note: row.note,
    isActive: row.is_active,
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Metoda nu este permisa.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return sendJson(response, 200, { services: fallbackServices, source: 'fallback' })
  }

  const endpoint = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/site_services`)
  endpoint.searchParams.set('select', 'id,title,duration,price_label,note,is_active,sort_order')
  endpoint.searchParams.set('is_active', 'eq.true')
  endpoint.searchParams.set('order', 'sort_order.asc,title.asc')

  const supabaseResponse = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  })

  if (!supabaseResponse.ok) {
    return sendJson(response, 200, { services: fallbackServices, source: 'fallback' })
  }

  const rows = await supabaseResponse.json()
  return sendJson(response, 200, {
    services: rows.length ? rows.map(mapService) : fallbackServices,
    source: rows.length ? 'database' : 'fallback',
  })
}
