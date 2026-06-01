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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
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
                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          {([['en', '🇬🇧'], ['de', '🇩🇪'], ['fr', '🇫🇷']] as const).map(([l, flag]) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              title={l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : 'Français'}
              className={`text-lg px-1.5 py-1 rounded-md transition-opacity ${
                lang === l ? 'opacity-100' : 'opacity-35 hover:opacity-70'
              }`}
            >
              {flag}
            </button>
          ))}
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-base"
          >
            {theme === 'dark' ? '☀' : '☽'}
          </button>
        </div>
      </nav>
    </header>
  )
}
