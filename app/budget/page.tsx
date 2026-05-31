'use client'

import { useEffect, useState } from 'react'
import { getSupabase, type Groupset, type Component, CATEGORY_LABELS } from '@/lib/supabase'
import { useLang } from '@/context/language'

type EnrichedComponent = Component & { groupsetName: string; groupsetBrand: string }

export default function BudgetPage() {
  const { t, lang } = useLang()
  const [groupsets, setGroupsets] = useState<Groupset[]>([])
  const [components, setComponents] = useState<EnrichedComponent[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [filterGroupset, setFilterGroupset] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = getSupabase()
      const [{ data: gs }, { data: comps }] = await Promise.all([
        sb.from('groupsets').select('*').order('id'),
        sb.from('components').select('*').order('groupset_id'),
      ])
      if (!gs || !comps) return
      const gsMap = new Map((gs as Groupset[]).map((g) => [g.id, g]))
      const enriched = (comps as Component[]).map((c) => ({
        ...c,
        groupsetName: gsMap.get(c.groupset_id)?.name ?? '',
        groupsetBrand: gsMap.get(c.groupset_id)?.brand ?? '',
      }))
      setGroupsets(gs as Groupset[])
      setComponents(enriched)
      setLoading(false)
    }
    load()
  }, [])

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const filtered = filterGroupset === 'all'
    ? components
    : components.filter((c) => String(c.groupset_id) === filterGroupset)

  // Group filtered components by category
  const byCategory = CATEGORY_LABELS
  const categories = Object.keys(byCategory).filter((cat) =>
    filtered.some((c) => c.category === cat)
  )

  const selectedComponents = components.filter((c) => selected.has(c.id))
  const total = selectedComponents.reduce((sum, c) => sum + (c.price_eur ?? 0), 0)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">{t.loading}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t.budgetTitle}</h1>
        <p className="text-gray-400">{t.budgetSubtitle}</p>
      </div>

      {/* Sticky total bar */}
      {selected.size > 0 && (
        <div className="sticky top-14 z-40 mb-6 bg-[#111] border border-gray-700 rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-sm text-gray-400">{selected.size} {t.budgetSelected}</span>
            <div className="text-xl font-bold mt-0.5">€{total.toFixed(2)}</div>
          </div>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t.budgetClear}
          </button>
        </div>
      )}

      {/* Groupset filter */}
      <div className="mb-6">
        <select
          value={filterGroupset}
          onChange={(e) => setFilterGroupset(e.target.value)}
          className="bg-[#111] border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer font-[var(--font-inter)] w-full sm:w-auto"
        >
          <option value="all">{t.allGroupsets}</option>
          {['Shimano', 'SRAM', 'Campagnolo'].map((brand) => {
            const items = groupsets.filter((g) => g.brand === brand)
            return items.length > 0 ? (
              <optgroup key={brand} label={brand}>
                {items.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {g.name}
                  </option>
                ))}
              </optgroup>
            ) : null
          })}
        </select>
      </div>

      {/* Component list by category */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catComponents = filtered.filter((c) => c.category === cat)
          if (!catComponents.length) return null
          return (
            <section key={cat}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {CATEGORY_LABELS[cat]?.[lang] ?? cat}
              </h2>
              <div className="space-y-1.5">
                {catComponents.map((comp) => {
                  const isSelected = selected.has(comp.id)
                  return (
                    <button
                      key={comp.id}
                      onClick={() => toggle(comp.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/50'
                          : 'bg-[#111] border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {/* Checkbox */}
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
                        isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600'
                      }`}>
                        {isSelected && '✓'}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{comp.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                          <span>{comp.groupsetName}</span>
                          {comp.model_number && (
                            <span className="text-gray-600">{comp.model_number}</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 shrink-0">
                        {comp.price_eur != null && (
                          <span className={`text-sm font-medium ${isSelected ? 'text-blue-300' : 'text-gray-200'}`}>
                            €{comp.price_eur.toFixed(0)}
                          </span>
                        )}
                        {comp.affiliate_url && (
                          <a
                            href={comp.affiliate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-500 hover:text-blue-400 transition-colors whitespace-nowrap"
                          >
                            {t.buy} ↗
                          </a>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Bottom total */}
      {selected.size === 0 && (
        <p className="text-center text-gray-600 text-sm mt-16">{t.budgetNoItems}</p>
      )}
      {selected.size > 0 && (
        <div className="mt-12 border-t border-gray-800 pt-6 flex justify-between items-center">
          <span className="text-gray-400">{t.budgetTotal}</span>
          <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-8 text-center">{t.affiliateDisclaimer}</p>
    </main>
  )
}
