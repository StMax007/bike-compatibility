'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type T } from '@/lib/i18n'

type LanguageContextType = {
  lang: Lang
  t: T
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
