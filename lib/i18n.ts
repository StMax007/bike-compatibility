export const translations = {
  en: {
    badge: 'Shimano Road',
    headline: 'Find out if your bike parts are compatible',
    subtitle: 'Select your groupset to check compatibility with other Shimano road components.',
    loading: 'Loading...',
    selectPlaceholder: 'Select your groupset',
    back: '← Back',
    compatibleHeading: 'Compatible Groupsets',
    incompatibleHeading: 'Incompatible Groupsets',
    speed: (n: number) => `${n}-speed`,
    buy: 'Check price at bike-components.de',
    compatible: 'Compatible',
    needsAdapter: 'Needs Adapter',
    incompatible: 'Incompatible',
  },
  de: {
    badge: 'Shimano Road',
    headline: 'Finde heraus, ob deine Fahrradteile kompatibel sind',
    subtitle: 'Wähle deine Schaltgruppe, um die Kompatibilität mit anderen Shimano-Komponenten zu prüfen.',
    loading: 'Lädt...',
    selectPlaceholder: 'Schaltgruppe auswählen',
    back: '← Zurück',
    compatibleHeading: 'Kompatible Schaltgruppen',
    incompatibleHeading: 'Inkompatible Schaltgruppen',
    speed: (n: number) => `${n}-fach`,
    buy: 'Aktuellen Preis bei bike-components.de prüfen',
    compatible: 'Kompatibel',
    needsAdapter: 'Adapter nötig',
    incompatible: 'Inkompatibel',
  },
} as const

export type Lang = keyof typeof translations
export type T = {
  badge: string
  headline: string
  subtitle: string
  loading: string
  selectPlaceholder: string
  back: string
  compatibleHeading: string
  incompatibleHeading: string
  speed: (n: number) => string
  buy: string
  compatible: string
  needsAdapter: string
  incompatible: string
}
