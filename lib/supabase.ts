import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export type Groupset = {
  id: number
  name: string
  speeds: number
  generation: string
}

export type Component = {
  id: number
  groupset_id: number
  category: string
  name: string
  model_number: string | null
  price_eur: number | null
  affiliate_url: string | null
}

export type CompatibilityRule = {
  id: number
  groupset_a_id: number
  groupset_b_id: number
  status: 'compatible' | 'adapter' | 'incompatible'
  note: string | null
}
