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
  brand: string
  name: string
  speeds: number
  generation: string
  type: 'mechanical' | 'electronic'
  year_from: number | null
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
  explanation: string | null
  adapter_name: string | null
}

export type CompatibilityParameters = {
  id: number
  groupset_id: number
  cable_pull_mm: number | null
  sprocket_pitch_mm: number | null
  freehub_standard: string | null
  bb_standard: string | null
  chainline_mm: number | null
}

export const CATEGORY_ORDER = [
  'shifters',
  'crankset',
  'front_derailleur',
  'rear_derailleur',
  'cassette',
  'chain',
  'brake_calipers',
  'bottom_bracket',
] as const

export const CATEGORY_LABELS: Record<string, { en: string; de: string }> = {
  shifters:         { en: 'Shifters / Brake Levers', de: 'Schalthebel / Bremshebel' },
  crankset:         { en: 'Crankset',                de: 'Kurbel' },
  front_derailleur: { en: 'Front Derailleur',         de: 'Umwerfer' },
  rear_derailleur:  { en: 'Rear Derailleur',          de: 'Schaltwerk' },
  cassette:         { en: 'Cassette',                 de: 'Kassette' },
  chain:            { en: 'Chain',                    de: 'Kette' },
  brake_calipers:   { en: 'Brake Calipers',           de: 'Bremssättel' },
  bottom_bracket:   { en: 'Bottom Bracket',           de: 'Tretlager' },
}
