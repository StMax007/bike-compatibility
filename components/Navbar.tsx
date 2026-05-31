'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/language'
import { useTheme } from '@/context/theme'

export function Navbar() {
  const pathname = usePathname()
  const { t, lang, setLang } = useLang()
  const { theme, toggle } = useTheme()

  const links = [
    { href: '/',        label: t.navHome },
    { href: '/check',   label: t.navCheck },
    { href: '/budget',  label: t.navBudget },
    { href: '/about',   label: t.navAbout },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-800 dark:border-gray-800 bg-[#0a0a0a]/90 dark:bg-[#0a0a0a]/90 bg-white/90 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-sm tracking-tight text-white dark:text-white">
          BikeCompat
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            title={lang === 'en' ? 'Deutsch' : 'English'}
            className="text-lg px-2 py-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
          >
            {lang === 'en' ? '🇩🇪' : '🇬🇧'}
          </button>
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="px-2 py-1 rounded-md text-gray-400 hover:text-white transition-colors text-base"
          >
            {theme === 'dark' ? '☀' : '●'}
          </button>
        </div>
      </nav>
    </header>
  )
}
