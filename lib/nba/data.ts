export type NBAScale = 'selbstaendigkeit' | 'faehigkeit' | 'haeufigkeit' | 'versorgung'

export interface NBAQuestion {
  id: string
  text: string
  hint?: string
  scale: NBAScale
}

export interface NBAModule {
  id: number
  title: string
  icon: string
  description: string
  weight: number
  questions: NBAQuestion[]
}

export const SCALE_OPTIONS: Record<NBAScale, { label: string; value: number }[]> = {
  selbstaendigkeit: [
    { label: 'Selbständig', value: 0 },
    { label: 'Überwiegend selbständig', value: 1 },
    { label: 'Überwiegend unselbständig', value: 2 },
    { label: 'Unselbständig', value: 3 },
  ],
  faehigkeit: [
    { label: 'Vorhanden', value: 0 },
    { label: 'Größtenteils vorhanden', value: 1 },
    { label: 'In geringem Maße vorhanden', value: 2 },
    { label: 'Nicht vorhanden', value: 3 },
  ],
  haeufigkeit: [
    { label: 'Nie oder sehr selten', value: 0 },
    { label: 'Selten (1–3× pro Woche)', value: 1 },
    { label: 'Häufig (4–5× pro Woche)', value: 2 },
    { label: 'Täglich oder mehrfach täglich', value: 3 },
  ],
  versorgung: [
    { label: 'Entfällt / nicht erforderlich', value: 0 },
    { label: 'Selbständig möglich', value: 1 },
    { label: 'Hilfe erforderlich', value: 2 },
    { label: 'Vollständige Übernahme nötig', value: 3 },
  ],
}

export const NBA_MODULES: NBAModule[] = [
  {
    id: 1, title: 'Mobilität', icon: '🚶', weight: 0.10,
    description: 'Wie gut kann sich die Person körperlich bewegen und ihre Position wechseln?',
    questions: [
      { id: 'm1_1', text: 'Positionswechsel im Bett', hint: 'z.B. vom Rücken auf die Seite drehen, Oberkörper aufrichten', scale: 'selbstaendigkeit' },
      { id: 'm1_2', text: 'Stabile Sitzposition halten', hint: 'Mindestens 10 Minuten aufrecht sitzen ohne Unterstützung', scale: 'selbstaendigkeit' },
      { id: 'm1_3', text: 'Umsetzen', hint: 'z.B. vom Bett in den Rollstuhl oder auf einen Stuhl wechseln', scale: 'selbstaendigkeit' },
      { id: 'm1_4', text: 'Fortbewegen innerhalb des Wohnbereichs', hint: 'Gehen oder Fahren im Wohnbereich, auch mit Hilfsmittel', scale: 'selbstaendigkeit' },
      { id: 'm1_5', text: 'Treppensteigen', hint: 'Eine Etage (mindestens 4 Stufen) hinauf und hinunter', scale: 'selbstaendigkeit' },
    ],
  },
  {
    id: 2, title: 'Kognition & Kommunikation', icon: '🧠', weight: 0.15,
    description: 'Geistige Fähigkeiten, Gedächtnis und die Fähigkeit zur Kommunikation.',
    questions: [
      { id: 'm2_1', text: 'Personen aus dem näheren Umfeld erkennen', hint: 'Erkennt Familienangehörige, Pflegepersonen etc.', scale: 'faehigkeit' },
      { id: 'm2_2', text: 'Örtliche Orientierung', hint: 'Weiß, wo sie sich befindet (Wohnung, Haus, Ort)', scale: 'faehigkeit' },
      { id: 'm2_3', text: 'Zeitliche Orientierung', hint: 'Weiß ungefähr, welcher Tag, Monat oder welches Jahr ist', scale: 'faehigkeit' },
      { id: 'm2_4', text: 'Erinnern an wesentliche Ereignisse', hint: 'Kann sich an Erlebnisse des eigenen Lebens und aktuelle Ereignisse erinnern', scale: 'faehigkeit' },
      { id: 'm2_5', text: 'Steuern mehrschrittiger Alltagshandlungen', hint: 'z.B. Kaffee kochen, Körperpflege in der richtigen Reihenfolge durchführen', scale: 'faehigkeit' },
      { id: 'm2_6', text: 'Treffen von Entscheidungen im Alltag', hint: 'z.B. auswählen, was gegessen oder angezogen wird', scale: 'faehigkeit' },
      { id: 'm2_7', text: 'Verstehen von Sachverhalten und Informationen', hint: 'Versteht Erklärungen und kann das Gehörte einordnen', scale: 'faehigkeit' },
      { id: 'm2_8', text: 'Erkennen von Risiken und Gefahren', hint: 'z.B. heiße Herdplatte, Verkehrsgefahr, offene Fenster', scale: 'faehigkeit' },
      { id: 'm2_9', text: 'Mitteilen elementarer Bedürfnisse', hint: 'Kann Hunger, Schmerz, Kälte o.ä. mitteilen', scale: 'faehigkeit' },
      { id: 'm2_10', text: 'Verstehen von Aufforderungen', hint: 'Versteht einfache Bitten und Anweisungen', scale: 'faehigkeit' },
      { id: 'm2_11', text: 'Beteiligen an einem Gespräch', hint: 'Kann sinnvoll an einem Gespräch teilnehmen und antworten', scale: 'faehigkeit' },
    ],
  },
  {
    id: 3, title: 'Verhalten & Psyche', icon: '💭', weight: 0.0,
    description: 'Verhaltensauffälligkeiten und psychische Belastungen in den letzten zwei Wochen.',
    questions: [
      { id: 'm3_1', text: 'Motorische Verhaltensauffälligkeiten', hint: 'z.B. Nesteln, zielloses Herumlaufen, Hinlauftendenz', scale: 'haeufigkeit' },
      { id: 'm3_2', text: 'Nächtliche Unruhe', hint: 'Schläft schlecht, steht nachts auf, ist nachts unruhig', scale: 'haeufigkeit' },
      { id: 'm3_3', text: 'Selbstschädigendes Verhalten', hint: 'z.B. Kratzen, Beißen, Schlagen gegen den eigenen Körper', scale: 'haeufigkeit' },
      { id: 'm3_4', text: 'Beschädigen von Gegenständen', hint: 'Wirft Dinge, zerstört Gegenstände', scale: 'haeufigkeit' },
      { id: 'm3_5', text: 'Körperlich aggressives Verhalten gegenüber anderen', hint: 'Schlägt, kratzt oder beißt Pflegepersonen oder andere', scale: 'haeufigkeit' },
      { id: 'm3_6', text: 'Verbale Aggression', hint: 'Beschimpft, droht, beleidigt andere', scale: 'haeufigkeit' },
      { id: 'm3_7', text: 'Wahnvorstellungen', hint: 'z.B. Verfolgungsgedanken, Stimmen hören', scale: 'haeufigkeit' },
      { id: 'm3_8', text: 'Ängste', hint: 'Ausgeprägte Ängste, Panikattacken', scale: 'haeufigkeit' },
      { id: 'm3_9', text: 'Antriebslosigkeit / depressive Stimmung', hint: 'Apathisch, interesselos, zieht sich zurück', scale: 'haeufigkeit' },
      { id: 'm3_10', text: 'Unangemessenes Verhalten in der Öffentlichkeit', hint: 'Sozial unangepasstes Verhalten außerhalb des häuslichen Umfelds', scale: 'haeufigkeit' },
      { id: 'm3_11', text: 'Schlafstörungen / Umkehr des Schlaf-Wach-Rhythmus', hint: 'Schläft tagsüber viel, ist nachts wach', scale: 'haeufigkeit' },
      { id: 'm3_12', text: 'Abwehr pflegerischer Maßnahmen', hint: 'Verweigert oder behindert Waschen, Ankleiden, Medikamentengabe oder andere Pflegemaßnahmen', scale: 'haeufigkeit' },
      { id: 'm3_13', text: 'Sonstige psychische Auffälligkeiten', hint: 'z.B. Stimmungsschwankungen, plötzliches Weinen, Suizidgedanken', scale: 'haeufigkeit' },
    ],
  },
  {
    id: 4, title: 'Selbstversorgung', icon: '🚿', weight: 0.40,
    description: 'Körperpflege, An-/Auskleiden, Essen, Trinken und Toilettennutzung.',
    questions: [
      { id: 'm4_1', text: 'Waschen des vorderen Oberkörpers', hint: 'Gesicht, Hals, Brust, Arme waschen', scale: 'selbstaendigkeit' },
      { id: 'm4_2', text: 'Körperpflege im Bereich des Kopfes', hint: 'Kämmen, Rasieren, Zähneputzen / Zahnprothese', scale: 'selbstaendigkeit' },
      { id: 'm4_3', text: 'Waschen des Intimbereichs', hint: 'Intimhygiene selbständig durchführen', scale: 'selbstaendigkeit' },
      { id: 'm4_4', text: 'Duschen oder Baden inkl. Haarwaschen', hint: 'Gesamter Waschvorgang unter der Dusche oder in der Wanne', scale: 'selbstaendigkeit' },
      { id: 'm4_5', text: 'An- und Auskleiden des Oberkörpers', hint: 'Hemd, Pullover, BH, Jacke selbst an- und ausziehen', scale: 'selbstaendigkeit' },
      { id: 'm4_6', text: 'An- und Auskleiden des Unterkörpers', hint: 'Hose, Unterwäsche, Strümpfe, Schuhe', scale: 'selbstaendigkeit' },
      { id: 'm4_7', text: 'Mundgerechtes Zubereiten der Nahrung', hint: 'Brot schneiden, Speisen zerkleinern, Getränke einschenken', scale: 'selbstaendigkeit' },
      { id: 'm4_8', text: 'Essen', hint: 'Nahrungsaufnahme mit Löffel, Gabel, Messer', scale: 'selbstaendigkeit' },
      { id: 'm4_9', text: 'Trinken', hint: 'Flüssigkeit aus Tasse oder Glas zu sich nehmen', scale: 'selbstaendigkeit' },
      { id: 'm4_10', text: 'Benutzen einer Toilette oder eines Toilettenstuhls', hint: 'Toilette aufsuchen, Kleidung richten, Hygiene', scale: 'selbstaendigkeit' },
      { id: 'm4_11', text: 'Umgang mit Harninkontinenz / Dauerkatheter', hint: 'Versorgung bei Harninkontinenz, Wechsel von Inkontinenzmaterial', scale: 'selbstaendigkeit' },
      { id: 'm4_12', text: 'Umgang mit Stuhlinkontinenz / Stoma', hint: 'Versorgung bei Stuhlinkontinenz oder künstlichem Darmausgang', scale: 'selbstaendigkeit' },
      { id: 'm4_13', text: 'Ernährung über Sonde oder parenteral', hint: 'Ernährung über Magensonde (PEG), Nasensonde oder intravenöse Ernährung', scale: 'selbstaendigkeit' },
    ],
  },
  {
    id: 5, title: 'Krankheitsbewältigung', icon: '💊', weight: 0.20,
    description: 'Medizinische und therapeutische Maßnahmen, die regelmäßig durchgeführt werden müssen.',
    questions: [
      { id: 'm5_1', text: 'Inhalieren / Absaugen', hint: 'z.B. Inhalationsgerät, Absaugung von Atemwegssekreten', scale: 'versorgung' },
      { id: 'm5_2', text: 'Messen von Vitalzeichen', hint: 'Blutdruck, Blutzucker, Temperatur, Puls regelmäßig messen', scale: 'versorgung' },
      { id: 'm5_3', text: 'Medikamentengabe', hint: 'Tabletten, Tropfen, Pflaster, Injektionen (z.B. Insulin)', scale: 'versorgung' },
      { id: 'm5_4', text: 'Verbandwechsel / Wundversorgung', hint: 'Wunden reinigen und verbinden, Stoma versorgen', scale: 'versorgung' },
      { id: 'm5_5', text: 'Schmerzmanagement', hint: 'Einnahme von Schmerzmitteln, Schmerzpflaster, Schmerzpumpe', scale: 'versorgung' },
      { id: 'm5_6', text: 'Therapiegeräte bedienen', hint: 'z.B. CPAP-Gerät, Dialyse, Infusionen', scale: 'versorgung' },
      { id: 'm5_7', text: 'Arztbesuche und Behördengänge', hint: 'Regelmäßige Arzttermine, Facharztkonsultationen selbst organisieren', scale: 'versorgung' },
      { id: 'm5_8', text: 'Umgang mit Hilfsmitteln', hint: 'z.B. Prothesen, Orthesen, Rollstuhl selbst anlegen/bedienen', scale: 'versorgung' },
    ],
  },
  {
    id: 6, title: 'Alltagsgestaltung', icon: '☀️', weight: 0.15,
    description: 'Tagesstruktur, Freizeitgestaltung und soziale Teilhabe.',
    questions: [
      { id: 'm6_1', text: 'Gestalten des Tagesablaufs', hint: 'Kann den Tag selbst strukturieren und auf Veränderungen reagieren', scale: 'selbstaendigkeit' },
      { id: 'm6_2', text: 'Anpassen des Verhaltens an veränderte Situationen', hint: 'Reagiert flexibel auf unerwartete Ereignisse im Alltag', scale: 'selbstaendigkeit' },
      { id: 'm6_3', text: 'Sich beschäftigen und Interessen nachgehen', hint: 'z.B. Lesen, Fernsehen, Hobby, Spaziergang', scale: 'selbstaendigkeit' },
      { id: 'm6_4', text: 'Vornehmen zukunftsbezogener Planungen', hint: 'z.B. Einkauf planen, Termin merken, vorausdenken', scale: 'selbstaendigkeit' },
      { id: 'm6_5', text: 'Interaktion mit Personen im direkten Umfeld', hint: 'Gespräche führen, auf andere eingehen, gemeinsame Aktivitäten', scale: 'selbstaendigkeit' },
      { id: 'm6_6', text: 'Kontaktpflege außerhalb des häuslichen Umfelds', hint: 'Freunde, Verwandte besuchen oder Vereine, Gruppen aufsuchen', scale: 'selbstaendigkeit' },
    ],
  },
]

export interface NBAResult {
  moduleScores: Record<number, number>
  totalScore: number
  pflegegrad: number | null
  pflegegradLabel: string
  modul2Score: number
  modul3Score: number
}

export function calculateNBA(answers: Record<string, number>): NBAResult {
  const rawScores: Record<number, number> = {}
  const maxRaw: Record<number, number> = {}

  for (const mod of NBA_MODULES) {
    const raw = mod.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    rawScores[mod.id] = raw
    maxRaw[mod.id] = mod.questions.length * 3
  }

  const pct = (id: number) => {
    const raw = rawScores[id] ?? 0
    const max = maxRaw[id] ?? 1
    return (raw / max) * 100
  }

  const m1 = pct(1), m2 = pct(2), m3 = pct(3)
  const m4 = pct(4), m5 = pct(5), m6 = pct(6)
  const m23 = Math.max(m2, m3)
  const total = m1 * 0.10 + m23 * 0.15 + m4 * 0.40 + m5 * 0.20 + m6 * 0.15

  let pflegegrad: number | null
  let pflegegradLabel: string
  if (total < 12.5) { pflegegrad = null; pflegegradLabel = 'Kein Pflegegrad' }
  else if (total < 27) { pflegegrad = 1; pflegegradLabel = 'Pflegegrad 1' }
  else if (total < 47.5) { pflegegrad = 2; pflegegradLabel = 'Pflegegrad 2' }
  else if (total < 70) { pflegegrad = 3; pflegegradLabel = 'Pflegegrad 3' }
  else if (total < 90) { pflegegrad = 4; pflegegradLabel = 'Pflegegrad 4' }
  else { pflegegrad = 5; pflegegradLabel = 'Pflegegrad 5' }

  return {
    moduleScores: { 1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6 },
    totalScore: total,
    pflegegrad,
    pflegegradLabel,
    modul2Score: m2,
    modul3Score: m3,
  }
}

export const PFLEGEKASSEN = [
  'AOK Baden-Württemberg', 'AOK Bayern', 'AOK Bremen/Bremerhaven', 'AOK Hessen',
  'AOK Niedersachsen', 'AOK Nordost', 'AOK NordWest', 'AOK Plus (Sachsen & Thüringen)',
  'AOK Rheinland/Hamburg', 'AOK Rheinland-Pfalz/Saarland', 'AOK Sachsen-Anhalt',
  'Techniker Krankenkasse (TK)', 'Barmer', 'DAK-Gesundheit', 'KKH – Kaufmännische Krankenkasse',
  'hkk – Handelskrankenkasse', 'HEK – Hanseatische Krankenkasse',
  'IKK classic', 'IKK gesund plus', 'IKK Brandenburg und Berlin', 'IKK Südwest',
  'BKK VBU', 'BKK Mobil Oil', 'BKK ProVita', 'BKK firmus', 'BKK Linde',
  'Audi BKK', 'Bahn-BKK', 'Bosch BKK', 'Siemens-Betriebskrankenkasse (SBK)',
  'KNAPPSCHAFT', 'Landwirtschaftliche Krankenkasse (LKK)',
  'Sonstige / Nicht in der Liste',
]
