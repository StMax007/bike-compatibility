'use client'

import { useLang } from '@/context/language'

const flags: { lang: 'en' | 'de'; flag: string; label: string }[] = [
  { lang: 'en', flag: '🇬🇧', label: 'English' },
  { lang: 'de', flag: '🇩🇪', label: 'Deutsch' },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="fixed top-4 right-4 flex gap-1 z-50">
      {flags.map(({ lang: l, flag, label }) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          title={label}
          className={`text-2xl leading-none px-2 py-1 rounded-lg transition-colors ${
            lang === l
              ? 'bg-white/15 ring-1 ring-white/30'
              : 'opacity-50 hover:opacity-80'
          }`}
        >
          {flag}
        </button>
      ))}
    </div>
  )
}
