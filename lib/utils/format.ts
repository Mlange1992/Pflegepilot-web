/**
 * Formatiert Cent-Betrag als deutsches Euro-Format.
 * 15720 → "157,20 €"
 */
export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

/**
 * Formatiert Datum als deutsches Format.
 * "2025-12-31" → "31.12.2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formatiert Datum mit Monat ausgeschrieben.
 * "2025-12-31" → "31. Dezember 2025"
 */
export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Gibt die Anzahl der verbleibenden Tage zurück.
 * Negativ = bereits abgelaufen.
 */
export function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

/**
 * Formatiert Dringlichkeit als lesbaren String.
 * 3 → "noch 3 Tage"
 * -5 → "vor 5 Tagen abgelaufen"
 */
export function formatDaysUntil(days: number): string {
  if (days < 0) return `vor ${Math.abs(days)} Tagen abgelaufen`
  if (days === 0) return 'heute'
  if (days === 1) return 'noch 1 Tag'
  if (days < 30) return `noch ${days} Tage`
  if (days < 60) return 'noch ca. 1 Monat'
  const months = Math.floor(days / 30)
  return `noch ca. ${months} Monate`
}

/**
 * Formatiert Prozentsatz.
 * 0.753 → "75%"
 */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}
