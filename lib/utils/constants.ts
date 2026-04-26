export const BUNDESLAENDER = [
  { value: 'BW', label: 'Baden-Württemberg' },
  { value: 'BY', label: 'Bayern' },
  { value: 'BE', label: 'Berlin' },
  { value: 'BB', label: 'Brandenburg' },
  { value: 'HB', label: 'Bremen' },
  { value: 'HH', label: 'Hamburg' },
  { value: 'HE', label: 'Hessen' },
  { value: 'MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'NI', label: 'Niedersachsen' },
  { value: 'NW', label: 'Nordrhein-Westfalen' },
  { value: 'RP', label: 'Rheinland-Pfalz' },
  { value: 'SL', label: 'Saarland' },
  { value: 'SN', label: 'Sachsen' },
  { value: 'ST', label: 'Sachsen-Anhalt' },
  { value: 'SH', label: 'Schleswig-Holstein' },
  { value: 'TH', label: 'Thüringen' },
] as const

export type BundeslandCode = (typeof BUNDESLAENDER)[number]['value']

export const PFLEGEGRADE = [1, 2, 3, 4, 5] as const

export const WOHNSITUATIONEN = [
  { value: 'zuhause', label: 'Zu Hause (eigene Wohnung)' },
  { value: 'wg', label: 'Pflege-WG' },
  { value: 'heim', label: 'Pflegeheim / stationär' },
] as const

export const PRICES = {
  single: {
    monthly: 990, // 9,90€ in Cents
    label: 'Single',
  },
  familie: {
    monthly: 1490, // 14,90€ in Cents
    label: 'Familie',
  },
} as const

export const DISCLAIMER =
  'PflegePilot ersetzt keine Rechtsberatung. Alle Angaben ohne Gewähr.'

// Leistungen die standardmäßig im Quick-Check als "genutzt" angeboten werden
export const QUICK_CHECK_LEISTUNGEN = [
  { slug: 'pflegegeld', label: 'Pflegegeld' },
  { slug: 'pflegesachleistungen', label: 'Ambulanter Pflegedienst' },
  { slug: 'entlastungsbetrag', label: 'Entlastungsbetrag' },
  { slug: 'entlastungsbudget', label: 'Verhinderungs-/Kurzzeitpflege' },
  { slug: 'pflegehilfsmittel', label: 'Pflegehilfsmittel (40€/Mo)' },
] as const
