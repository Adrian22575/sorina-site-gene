import { getSupabaseBookingConfig, hasBookingConfig, sendJson } from '../_booking.js'
import { ensureUpcomingAppointmentReminders, sendTomorrowAppointmentDigest } from '../_email.js'

function isAuthorizedCron(request) {
  const secret = process.env.CRON_SECRET || ''
  if (!secret) return false

  return request.headers.authorization === `Bearer ${secret}`
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return sendJson(response, 405, { error: 'Metoda nu este permisa.' })
  }

  if (!isAuthorizedCron(request)) {
    return sendJson(response, 401, { error: 'Cron neautorizat.' })
  }

  const config = getSupabaseBookingConfig()
  if (!config) return sendJson(response, 503, { error: 'Supabase nu este configurat pentru programari.' })
  if (!hasBookingConfig(config)) return sendJson(response, 503, { error: 'SUPABASE_SERVICE_ROLE_KEY nu este o cheie service_role valida.' })

  try {
    const [digest, reminders] = await Promise.all([
      sendTomorrowAppointmentDigest(config),
      ensureUpcomingAppointmentReminders(config),
    ])

    return sendJson(response, 200, { ok: digest.ok !== false, digest, reminders })
  } catch (error) {
    return sendJson(response, 500, { error: error.message || 'Notificarile nu au putut fi trimise.' })
  }
}
