'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import {
  getSupabase,
  type Groupset,
  type Component,
  type CompatibilityRule,
  type CompatibilityParameters,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
} from '@/lib/supabase'
import { useLang } from '@/context/language'
import type { T } from '@/lib/i18n'
import Link from 'next/link'

type ResolvedStatus = 'native' | 'compatible' | 'adapter' | 'incompatible'

type EnrichedComponent = Component & {
  groupsetName: string
  groupsetBrand: string
  status: ResolvedStatus
  explanation: string | null
}

type CategoryData = {
  category: string
  components: EnrichedComponent[]
}

function statusOrder(s: ResolvedStatus) {
  return { native: 0, compatible: 1, adapter: 2, incompatible: 3 }[s]
}

function CheckPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t, lang } = useLang()
  const groupsetId = searchParams.get('groupset')

  const [currentGroupset, setCurrentGroupset] = useState<Groupset | null>(null)
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [params, setParams] = useState<CompatibilityParameters | null>(null)
  const [incompatibleGroupsets, setIncompatibleGroupsets] = useState<Groupset[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    if (!groupsetId) {
      router.push('/')
      return
    }

    async function fetchData() {
      const sb = getSupabase()
      const [
        { data: groupsetsRaw },
        { data: rulesRaw },
        { data: componentsRaw },
        { data: paramsRaw },
      ] = await Promise.all([
        sb.from('groupsets').select('*'),
        sb.from('compatibility_rules').select('*'),
        sb.from('components').select('*'),
        sb.from('compatibility_parameters').select('*').eq('groupset_id', Number(groupsetId)).single(),
      ])

      if (!groupsetsRaw || !componentsRaw) return

      const groupsets = groupsetsRaw as Groupset[]
      const rules = (rulesRaw ?? []) as CompatibilityRule[]
      const components = componentsRaw as Component[]

      const current = groupsets.find((g) => g.id === Number(groupsetId))
      if (!current) { router.push('/'); return }

      setCurrentGroupset(current)
      if (paramsRaw) setParams(paramsRaw as CompatibilityParameters)

      // Build compatible groupset map
      const compatMap = new Map<number, { status: 'compatible' | 'adapter'; explanation: string | null }>()
      for (const rule of rules) {
        if (rule.groupset_a_id === Number(groupsetId))
          compatMap.set(rule.groupset_b_id, { status: rule.status as 'compatible' | 'adapter', explanation: rule.explanation })
        if (rule.groupset_b_id === Number(groupsetId))
          compatMap.set(rule.groupset_a_id, { status: rule.status as 'compatible' | 'adapter', explanation: rule.explanation })
      }

      // Group components by category
      const categoryMap = new Map<string, EnrichedComponent[]>()
      for (const comp of components) {
        const g = groupsets.find((x) => x.id === comp.groupset_id)
        if (!g) continue

        let status: ResolvedStatus
        let explanation: string | null = null

        if (comp.groupset_id === Number(groupsetId)) {
          status = 'native'
        } else {
          const rule = compatMap.get(comp.groupset_id)
          if (rule) {
            status = rule.status
            explanation = rule.explanation
          } else {
            status = 'incompatible'
          }
        }

        if (status === 'incompatible') continue // skip incompatible components from main list

        if (!categoryMap.has(comp.category)) categoryMap.set(comp.category, [])
        categoryMap.get(comp.category)!.push({
          ...comp,
          groupsetName: g.name,
          groupsetBrand: g.brand,
          status,
          explanation,
        })
      }

      // Sort components within each category: native first, then compatible, then adapter
      const catList: CategoryData[] = CATEGORY_ORDER.filter((c) => categoryMap.has(c)).map((c) => ({
        category: c,
        components: categoryMap.get(c)!.sort((a, b) => statusOrder(a.status) - statusOrder(b.status)),
      }))

      setCategories(catList)

      // Incompatible groupsets (those without a rule)
      const incompatible = groupsets.filter(
        (g) => g.id !== Number(groupsetId) && !compatMap.has(g.id)
      )
      setIncompatibleGroupsets(incompatible)
      setLoading(false)
    }

    fetchData()
  }, [groupsetId, router])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">{t.loading}</p>
      </main>
    )
  }

  const displayCategories =
    activeCategory === 'all' ? categories : categories.filter((c) => c.category === activeCategory)

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4 inline-block">
          {t.back}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{currentGroupset?.name}</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {currentGroupset && t.speed(currentGroupset.speeds)}
              {' · '}
              {currentGroupset?.type === 'electronic' ? t.electronic : t.mechanical}
              {currentGroupset?.year_from ? ` · ${currentGroupset.year_from}+` : ''}
            </p>
          </div>
          {/* Tech specs pill */}
          {params && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {params.freehub_standard && (
                <span className="border border-gray-700 rounded-full px-2.5 py-1">
                  {t.freehub}: {params.freehub_standard}
                </span>
              )}
              {params.bb_standard && (
                <span className="border border-gray-700 rounded-full px-2.5 py-1">
                  BB: {params.bb_standard}
                </span>
              )}
              {params.sprocket_pitch_mm && (
                <span className="border border-gray-700 rounded-full px-2.5 py-1">
                  {params.sprocket_pitch_mm}mm pitch
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map(({ category }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === category
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {CATEGORY_LABELS[category]?.[lang] ?? category}
            </button>
          ))}
        </div>
      )}

      {/* Component categories */}
      <div className="space-y-8">
        {displayCategories.map(({ category, components }) => (
          <CategorySection
            key={category}
            category={category}
            components={components}
            lang={lang}
            t={t}
          />
        ))}
      </div>

      {/* Incompatible summary */}
      {incompatibleGroupsets.length > 0 && (
        <section className="mt-12 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-gray-400 mb-3 text-sm uppercase tracking-wider">
            {t.incompatibleSummaryHeading}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{t.incompatibleSummaryNote}</p>
          <div className="flex flex-wrap gap-2">
            {incompatibleGroupsets.map((g) => (
              <span
                key={g.id}
                className="text-xs border border-gray-800 rounded-full px-3 py-1 text-gray-500"
              >
                {g.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Affiliate disclaimer */}
      <p className="text-xs text-gray-600 mt-10 text-center">{t.affiliateDisclaimer}</p>
    </main>
  )
}

function CategorySection({
  category,
  components,
  lang,
  t,
}: {
  category: string
  components: EnrichedComponent[]
  lang: 'en' | 'de'
  t: T
}) {
  const label = CATEGORY_LABELS[category]?.[lang] ?? category

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">{label}</h2>
      <div className="space-y-2">
        {components.map((comp) => (
          <ComponentCard key={comp.id} comp={comp} t={t} />
        ))}
      </div>
    </section>
  )
}

function ComponentCard({ comp, t }: { comp: EnrichedComponent; t: T }) {
  const statusConfig: Record<ResolvedStatus, { label: string; classes: string }> = {
    native:      { label: t.native,       classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    compatible:  { label: t.compatible,   classes: 'bg-green-500/15 text-green-400 border-green-500/30' },
    adapter:     { label: t.needsAdapter, classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
    incompatible:{ label: t.incompatible, classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }
  const cfg = statusConfig[comp.status]

  return (
    <div className="flex items-center gap-3 bg-[#111] border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 transition-colors">
      {/* Status badge */}
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${cfg.classes}`}>
        {cfg.label}
      </span>

      {/* Component info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{comp.name}</div>
        <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
          <span>{comp.groupsetName}</span>
          {comp.model_number && <span className="text-gray-600">{comp.model_number}</span>}
        </div>
        {comp.explanation && comp.status === 'adapter' && (
          <p className="text-xs text-yellow-600 mt-0.5">{comp.explanation}</p>
        )}
      </div>

      {/* Price + buy */}
      <div className="flex items-center gap-3 shrink-0">
        {comp.price_eur != null && (
          <span className="text-sm font-medium text-gray-200">€{comp.price_eur.toFixed(0)}</span>
        )}
        {comp.affiliate_url && (
          <a
            href={comp.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            {t.buy}
          </a>
        )}
      </div>
    </div>
  )
}

export default function CheckPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    }>
      <CheckPageInner />
    </Suspense>
  )
}
