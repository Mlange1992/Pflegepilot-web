import leistungenData from './leistungen-2026.json'
import fristenData from './fristen.json'

// ==========================================================
// Typen
// ==========================================================

export type Pflegegrad = 1 | 2 | 3 | 4 | 5

export interface LeistungConfig {
  slug: string
  name: string
  paragraph: string
  icon: string
  short_description: string
  description: string
  frequency: 'monthly' | 'yearly' | 'once'
  category: 'geld' | 'sach' | 'sonstig'
  per_pflegegrad: Record<string, number>
  deadline_rule: string | null
  requires_antrag: boolean
  active_from?: string
  active_to?: string
  tip?: string
  warning?: string
  gesetzestext?: string
}

export interface Benefit {
  slug: string
  name: string
  paragraph: string
  icon: string
  short_description: string
  description: string
  frequency: 'monthly' | 'yearly' | 'once'
  category: 'geld' | 'sach' | 'sonstig'
  amountCentsPerPeriod: number
  amountCentsPerYear: number
  deadlineRule: string | null
  requiresAntrag: boolean
  tip: string | undefined
  isActive: boolean
}

export interface BudgetSummary {
  id: string
  slug: string
  name: string
  icon: string
  short_description: string
  totalCents: number
  usedCents: number
  remainingCents: number
  percentUsed: number
  expiresAt: Date | null
  daysUntilExpiry: number | null
  status: 'ok' | 'expiring_soon' | 'critical' | 'expired'
  deadlineLabel: string | null
}

export interface Deadline {
  slug: string
  name: string
  icon: string
  amountAtRiskCents: number
  expiresAt: Date
  daysUntilExpiry: number
  urgency: 'normal' | 'warning' | 'critical'
}

export interface OptimizationTip {
  type: 'umwandlung' | 'hilfsmittel' | 'entlastung' | 'verhinderung' | 'info'
  title: string
  description: string
  potentialGainCents: number
  actionLabel: string
  actionSlug?: string
}

export interface FristenConfig {
  label: string
  description: string
  reminder_days_before: number[]
  calculate: 'YEAR_END_PLUS_6_MONTHS' | 'YEAR_END'
}

// ==========================================================
// Hilfsfunktionen
// ==========================================================

/**
 * Formatiert Cent-Betrag als deutsches Euro-Format.
 * 15720 → "157,20 €"
 * 353900 → "3.539,00 €"
 */
export function formatEuro(cents: number): string {
  const euros = cents / 100
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros)
}

/**
 * Formatiert Cent-Betrag kompakt (ohne Dezimalstellen wenn .00).
 * 33200 → "332 €"
 * 13150 → "131,50 €"
 */
export function formatEuroKompakt(cents: number): string {
  const euros = cents / 100
  const hasDecimals = cents % 100 !== 0
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(euros)
}

/**
 * Gibt die Jahressumme einer Leistung in Cents zurück.
 */
function getYearlyCents(leistung: LeistungConfig, pflegegrad: Pflegegrad): number {
  const perPeriod = leistung.per_pflegegrad[String(pflegegrad)] ?? 0
  switch (leistung.frequency) {
    case 'monthly':
      return perPeriod * 12
    case 'yearly':
    case 'once':
      return perPeriod
  }
}

/**
 * Prüft ob eine Leistung zum Stichtag aktiv ist.
 */
function isLeistungActive(leistung: LeistungConfig, referenceDate = new Date()): boolean {
  if (leistung.active_from) {
    if (new Date(leistung.active_from) > referenceDate) return false
  }
  if (leistung.active_to) {
    if (new Date(leistung.active_to) < referenceDate) return false
  }
  return true
}

// ==========================================================
// Kern-Engine
// ==========================================================

const leistungen = leistungenData as LeistungConfig[]
const fristen = fristenData as Record<string, FristenConfig>

/**
 * Berechnet alle zustehenden Leistungen für einen Pflegegrad.
 * Filtert inaktive Leistungen (z.B. VP/KZP nach 01.07.2025).
 * Filtert Leistungen mit 0€ Anspruch für den Pflegegrad.
 */
export function calculateBenefits(
  pflegegrad: Pflegegrad,
  referenceDate = new Date()
): Benefit[] {
  return leistungen
    .filter((l) => isLeistungActive(l, referenceDate))
    .map((l) => {
      const amountCentsPerPeriod = l.per_pflegegrad[String(pflegegrad)] ?? 0
      const amountCentsPerYear = getYearlyCents(l, pflegegrad)
      return {
        slug: l.slug,
        name: l.name,
        paragraph: l.paragraph,
        icon: l.icon,
        short_description: l.short_description,
        description: l.description,
        frequency: l.frequency,
        category: l.category,
        amountCentsPerPeriod,
        amountCentsPerYear,
        deadlineRule: l.deadline_rule,
        requiresAntrag: l.requires_antrag,
        tip: l.tip,
        isActive: amountCentsPerPeriod > 0,
      }
    })
    .filter((b) => b.amountCentsPerYear > 0)
}

/**
 * Berechnet die Gesamtsumme aller zustehenden Leistungen pro Jahr (in Cents).
 */
export function calculateTotalEntitlement(
  pflegegrad: Pflegegrad,
  referenceDate = new Date()
): number {
  return calculateBenefits(pflegegrad, referenceDate).reduce(
    (sum, b) => sum + b.amountCentsPerYear,
    0
  )
}

/**
 * Schätzt den aktuell genutzten Betrag basierend auf Checkboxen im Quick-Check.
 * Gibt eine konservative Schätzung zurück.
 */
export function estimateCurrentUsage(
  pflegegrad: Pflegegrad,
  genutzteLeistungen: string[], // slugs der genutzten Leistungen
  referenceDate = new Date()
): number {
  const benefits = calculateBenefits(pflegegrad, referenceDate)
  return benefits
    .filter((b) => genutzteLeistungen.includes(b.slug))
    .reduce((sum, b) => sum + b.amountCentsPerYear, 0)
}

/**
 * Berechnet den Umwandlungsanspruch:
 * 40% des ungenutzten Sachleistungsbudgets kann in Entlastungsbetrag umgewandelt werden.
 */
export function calculateUmwandlung(
  pflegegrad: Pflegegrad,
  genutzterAnteilSachleistungen: number // 0.0 - 1.0
): number {
  const sachleistung = leistungen.find((l) => l.slug === 'pflegesachleistungen')
  if (!sachleistung) return 0

  const monatlichCents = sachleistung.per_pflegegrad[String(pflegegrad)] ?? 0
  const ungenutzterAnteil = 1 - Math.min(1, Math.max(0, genutzterAnteilSachleistungen))
  const umwandelbarCents = monatlichCents * ungenutzterAnteil * 0.4

  return Math.floor(umwandelbarCents * 12) // Jahresbetrag
}

// ==========================================================
// Fristen-System
// ==========================================================

/**
 * Berechnet das Verfall-Datum für ein Budget basierend auf der deadline_rule.
 */
export function calculateExpiryDate(
  deadlineRule: string,
  year: number
): Date {
  const frist = fristen[deadlineRule]
  if (!frist) throw new Error(`Unbekannte deadline_rule: ${deadlineRule}`)

  switch (frist.calculate) {
    case 'YEAR_END':
      return new Date(`${year}-12-31T23:59:59`)
    case 'YEAR_END_PLUS_6_MONTHS':
      // Entlastungsbetrag: nicht genutztes Budget aus Jahr X verfällt am 30.06. des Folgejahres
      return new Date(`${year + 1}-06-30T23:59:59`)
    default:
      return new Date(`${year}-12-31T23:59:59`)
  }
}

/**
 * Gibt alle Fristen sortiert nach Dringlichkeit zurück.
 */
export interface BudgetForDeadline {
  id: string
  slug: string
  name: string
  icon: string
  remainingCents: number
  expiresAt: Date | string
}

export function getUpcomingDeadlines(budgets: BudgetForDeadline[]): Deadline[] {
  const now = new Date()

  return budgets
    .filter((b) => b.expiresAt != null && b.remainingCents > 0)
    .map((b) => {
      const expiresAt = b.expiresAt instanceof Date ? b.expiresAt : new Date(b.expiresAt)
      const msUntilExpiry = expiresAt.getTime() - now.getTime()
      const daysUntilExpiry = Math.ceil(msUntilExpiry / (1000 * 60 * 60 * 24))

      let urgency: Deadline['urgency'] = 'normal'
      if (daysUntilExpiry <= 7) urgency = 'critical'
      else if (daysUntilExpiry <= 30) urgency = 'warning'

      return {
        slug: b.slug,
        name: b.name,
        icon: b.icon,
        amountAtRiskCents: b.remainingCents,
        expiresAt,
        daysUntilExpiry,
        urgency,
      }
    })
    .filter((d) => d.daysUntilExpiry > 0) // Noch nicht abgelaufen
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
}

/**
 * Berechnet die Budget-Status für das Dashboard.
 */
export function getBudgetStatus(
  totalCents: number,
  usedCents: number,
  expiresAt: Date | null
): BudgetSummary['status'] {
  if (expiresAt && expiresAt < new Date()) return 'expired'

  const remainingCents = totalCents - usedCents
  if (remainingCents <= 0) return 'ok' // Vollständig genutzt

  if (expiresAt) {
    const daysUntilExpiry = Math.ceil(
      (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    if (daysUntilExpiry <= 7) return 'critical'
    if (daysUntilExpiry <= 30) return 'expiring_soon'
  }

  return 'ok'
}

// ==========================================================
// Optimierungs-Engine
// ==========================================================

export interface ProfileForTips {
  pflegegrad: Pflegegrad
  nutzt_pflegedienst: boolean
}

export interface BudgetForTips {
  slug: string
  totalCents: number
  usedCents: number
  remainingCents: number
}

/**
 * Generiert proaktive Optimierungsvorschläge basierend auf Profil und Budgets.
 */
export function getOptimizationTips(
  profile: ProfileForTips,
  budgets: BudgetForTips[]
): OptimizationTip[] {
  const tips: OptimizationTip[] = []

  const getBudget = (slug: string) => budgets.find((b) => b.slug === slug)

  // Tipp 1: Umwandlungsanspruch
  const sachBudget = getBudget('pflegesachleistungen')
  if (sachBudget && sachBudget.totalCents > 0) {
    const genutzterAnteil = sachBudget.usedCents / sachBudget.totalCents
    const umwandlungCents = calculateUmwandlung(profile.pflegegrad, genutzterAnteil)
    if (umwandlungCents > 0) {
      const monatlichCents = Math.floor(umwandlungCents / 12)
      tips.push({
        type: 'umwandlung',
        title: 'Umwandlungsanspruch nutzen',
        description: `Du nutzt aktuell ${Math.round(genutzterAnteil * 100)}% deiner Pflegesachleistungen. Die ungenutzten 40% kannst du in zusätzlichen Entlastungsbetrag umwandeln — das sind ${formatEuro(monatlichCents)} mehr pro Monat.`,
        potentialGainCents: umwandlungCents,
        actionLabel: 'Umwandlung beantragen',
        actionSlug: 'pflegesachleistungen',
      })
    }
  }

  // Tipp 2: Entlastungsbetrag nicht genutzt
  const entlastungBudget = getBudget('entlastungsbetrag')
  if (entlastungBudget && entlastungBudget.usedCents === 0) {
    tips.push({
      type: 'entlastung',
      title: 'Entlastungsbetrag noch nicht genutzt',
      description: `Du hast noch ${formatEuro(entlastungBudget.remainingCents)} Entlastungsbetrag übrig. Dieser verfällt am 30. Juni des Folgejahres — nicht verschenken!`,
      potentialGainCents: entlastungBudget.remainingCents,
      actionLabel: 'Anbieter in der Nähe finden',
      actionSlug: 'entlastungsbetrag',
    })
  }

  // Tipp 3: Verhinderungspflege / Entlastungsbudget nicht genutzt
  const entlastungsBudget = getBudget('entlastungsbudget')
  if (entlastungsBudget && entlastungsBudget.usedCents === 0) {
    tips.push({
      type: 'verhinderung',
      title: 'Entlastungsbudget liegt brach',
      description: `${formatEuro(entlastungsBudget.totalCents)} für Verhinderungs- und Kurzzeitpflege sind noch komplett ungenutzt. 70% der Berechtigten nutzen dies nie — das Geld verfällt am 31.12.!`,
      potentialGainCents: entlastungsBudget.remainingCents,
      actionLabel: 'Verhinderungspflege organisieren',
      actionSlug: 'entlastungsbudget',
    })
  }

  // Tipp 4: Pflegehilfsmittel nicht beantragt
  const hilfsmittelBudget = getBudget('pflegehilfsmittel')
  if (!hilfsmittelBudget || hilfsmittelBudget.usedCents === 0) {
    const monatlichCents = 4200 // §40 Abs.2: 42€/Monat (Stand 2025, nach PUEG)
    tips.push({
      type: 'hilfsmittel',
      title: 'Gratis Pflegehilfsmittel bestellen',
      description: `42€ pro Monat für Einmalhandschuhe, Bettschutz und Desinfektionsmittel — einmal beantragen, kommt dann automatisch. Viele Anbieter übernehmen auch den Antrag.`,
      potentialGainCents: monatlichCents * 12,
      actionLabel: 'Jetzt beantragen',
      actionSlug: 'pflegehilfsmittel',
    })
  }

  return tips
}

// ==========================================================
// Quick-Check Ergebnis-Berechnung
// ==========================================================

export interface QuickCheckInput {
  pflegegrad: Pflegegrad
  wohnsituation: 'zuhause' | 'wg' | 'heim'
  bundesland: string
  genutzteLeistungen: string[] // Slugs
  nutztPflegedienst: boolean
}

export interface QuickCheckResult {
  pflegegrad: Pflegegrad
  totalEntitlementCents: number
  currentlyUsedCents: number
  verfallenCents: number
  benefits: Benefit[]
  topMessage: string
  ctaMessage: string
}

/**
 * Berechnet das komplette Quick-Check Ergebnis — der "Money-Shot".
 */
export function calculateQuickCheckResult(input: QuickCheckInput): QuickCheckResult {
  const benefits = calculateBenefits(input.pflegegrad)
  const totalEntitlementCents = benefits.reduce((s, b) => s + b.amountCentsPerYear, 0)
  const currentlyUsedCents = estimateCurrentUsage(
    input.pflegegrad,
    input.genutzteLeistungen
  )
  const verfallenCents = Math.max(0, totalEntitlementCents - currentlyUsedCents)

  const topMessage =
    `Mit Pflegegrad ${input.pflegegrad} stehen Ihrer Familie ` +
    `${formatEuro(totalEntitlementCents)} pro Jahr zu. ` +
    `Sie nutzen aktuell ca. ${formatEuro(currentlyUsedCents)}.`

  const ctaMessage =
    verfallenCents > 0
      ? `⚠️ Sie lassen ${formatEuro(verfallenCents)} verfallen.`
      : `✅ Sie nutzen Ihre Leistungen vollständig — gut gemacht!`

  return {
    pflegegrad: input.pflegegrad,
    totalEntitlementCents,
    currentlyUsedCents,
    verfallenCents,
    benefits,
    topMessage,
    ctaMessage,
  }
}
