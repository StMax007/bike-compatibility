export const translations = {
  en: {
    // home
    badge: 'Road Cycling',
    headline: 'Find out if your bike parts are compatible',
    subtitle: 'Select your groupset to instantly check compatibility with Shimano, SRAM, and Campagnolo components.',
    loading: 'Loading...',
    selectPlaceholder: 'Select your groupset',
    // check page
    back: '← Back',
    nativeComponents: 'Your Groupset Components',
    compatibleFrom: 'Compatible from',
    compatibleHeading: 'Compatible Groupsets',
    incompatibleHeading: 'Incompatible Groupsets',
    incompatibleSummaryHeading: 'Not Compatible',
    incompatibleSummaryNote: 'These ecosystems use different cable pull ratios, sprocket pitch, or electronic protocols and cannot be mixed.',
    noCompatibleComponents: 'No compatible components found for this category.',
    filterLabel: 'Filter by category',
    allCategories: 'All categories',
    technicalSpecs: 'Technical Specs',
    freehub: 'Freehub',
    bbStandard: 'Bottom Bracket',
    cablePull: 'Cable Pull',
    sprocketPitch: 'Sprocket Pitch',
    // budget
    budgetTitle: 'Budget Calculator',
    budgetSubtitle: 'Select components to estimate the cost of your build or upgrade.',
    budgetTotal: 'Total',
    budgetClear: 'Clear selection',
    budgetSelected: 'selected',
    budgetNoItems: 'Select components above to see your total.',
    filterGroupset: 'Filter by groupset',
    allGroupsets: 'All groupsets',
    // about
    aboutTitle: 'About',
    // nav
    navHome: 'Home',
    navCheck: 'Check',
    navBudget: 'Budget',
    navAbout: 'About',
    // shared
    speed: (n: number) => `${n}-speed`,
    buy: 'Check price',
    compatible: '✓ Compatible',
    needsAdapter: '⚠ Adapter',
    incompatible: '✕ Incompatible',
    native: '★ Native',
    mechanical: 'Mechanical',
    electronic: 'Electronic',
    affiliateDisclaimer: 'Affiliate links – we may earn a commission at no extra cost to you.',
  },
  de: {
    badge: 'Radsport',
    headline: 'Finde heraus, ob deine Fahrradteile kompatibel sind',
    subtitle: 'Wähle deine Schaltgruppe, um die Kompatibilität mit Shimano-, SRAM- und Campagnolo-Komponenten zu prüfen.',
    loading: 'Lädt...',
    selectPlaceholder: 'Schaltgruppe auswählen',
    back: '← Zurück',
    nativeComponents: 'Deine Schaltgruppe',
    compatibleFrom: 'Kompatibel von',
    compatibleHeading: 'Kompatible Schaltgruppen',
    incompatibleHeading: 'Inkompatible Schaltgruppen',
    incompatibleSummaryHeading: 'Nicht kompatibel',
    incompatibleSummaryNote: 'Diese Systeme verwenden unterschiedliche Zugweg-Verhältnisse, Ritzelabstände oder elektronische Protokolle und können nicht gemischt werden.',
    noCompatibleComponents: 'Keine kompatiblen Komponenten für diese Kategorie gefunden.',
    filterLabel: 'Kategorie filtern',
    allCategories: 'Alle Kategorien',
    technicalSpecs: 'Technische Daten',
    freehub: 'Freilaufkörper',
    bbStandard: 'Tretlager',
    cablePull: 'Zugweg',
    sprocketPitch: 'Ritzelabstand',
    budgetTitle: 'Budgetrechner',
    budgetSubtitle: 'Wähle Komponenten aus, um die Kosten deines Aufbaus oder Upgrades zu schätzen.',
    budgetTotal: 'Gesamt',
    budgetClear: 'Auswahl löschen',
    budgetSelected: 'ausgewählt',
    budgetNoItems: 'Wähle oben Komponenten aus, um dein Budget zu sehen.',
    filterGroupset: 'Nach Schaltgruppe filtern',
    allGroupsets: 'Alle Schaltgruppen',
    aboutTitle: 'Über uns',
    navHome: 'Start',
    navCheck: 'Prüfen',
    navBudget: 'Budget',
    navAbout: 'Über',
    speed: (n: number) => `${n}-fach`,
    buy: 'Preis prüfen',
    compatible: '✓ Kompatibel',
    needsAdapter: '⚠ Adapter nötig',
    incompatible: '✕ Inkompatibel',
    native: '★ Original',
    mechanical: 'Mechanisch',
    electronic: 'Elektronisch',
    affiliateDisclaimer: 'Affiliate-Links – wir erhalten ggf. eine Provision ohne Mehrkosten für dich.',
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
  nativeComponents: string
  compatibleFrom: string
  compatibleHeading: string
  incompatibleHeading: string
  incompatibleSummaryHeading: string
  incompatibleSummaryNote: string
  noCompatibleComponents: string
  filterLabel: string
  allCategories: string
  technicalSpecs: string
  freehub: string
  bbStandard: string
  cablePull: string
  sprocketPitch: string
  budgetTitle: string
  budgetSubtitle: string
  budgetTotal: string
  budgetClear: string
  budgetSelected: string
  budgetNoItems: string
  filterGroupset: string
  allGroupsets: string
  aboutTitle: string
  navHome: string
  navCheck: string
  navBudget: string
  navAbout: string
  speed: (n: number) => string
  buy: string
  compatible: string
  needsAdapter: string
  incompatible: string
  native: string
  mechanical: string
  electronic: string
  affiliateDisclaimer: string
}
