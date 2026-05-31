'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, type Groupset } from '@/lib/supabase'
import { useLang } from '@/context/language'

const BRANDS = ['Shimano', 'SRAM', 'Campagnolo'] as const

export default function Home() {
  const router = useRouter()
  const { t } = useLang()
  const [groupsets, setGroupsets] = useState<Groupset[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSupabase()
      .from('groupsets')
      .select('*')
      .order('id')
      .then(({ data }) => {
        if (data) setGroupsets(data as Groupset[])
        setLoading(false)
      })
  }, [])

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setSelected(id)
    if (id) router.push(`/check?groupset=${id}`)
  }

  const byBrand = BRANDS.map((brand) => ({
    brand,
    items: groupsets.filter((g) => g.brand === brand),
  }))

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-10">
        {/* Hero */}
        <div className="space-y-4">
          <span className="inline-block text-blue-400 text-xs font-semibold tracking-widest uppercase border border-blue-400/30 rounded-full px-3 py-1">
            {t.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            {t.headline}
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Groupset selector */}
        <div className="space-y-2">
          <select
            value={selected}
            onChange={handleSelect}
            disabled={loading}
            className="w-full bg-[#111] border border-gray-700 hover:border-gray-500 text-white rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-blue-500 disabled:opacity-50 cursor-pointer font-[var(--font-inter)] transition-colors"
          >
            <option value="">{loading ? t.loading : t.selectPlaceholder}</option>
            {byBrand.map(({ brand, items }) =>
              items.length > 0 ? (
                <optgroup key={brand} label={brand}>
                  {items.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({t.speed(g.speeds)}{g.type === 'electronic' ? ' · Di2/AXS' : ''})
                    </option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
        </div>

        {/* Brand pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          {BRANDS.map((b) => (
            <span key={b} className="border border-gray-700 rounded-full px-3 py-1">
              {b}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
