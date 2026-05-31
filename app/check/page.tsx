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
  type Source,
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

type CompatibleGroup = {
  groupsets: Groupset[]
  explanation: string | null
  sources: Source[]
}

// Raw data for incompatibility – no display strings, rendered by component using t
type IncompatGroupData = {
  groupsets: Groupset[]
  type: 'same_brand_diff_speed' | 'cross_brand'
  brandA: string
  brandB: string
  speedA: number
  speedB: number
  sourcePairs: { label: string; url: string }[]
}

const CROSS_BRAND_SOURCES: { label: string; url: string }[] = [
  {
    label: 'Derailleur compatibility – cable pull ratios (BikeGremlin)',
    url: 'https://bike.bikegremlin.com/1278/bicycle-rear-derailleur-compatibility/',
  },
  {
    label: 'Gear-changing Dimensions (Wikibooks)',
    url: 'https://en.wikibooks.org/wiki/Bicycles/Maintenance_and_Repair/Gear-changing_Dimensions',
  },
]

const SPEED_SOURCES: { label: string; url: string }[] = [
  {
    label: 'Shimano 2024–2025 Compatibility Chart',
    url: 'https://productinfo.shimano.com/pdfs/product/archive/2024-2025_Compatibility_v032_en.pdf',
  },
  {
    label: 'Gear-changing Dimensions (Wikibooks)',
    url: 'https://en.wikibooks.org/wiki/Bicycles/Maintenance_and_Repair/Gear-changing_Dimensions',
  },
]

function buildIncompatGroups(selected: Groupset, others: Groupset[]): IncompatGroupData[] {
  const groups: IncompatGroupData[] = []

  const sameBrandDiffSpeed = others.filter(
    (g) => g.brand === selected.brand && g.speeds !== selected.speeds
  )
  if (sameBrandDiffSpeed.length) {
    groups.push({
      groupsets: sameBrandDiffSpeed,
      type: 'same_brand_diff_speed',
      brandA: selected.brand,
      brandB: selected.brand,
      speedA: selected.speeds,
      speedB: sameBrandDiffSpeed[0].speeds,
      sourcePairs: SPEED_SOURCES,
    })
  }

  for (const brand of ['Shimano', 'SRAM', 'Campagnolo']) {
    if (brand === selected.brand) continue
    const brandGroupsets = others.filter((g) => g.brand === brand)
    if (!brandGroupsets.length) continue
    groups.push({
      groupsets: brandGroupsets,
      type: 'cross_brand',
      brandA: selected.brand,
      brandB: brand,
      speedA: selected.speeds,
      speedB: 0,
      sourcePairs: CROSS_BRAND_SOURCES,
    })
  }

  return groups
}

function getCrossBrandDetail(brandA: string, brandB: string, t: T): string {
  const key = [brandA, brandB].sort().join('|')
  const map: Record<string, string> = {
    'SRAM|Shimano': t.crossBrandDetailShimanoSram,
    'Shimano|SRAM': t.crossBrandDetailShimanoSram,
    'Campagnolo|Shimano': t.crossBrandDetailShimanoCampy,
    'Shimano|Campagnolo': t.crossBrandDetailShimanoCampy,
    'Campagnolo|SRAM': t.crossBrandDetailSramCampy,
    'SRAM|Campagnolo': t.crossBrandDetailSramCampy,
  }
  return map[key] ?? t.crossBrandDetailFallback
}

function getDocTypeLabel(docType: string, t: T): string {
  const map: Record<string, string> = {
    dealer_manual: t.docTypeDealer,
    compatibility_chart: t.docTypeChart,
    support_article: t.docTypeSupport,
    reference: t.docTypeReference,
  }
  return map[docType] ?? docType
}

function statusOrder(s: ResolvedStatus) {
  return { native: 0, compatible: 1, adapter: 2, incompatible: 3 }[s]
}

// ─── Main page ────────────────────────────────────────────────

function CheckPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t, lang } = useLang()
  const groupsetId = searchParams.get('groupset')

  const [currentGroupset, setCurrentGroupset] = useState<Groupset | null>(null)
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [params, setParams] = useState<CompatibilityParameters | null>(null)
  const [compatGroups, setCompatGroups] = useState<CompatibleGroup[]>([])
  const [incompatGroups, setIncompatGroups] = useState<IncompatGroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sourcesOpen, setSourcesOpen] = useState(false)

  useEffect(() => {
    if (!groupsetId) { router.push('/'); return }

    async function fetchData() {
      const sb = getSupabase()
      const [
        { data: groupsetsRaw },
        { data: rulesRaw },
        { data: componentsRaw },
        { data: paramsRaw },
        { data: ruleSourcesRaw },
      ] = await Promise.all([
        sb.from('groupsets').select('*'),
        sb.from('compatibility_rules').select('*'),
        sb.from('components').select('*'),
        sb.from('compatibility_parameters').select('*').eq('groupset_id', Number(groupsetId)).single(),
        sb.from('rule_sources').select('rule_id, sources(*)'),
      ])

      if (!groupsetsRaw || !componentsRaw) return

      const groupsets = groupsetsRaw as Groupset[]
      const rules = (rulesRaw ?? []) as CompatibilityRule[]
      const components = componentsRaw as Component[]

      const current = groupsets.find((g) => g.id === Number(groupsetId))
      if (!current) { router.push('/'); return }

      setCurrentGroupset(current)
      if (paramsRaw) setParams(paramsRaw as CompatibilityParameters)

      // Build source map: rule_id → Source[]
      const sourcesByRule = new Map<number, Source[]>()
      if (ruleSourcesRaw) {
        for (const rs of ruleSourcesRaw as { rule_id: number; sources: Source }[]) {
          if (!rs.sources) continue
          if (!sourcesByRule.has(rs.rule_id)) sourcesByRule.set(rs.rule_id, [])
          sourcesByRule.get(rs.rule_id)!.push(rs.sources)
        }
      }

      // Build compatMap: groupset_id → {rule, sources}
      const compatMap = new Map<number, { rule: CompatibilityRule; sources: Source[] }>()
      for (const rule of rules) {
        if (rule.groupset_a_id === Number(groupsetId))
          compatMap.set(rule.groupset_b_id, { rule, sources: sourcesByRule.get(rule.id) ?? [] })
        if (rule.groupset_b_id === Number(groupsetId))
          compatMap.set(rule.groupset_a_id, { rule, sources: sourcesByRule.get(rule.id) ?? [] })
      }

      // Group compatible groupsets by shared explanation
      const compatGroupMap = new Map<string, { groupsets: Groupset[]; explanation: string | null; sources: Source[] }>()
      for (const [gId, { rule, sources }] of Array.from(compatMap.entries())) {
        const g = groupsets.find((x) => x.id === gId)
        if (!g) continue
        const key = rule.explanation ?? '__compat__'
        if (!compatGroupMap.has(key)) {
          compatGroupMap.set(key, { groupsets: [], explanation: rule.explanation, sources })
        }
        compatGroupMap.get(key)!.groupsets.push(g)
      }
      setCompatGroups(Array.from(compatGroupMap.values()))

      // Component categories
      const categoryMap = new Map<string, EnrichedComponent[]>()
      for (const comp of components) {
        const g = groupsets.find((x) => x.id === comp.groupset_id)
        if (!g) continue
        let status: ResolvedStatus
        let explanation: string | null = null
        if (comp.groupset_id === Number(groupsetId)) {
          status = 'native'
        } else {
          const entry = compatMap.get(comp.groupset_id)
          if (entry) { status = entry.rule.status as 'compatible' | 'adapter'; explanation = entry.rule.explanation }
          else { status = 'incompatible' }
        }
        if (status === 'incompatible') continue
        if (!categoryMap.has(comp.category)) categoryMap.set(comp.category, [])
        categoryMap.get(comp.category)!.push({ ...comp, groupsetName: g.name, groupsetBrand: g.brand, status, explanation })
      }

      const catList: CategoryData[] = CATEGORY_ORDER.filter((c) => categoryMap.has(c)).map((c) => ({
        category: c,
        components: categoryMap.get(c)!.sort((a, b) => statusOrder(a.status) - statusOrder(b.status)),
      }))
      setCategories(catList)

      const incompatible = groupsets.filter((g) => g.id !== Number(groupsetId) && !compatMap.has(g.id))
      setIncompatGroups(buildIncompatGroups(current, incompatible))
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

  const displayCategories = activeCategory === 'all'
    ? categories
    : categories.filter((c) => c.category === activeCategory)

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-4 inline-block">
          {t.back}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{currentGroupset?.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {currentGroupset && t.speed(currentGroupset.speeds)}
              {' · '}
              {currentGroupset?.type === 'electronic' ? t.electronic : t.mechanical}
              {currentGroupset?.year_from ? ` · ${currentGroupset.year_from}+` : ''}
            </p>
          </div>
          {params && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              {params.freehub_standard && (
                <span className="border border-gray-200 dark:border-gray-700 rounded-full px-2.5 py-1 bg-white dark:bg-transparent">
                  {t.freehub}: {params.freehub_standard}
                </span>
              )}
              {params.bb_standard && (
                <span className="border border-gray-200 dark:border-gray-700 rounded-full px-2.5 py-1 bg-white dark:bg-transparent">
                  BB: {params.bb_standard}
                </span>
              )}
              {params.sprocket_pitch_mm && (
                <span className="border border-gray-200 dark:border-gray-700 rounded-full px-2.5 py-1 bg-white dark:bg-transparent">
                  {params.sprocket_pitch_mm} mm pitch
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Compatibility proof panel ── */}
      {compatGroups.length > 0 && (
        <div className="mb-8 border border-green-200 dark:border-green-900/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setSourcesOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-green-50 dark:bg-green-950/30 text-left"
          >
            <span className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
              <span>📄</span> {t.sourcesProofTitle}
            </span>
            <span className="text-green-600 dark:text-green-400 text-xs font-medium">
              {sourcesOpen ? t.sourcesHide : t.sourcesShow}
            </span>
          </button>

          {sourcesOpen && (
            <div className="px-5 py-4 bg-white dark:bg-[#0d1a0d] space-y-5 divide-y divide-gray-100 dark:divide-gray-800">
              {compatGroups.map((group, i) => (
                <div key={i} className={i > 0 ? 'pt-4' : ''}>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    ✓ {t.compatibleWith}{' '}
                    {group.groupsets.map((g) => g.name).join(', ')}
                  </p>
                  {group.explanation && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{group.explanation}</p>
                  )}
                  {group.sources.length > 0 && (
                    <div className="space-y-2">
                      {group.sources.map((src) => (
                        <SourceCard key={src.id} source={src} t={t} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
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
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
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
          <CategorySection key={category} category={category} components={components} lang={lang} t={t} />
        ))}
      </div>

      {/* ── Incompatible section ── */}
      {incompatGroups.length > 0 && (
        <section className="mt-12 space-y-4">
          <h2 className="font-semibold text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider">
            {t.incompatibleSummaryHeading}
          </h2>
          {incompatGroups.map((group, i) => (
            <IncompatGroupCard key={i} group={group} />
          ))}
        </section>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-600 mt-10 text-center">{t.affiliateDisclaimer}</p>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function SourceCard({ source, t }: { source: Source; t: T }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-[#111]">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-900 dark:text-white">{source.title}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
              {getDocTypeLabel(source.doc_type, t)}
            </span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {source.publisher}{source.page_ref ? ` · ${source.page_ref}` : ''}
          </div>
        </div>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 whitespace-nowrap shrink-0 font-medium"
          >
            {t.viewSource}
          </a>
        )}
      </div>
      {source.excerpt && (
        <blockquote className={`text-xs mt-2 pl-3 ${
          source.is_direct_quote
            ? 'border-l-2 border-green-400 text-gray-600 dark:text-gray-300 italic'
            : 'border-l-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
        }`}>
          {source.is_direct_quote ? `"${source.excerpt}"` : source.excerpt}
          {source.is_direct_quote && (
            <span className="not-italic ml-1.5 text-green-600 dark:text-green-400 font-medium text-[10px] uppercase tracking-wide">
              {t.directQuote}
            </span>
          )}
        </blockquote>
      )}
    </div>
  )
}

function IncompatGroupCard({ group }: { group: IncompatGroupData }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  const reason = group.type === 'same_brand_diff_speed'
    ? t.incompatSameSpeedTitle(group.brandA, group.speedA, group.speedB)
    : t.incompatCrossBrandTitle(group.brandA, group.brandB)

  const detail = group.type === 'same_brand_diff_speed'
    ? t.incompatSameSpeedDetail(group.speedA, group.speedB)
    : getCrossBrandDetail(group.brandA, group.brandB, t)

  return (
    <div className="border border-red-100 dark:border-red-900/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 px-5 py-3.5 bg-red-50/50 dark:bg-red-950/20 text-left"
      >
        <div>
          <p className="text-sm font-medium text-red-700 dark:text-red-400">{reason}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {group.groupsets.slice(0, 4).map((g) => g.name).join(', ')}
            {group.groupsets.length > 4 ? ` +${group.groupsets.length - 4} more` : ''}
          </p>
        </div>
        <span className="text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap shrink-0 mt-0.5">
          {open ? t.incompatCollapse : t.incompatExpand}
        </span>
      </button>

      {open && (
        <div className="px-5 py-4 bg-white dark:bg-[#1a0d0d] space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{detail}</p>
          {group.sourcePairs.length > 0 && (
            <div className="space-y-2 pt-1">
              {group.sourcePairs.map((src) => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 group"
                >
                  <span className="text-gray-400">📄</span>
                  <span className="group-hover:underline">{src.label}</span>
                  <span>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, components, lang, t }: {
  category: string
  components: EnrichedComponent[]
  lang: 'en' | 'de'
  t: T
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
        {CATEGORY_LABELS[category]?.[lang] ?? category}
      </h2>
      <div className="space-y-2">
        {components.map((comp) => <ComponentCard key={comp.id} comp={comp} t={t} />)}
      </div>
    </section>
  )
}

function ComponentCard({ comp, t }: { comp: EnrichedComponent; t: T }) {
  const statusConfig: Record<ResolvedStatus, { label: string; classes: string }> = {
    native:       { label: t.native,       classes: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' },
    compatible:   { label: t.compatible,   classes: 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' },
    adapter:      { label: t.needsAdapter, classes: 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30' },
    incompatible: { label: t.incompatible, classes: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30' },
  }
  const cfg = statusConfig[comp.status]

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-4 py-3 transition-colors shadow-sm dark:shadow-none">
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${cfg.classes}`}>
        {cfg.label}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-gray-900 dark:text-white">{comp.name}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 flex gap-2 mt-0.5">
          <span>{comp.groupsetName}</span>
          {comp.model_number && <span className="text-gray-300 dark:text-gray-600">{comp.model_number}</span>}
        </div>
        {comp.explanation && comp.status === 'adapter' && (
          <p className="text-xs text-yellow-600 mt-0.5">{comp.explanation}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {comp.price_eur != null && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">€{comp.price_eur.toFixed(0)}</span>
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
