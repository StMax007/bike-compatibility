'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getSupabase, type Groupset, type Component, type CompatibilityRule } from '@/lib/supabase'
import { Suspense } from 'react'
import { useLang } from '@/context/language'

type GroupsetWithComponents = Groupset & {
  components: Component[]
  status: 'compatible' | 'adapter' | 'incompatible'
  note: string | null
}

function CheckPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLang()
  const groupsetId = searchParams.get('groupset')

  const [currentGroupset, setCurrentGroupset] = useState<Groupset | null>(null)
  const [compatible, setCompatible] = useState<GroupsetWithComponents[]>([])
  const [incompatible, setIncompatible] = useState<GroupsetWithComponents[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupsetId) {
      router.push('/')
      return
    }

    async function fetchData() {
      const sb = getSupabase()
      const [{ data: groupsetsRaw }, { data: rulesRaw }, { data: componentsRaw }] = await Promise.all([
        sb.from('groupsets').select('*'),
        sb.from('compatibility_rules').select('*'),
        sb.from('components').select('*'),
      ])

      if (!groupsetsRaw || !rulesRaw || !componentsRaw) return

      const groupsets = groupsetsRaw as Groupset[]
      const rules = rulesRaw as CompatibilityRule[]
      const components = componentsRaw as Component[]

      const current = groupsets.find((g) => g.id === Number(groupsetId))
      if (!current) {
        router.push('/')
        return
      }
      setCurrentGroupset(current)

      const otherGroupsets = groupsets.filter((g) => g.id !== Number(groupsetId))
      const ruleMap = new Map<number, CompatibilityRule>()
      for (const rule of rules as CompatibilityRule[]) {
        if (rule.groupset_a_id === Number(groupsetId)) ruleMap.set(rule.groupset_b_id, rule)
        if (rule.groupset_b_id === Number(groupsetId)) ruleMap.set(rule.groupset_a_id, rule)
      }

      const compMap = new Map<number, Component[]>()
      for (const comp of components as Component[]) {
        if (!compMap.has(comp.groupset_id)) compMap.set(comp.groupset_id, [])
        compMap.get(comp.groupset_id)!.push(comp)
      }

      const compatibleList: GroupsetWithComponents[] = []
      const incompatibleList: GroupsetWithComponents[] = []

      for (const g of otherGroupsets) {
        const rule = ruleMap.get(g.id)
        const status = rule?.status ?? 'incompatible'
        const entry: GroupsetWithComponents = {
          ...g,
          components: compMap.get(g.id) ?? [],
          status: status as 'compatible' | 'adapter' | 'incompatible',
          note: rule?.note ?? null,
        }
        if (status === 'compatible' || status === 'adapter') {
          compatibleList.push(entry)
        } else {
          incompatibleList.push(entry)
        }
      }

      setCompatible(compatibleList)
      setIncompatible(incompatibleList)
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

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto space-y-10">
      <div>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-white mb-6 inline-block"
        >
          {t.back}
        </button>
        <h1 className="text-3xl font-bold">{currentGroupset?.name}</h1>
        <p className="text-gray-400 mt-1">{currentGroupset && t.speed(currentGroupset.speeds)} · {currentGroupset?.generation}</p>
      </div>

      {compatible.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-green-400 mb-4">{t.compatibleHeading}</h2>
          <div className="space-y-4">
            {compatible.map((g) => (
              <GroupsetCard key={g.id} groupset={g} variant="compatible" t={t} />
            ))}
          </div>
        </section>
      )}

      {incompatible.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-red-400 mb-4">{t.incompatibleHeading}</h2>
          <div className="space-y-4">
            {incompatible.map((g) => (
              <GroupsetCard key={g.id} groupset={g} variant="incompatible" t={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function GroupsetCard({
  groupset,
  variant,
  t,
}: {
  groupset: GroupsetWithComponents
  variant: 'compatible' | 'incompatible'
  t: import('@/lib/i18n').T
}) {
  const borderColor = variant === 'compatible' ? 'border-green-800' : 'border-red-900'
  const badgeBg = variant === 'compatible' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
  const badgeText = variant === 'compatible'
    ? groupset.status === 'adapter' ? t.needsAdapter : t.compatible
    : t.incompatible

  return (
    <div className={`rounded-xl border ${borderColor} bg-[#111] p-5 space-y-4`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{groupset.name}</h3>
          <p className="text-gray-400 text-sm">{t.speed(groupset.speeds)} · {groupset.generation}</p>
          {groupset.note && <p className="text-gray-400 text-sm mt-1">{groupset.note}</p>}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${badgeBg}`}>
          {badgeText}
        </span>
      </div>

      {groupset.components.length > 0 && (
        <div className="space-y-2">
          {groupset.components.map((comp) => (
            <div
              key={comp.id}
              className="flex items-center justify-between gap-4 text-sm bg-[#1a1a1a] rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <span className="text-gray-400 capitalize">{comp.category.replace('_', ' ')}: </span>
                <span className="font-medium">{comp.name}</span>
                {comp.model_number && (
                  <span className="text-gray-500 ml-2 text-xs">{comp.model_number}</span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {comp.price_eur && (
                  <span className="text-gray-300">€{comp.price_eur.toFixed(2)}</span>
                )}
                {comp.affiliate_url && (
                  <a
                    href={comp.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {t.buy}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
