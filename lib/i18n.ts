export const translations = {
  en: {
    // home
    badge: 'Road Cycling',
    headline: 'Find out if your bike parts are compatible',
    subtitle: 'Select your groupset to instantly check compatibility with Shimano, SRAM, and Campagnolo components.',
    loading: 'Loading...',
    selectPlaceholder: 'Select your groupset',
    // nav
    navHome: 'Home',
    navCheck: 'Check',
    navBudget: 'Budget',
    navAbout: 'About',
    // check page – header
    back: '← Back',
    freehub: 'Freehub',
    bbStandard: 'Bottom Bracket',
    cablePull: 'Cable Pull',
    sprocketPitch: 'Sprocket Pitch',
    allCategories: 'All categories',
    filterLabel: 'Filter by category',
    technicalSpecs: 'Technical Specs',
    // check page – compatibility proof panel
    sourcesProofTitle: 'Why are these parts compatible? — Sources & proof',
    sourcesShow: 'Show ▼',
    sourcesHide: 'Hide ▲',
    compatibleWith: 'Compatible with:',
    directQuote: 'direct quote',
    viewSource: 'View ↗',
    // check page – doc type labels
    docTypeDealer: 'Dealer Manual',
    docTypeChart: 'Official Compatibility Chart',
    docTypeSupport: 'Official Support Article',
    docTypeReference: 'Technical Reference',
    // check page – incompatible section
    incompatibleSummaryHeading: 'Not Compatible',
    incompatibleSummaryNote: 'These ecosystems use different cable pull ratios, sprocket pitch, or electronic protocols and cannot be mixed.',
    incompatExpand: 'Why? ▼',
    incompatCollapse: 'Hide ▲',
    // dynamic incompatibility reasons
    incompatSameSpeedTitle: (brand: string, sA: number, sB: number) =>
      `${brand} ${sA}-speed and ${sB}-speed are not compatible`,
    incompatSameSpeedDetail: (sA: number, sB: number) =>
      `Sprocket pitch differs: ${sA}-speed uses ~${sA === 11 ? '3.95' : '3.58'} mm, ${sB}-speed uses ~${sB === 11 ? '3.95' : '3.58'} mm. Chains, cassettes, and derailleurs are not interchangeable between different speeds.`,
    incompatCrossBrandTitle: (a: string, b: string) =>
      `${a} and ${b} are not compatible`,
    crossBrandDetailShimanoSram:
      'Shimano and SRAM use different cable pull ratios for mechanical systems (~2.7 mm vs a different DoubleTap actuation ratio). Electronic systems (Di2 vs AXS) use incompatible wireless protocols. Mixing results in inaccurate or non-functional shifting.',
    crossBrandDetailShimanoCampy:
      'Shimano road uses ~2.7 mm cable pull per shift; Campagnolo Ergopower uses ~2.6 mm with a different lever geometry. Although the values are close, the shift ratios are incompatible and will cause missed or double-shifts.',
    crossBrandDetailSramCampy:
      'SRAM DoubleTap and Campagnolo Ergopower use fundamentally different actuation mechanisms and cable pull values. They cannot be mixed.',
    crossBrandDetailFallback:
      'Different brand ecosystems use incompatible cable pull ratios and/or electronic protocols.',
    // check page – compatible heading (used in old check pages)
    compatibleHeading: 'Compatible Groupsets',
    incompatibleHeading: 'Incompatible Groupsets',
    noCompatibleComponents: 'No compatible components found for this category.',
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
    nativeComponents: 'Your Groupset Components',
    compatibleFrom: 'Compatible from',
  },

  de: {
    badge: 'Radsport',
    headline: 'Finde heraus, ob deine Fahrradteile kompatibel sind',
    subtitle: 'Wähle deine Schaltgruppe, um die Kompatibilität mit Shimano-, SRAM- und Campagnolo-Komponenten zu prüfen.',
    loading: 'Lädt...',
    selectPlaceholder: 'Schaltgruppe auswählen',
    navHome: 'Start',
    navCheck: 'Prüfen',
    navBudget: 'Budget',
    navAbout: 'Über',
    back: '← Zurück',
    freehub: 'Freilaufkörper',
    bbStandard: 'Tretlager',
    cablePull: 'Zugweg',
    sprocketPitch: 'Ritzelabstand',
    allCategories: 'Alle Kategorien',
    filterLabel: 'Kategorie filtern',
    technicalSpecs: 'Technische Daten',
    // Quellennachweis-Panel
    sourcesProofTitle: 'Warum sind diese Teile kompatibel? — Quellen & Nachweise',
    sourcesShow: 'Anzeigen ▼',
    sourcesHide: 'Verbergen ▲',
    compatibleWith: 'Kompatibel mit:',
    directQuote: 'direktes Zitat',
    viewSource: 'Ansehen ↗',
    docTypeDealer: 'Händlerhandbuch',
    docTypeChart: 'Offizielle Kompatibilitätstabelle',
    docTypeSupport: 'Offizieller Support-Artikel',
    docTypeReference: 'Technische Referenz',
    incompatibleSummaryHeading: 'Nicht kompatibel',
    incompatibleSummaryNote: 'Diese Systeme verwenden unterschiedliche Zugwegverhältnisse, Ritzelabstände oder Funkprotokolle und können nicht gemischt werden.',
    incompatExpand: 'Warum? ▼',
    incompatCollapse: 'Verbergen ▲',
    // dynamische Inkompatibilitätsgründe
    incompatSameSpeedTitle: (brand: string, sA: number, sB: number) =>
      `${brand} ${sA}-fach und ${sB}-fach sind nicht kompatibel`,
    incompatSameSpeedDetail: (sA: number, sB: number) =>
      `Ritzelabstand unterschiedlich: ${sA}-fach verwendet ~${sA === 11 ? '3,95' : '3,58'} mm, ${sB}-fach ~${sB === 11 ? '3,95' : '3,58'} mm. Ketten, Kassetten und Schaltwerke sind zwischen verschiedenen Gangzahlen nicht austauschbar.`,
    incompatCrossBrandTitle: (a: string, b: string) =>
      `${a} und ${b} sind nicht kompatibel`,
    crossBrandDetailShimanoSram:
      'Shimano und SRAM verwenden unterschiedliche Zugwegverhältnisse (~2,7 mm vs. das DoubleTap-Betätigungsprinzip von SRAM). Elektronische Systeme (Di2 vs. AXS) nutzen inkompatible Funkprotokolle. Das Mischen führt zu ungenauem oder nicht funktionierendem Schalten.',
    crossBrandDetailShimanoCampy:
      'Shimano Road verwendet ~2,7 mm Zugweg pro Schaltschritt, Campagnolo Ergopower ~2,6 mm mit anderer Hebelgeometrie. Obwohl die Werte ähnlich sind, sind die Schaltverhältnisse inkompatibel und führen zu Fehlschaltungen.',
    crossBrandDetailSramCampy:
      'SRAM DoubleTap und Campagnolo Ergopower verwenden grundlegend unterschiedliche Betätigungsmechanismen und Zugwegwerte. Sie können nicht miteinander kombiniert werden.',
    crossBrandDetailFallback:
      'Unterschiedliche Markensysteme verwenden inkompatible Zugwegverhältnisse und/oder Funkprotokolle.',
    compatibleHeading: 'Kompatible Schaltgruppen',
    incompatibleHeading: 'Inkompatible Schaltgruppen',
    noCompatibleComponents: 'Keine kompatiblen Komponenten für diese Kategorie gefunden.',
    budgetTitle: 'Budgetrechner',
    budgetSubtitle: 'Wähle Komponenten aus, um die Kosten deines Aufbaus oder Upgrades zu schätzen.',
    budgetTotal: 'Gesamt',
    budgetClear: 'Auswahl löschen',
    budgetSelected: 'ausgewählt',
    budgetNoItems: 'Wähle oben Komponenten aus, um dein Budget zu sehen.',
    filterGroupset: 'Nach Schaltgruppe filtern',
    allGroupsets: 'Alle Schaltgruppen',
    aboutTitle: 'Über uns',
    speed: (n: number) => `${n}-fach`,
    buy: 'Preis prüfen',
    compatible: '✓ Kompatibel',
    needsAdapter: '⚠ Adapter nötig',
    incompatible: '✕ Inkompatibel',
    native: '★ Original',
    mechanical: 'Mechanisch',
    electronic: 'Elektronisch',
    affiliateDisclaimer: 'Affiliate-Links – wir erhalten ggf. eine Provision ohne Mehrkosten für dich.',
    nativeComponents: 'Deine Schaltgruppe',
    compatibleFrom: 'Kompatibel von',
  },
  fr: {
    badge: 'Cyclisme sur route',
    headline: 'Découvrez si vos composants vélo sont compatibles',
    subtitle: 'Sélectionnez votre groupeset pour vérifier instantanément la compatibilité avec les composants Shimano, SRAM et Campagnolo.',
    loading: 'Chargement...',
    selectPlaceholder: 'Sélectionnez votre groupeset',
    navHome: 'Accueil',
    navCheck: 'Vérifier',
    navBudget: 'Budget',
    navAbout: 'À propos',
    back: '← Retour',
    freehub: 'Corps de roue libre',
    bbStandard: 'Boîtier de pédalier',
    cablePull: 'Tirage de câble',
    sprocketPitch: 'Pas de pignon',
    allCategories: 'Toutes les catégories',
    filterLabel: 'Filtrer par catégorie',
    technicalSpecs: 'Spécifications techniques',
    sourcesProofTitle: 'Pourquoi ces pièces sont-elles compatibles ? — Sources & preuves',
    sourcesShow: 'Afficher ▼',
    sourcesHide: 'Masquer ▲',
    compatibleWith: 'Compatible avec :',
    directQuote: 'citation directe',
    viewSource: 'Voir ↗',
    docTypeDealer: 'Manuel revendeur',
    docTypeChart: 'Tableau de compatibilité officiel',
    docTypeSupport: 'Article de support officiel',
    docTypeReference: 'Référence technique',
    incompatibleSummaryHeading: 'Non compatible',
    incompatibleSummaryNote: 'Ces systèmes utilisent des rapports de tirage de câble, des pas de pignons ou des protocoles électroniques différents et ne peuvent pas être mélangés.',
    incompatExpand: 'Pourquoi ? ▼',
    incompatCollapse: 'Masquer ▲',
    incompatSameSpeedTitle: (brand: string, sA: number, sB: number) =>
      `${brand} ${sA} et ${sB} vitesses ne sont pas compatibles`,
    incompatSameSpeedDetail: (sA: number, sB: number) =>
      `Pas de pignon différent : ${sA} vitesses utilise ~${sA === 11 ? '3,95' : '3,58'} mm, ${sB} vitesses ~${sB === 11 ? '3,95' : '3,58'} mm. Chaînes, cassettes et dérailleurs ne sont pas interchangeables entre vitesses différentes.`,
    incompatCrossBrandTitle: (a: string, b: string) =>
      `${a} et ${b} ne sont pas compatibles`,
    crossBrandDetailShimanoSram:
      "Shimano et SRAM utilisent des rapports de tirage de câble différents (~2,7 mm pour Shimano, contre le ratio DoubleTap de SRAM). Les systèmes électroniques (Di2 vs AXS) emploient des protocoles sans fil incompatibles. Le mélange entraîne un passage de vitesse inexact ou non fonctionnel.",
    crossBrandDetailShimanoCampy:
      "Shimano route utilise ~2,7 mm de tirage par cran ; Campagnolo Ergopower utilise ~2,6 mm avec une géométrie de levier différente. Bien que les valeurs soient proches, les rapports d'actionnement sont incompatibles et provoquent des sauts ou des ratés de vitesse.",
    crossBrandDetailSramCampy:
      "SRAM DoubleTap et Campagnolo Ergopower utilisent des mécanismes d'actionnement et des valeurs de tirage de câble fondamentalement différents. Ils ne peuvent pas être combinés.",
    crossBrandDetailFallback:
      "Les écosystèmes de marques différentes utilisent des rapports de tirage ou des protocoles électroniques incompatibles.",
    compatibleHeading: 'Groupesets compatibles',
    incompatibleHeading: 'Groupesets incompatibles',
    noCompatibleComponents: 'Aucun composant compatible trouvé pour cette catégorie.',
    budgetTitle: 'Calculateur de budget',
    budgetSubtitle: 'Sélectionnez des composants pour estimer le coût de votre montage ou mise à niveau.',
    budgetTotal: 'Total',
    budgetClear: 'Effacer la sélection',
    budgetSelected: 'sélectionné(s)',
    budgetNoItems: 'Sélectionnez des composants ci-dessus pour voir votre total.',
    filterGroupset: 'Filtrer par groupeset',
    allGroupsets: 'Tous les groupesets',
    aboutTitle: 'À propos',
    speed: (n: number) => `${n} vitesses`,
    buy: 'Vérifier le prix',
    compatible: '✓ Compatible',
    needsAdapter: '⚠ Adaptateur',
    incompatible: '✕ Incompatible',
    native: '★ Natif',
    mechanical: 'Mécanique',
    electronic: 'Électronique',
    affiliateDisclaimer: 'Liens affiliés – nous pouvons percevoir une commission sans frais supplémentaires pour vous.',
    nativeComponents: 'Vos composants',
    compatibleFrom: 'Compatible depuis',
  },
} as const

export type Lang = keyof typeof translations

export type T = {
  badge: string
  headline: string
  subtitle: string
  loading: string
  selectPlaceholder: string
  navHome: string
  navCheck: string
  navBudget: string
  navAbout: string
  back: string
  freehub: string
  bbStandard: string
  cablePull: string
  sprocketPitch: string
  allCategories: string
  filterLabel: string
  technicalSpecs: string
  sourcesProofTitle: string
  sourcesShow: string
  sourcesHide: string
  compatibleWith: string
  directQuote: string
  viewSource: string
  docTypeDealer: string
  docTypeChart: string
  docTypeSupport: string
  docTypeReference: string
  incompatibleSummaryHeading: string
  incompatibleSummaryNote: string
  incompatExpand: string
  incompatCollapse: string
  incompatSameSpeedTitle: (brand: string, sA: number, sB: number) => string
  incompatSameSpeedDetail: (sA: number, sB: number) => string
  incompatCrossBrandTitle: (a: string, b: string) => string
  crossBrandDetailShimanoSram: string
  crossBrandDetailShimanoCampy: string
  crossBrandDetailSramCampy: string
  crossBrandDetailFallback: string
  compatibleHeading: string
  incompatibleHeading: string
  noCompatibleComponents: string
  budgetTitle: string
  budgetSubtitle: string
  budgetTotal: string
  budgetClear: string
  budgetSelected: string
  budgetNoItems: string
  filterGroupset: string
  allGroupsets: string
  aboutTitle: string
  speed: (n: number) => string
  buy: string
  compatible: string
  needsAdapter: string
  incompatible: string
  native: string
  mechanical: string
  electronic: string
  affiliateDisclaimer: string
  nativeComponents: string
  compatibleFrom: string
}
