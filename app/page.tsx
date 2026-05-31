'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, type Groupset } from '@/lib/supabase'
import { useLang } from '@/context/language'

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase">{t.badge}</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            {t.headline}
          </h1>
          <p className="text-gray-400 text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          <select
            value={selected}
            onChange={handleSelect}
            disabled={loading}
            className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 disabled:opacity-50 cursor-pointer font-sans"
          >
            <option value="">{loading ? t.loading : t.selectPlaceholder}</option>
            {groupsets.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({t.speed(g.speeds)})
              </option>
            ))}
          </select>
        </div>
      </div>
    </main>
  )
}
