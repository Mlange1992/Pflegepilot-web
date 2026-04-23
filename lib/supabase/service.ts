/**
 * Erstellt einen Supabase-Client mit dem Service Role Key.
 * Nur serverseitig verwenden — nie im Client-Bundle!
 * Umgeht Row Level Security (RLS) für Cron-Jobs und Webhooks.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
