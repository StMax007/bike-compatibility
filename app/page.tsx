'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase, type Groupset } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
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
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase">Shimano Road</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Find out if your bike parts are compatible
          </h1>
          <p className="text-gray-400 text-lg">
            Select your groupset to check compatibility with other Shimano road components.
          </p>
        </div>

        <div className="space-y-3">
          <select
            value={selected}
            onChange={handleSelect}
            disabled={loading}
            className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500 disabled:opacity-50 cursor-pointer"
          >
            <option value="">{loading ? 'Loading...' : 'Select your groupset'}</option>
            {groupsets.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.speeds}-speed)
              </option>
            ))}
          </select>
        </div>
      </div>
    </main>
  )
}
