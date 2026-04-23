'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { calculateNBA, NBA_MODULES } from '@/lib/nba/data'
import type { NBAResult } from '@/lib/nba/data'
import { DISCLAIMER } from '@/lib/utils/constants'

const PG_COLOR: Record<number, { bg: string; text: string; ring: string }> = {
  0: { bg: 'bg-gray-100', text: 'text-gray-700', ring: 'ring-gray-300' },
  1: { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'ring-yellow-300' },
  2: { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'ring-orange-300' },
  3: { bg: 'bg-orange-100', text: 'text-orange-900', ring: 'ring-orange-400' },
  4: { bg: 'bg-red-50', text: 'text-red-800', ring: 'ring-red-300' },
  5: { bg: 'bg-red-100', text: 'text-red-900', ring: 'ring-red-400' },
}

function ModuleBar({ label, score, icon }: { label: string; score: number; icon: string }) {
  const pct = Math.round(score)
  let color = 'bg-green-400'
  if (pct >= 60) color = 'bg-red-400'
  else if (pct >= 30) color = 'bg-orange-400'

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-gray-700">{icon} {label}</span>
        <span className="text-gray-500">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function NBAErgebnisPage() {
  const router = useRouter()
  const [result, setResult] = useState<NBAResult | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    const raw = sessionStorage.getItem('nba_answers')
    if (!raw) {
      router.replace('/pflegegrad-einschaetzen')
      return
    }
    const parsed = JSON.parse(raw) as Record<string, number>
    setAnswers(parsed)
    setResult(calculateNBA(parsed))
  }, [router])

  const handleUebernehmen = () => {
    if (!result) return
    const pg = result.pflegegrad ?? 0
    router.push(`/check?pg=${pg}`)
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Berechne Ergebnis…</div>
      </div>
    )
  }

  const pg = result.pflegegrad ?? 0
  const colors = PG_COLOR[pg]
  const m23Used = result.modul3Score > result.modul2Score ? 3 : 2

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/pflegegrad-einschaetzen" className="text-sm text-gray-500 hover:text-gray-700">
          ← Neu berechnen
        </Link>
        <Link href="/" className="text-sm font-semibold text-primary-600">PflegePilot</Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Pflegegrad Kreis */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Ihr geschätzter Pflegegrad</p>
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ring-4 ${colors.ring} ${colors.bg} ${colors.text}`}>
            <div>
              <p className="text-4xl font-extrabold leading-none">{pg === 0 ? '—' : pg}</p>
              <p className="text-xs font-semibold mt-1">Pflegegrad</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Gesamtpunktzahl: <strong>{result.totalScore.toFixed(1)}</strong> von 100
          </p>
        </div>

        {/* Ergebnis-Erklärung */}
        {pg === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-800 mb-2">Kein Pflegegrad erkennbar</p>
            <p>Die Punktzahl liegt unter dem Schwellenwert für Pflegegrad 1 (12,5 Punkte). Falls Sie Bedenken haben, empfehlen wir ein Gespräch mit Ihrer Pflegekasse.</p>
          </div>
        ) : (
          <div className="bg-primary-50 rounded-2xl p-5 space-y-2">
            <p className="font-semibold text-primary-900">Was bedeutet Pflegegrad {pg}?</p>
            <p className="text-sm text-primary-800 leading-relaxed">
              {pg === 1 && 'Geringe Beeinträchtigungen der Selbständigkeit. Anspruch auf Pflegegeld, Sachleistungen und den Entlastungsbetrag von 131 €/Monat.'}
              {pg === 2 && 'Erhebliche Beeinträchtigungen. Pflegegeld (332 €/Monat), Pflegesachleistungen und alle Kombinationsleistungen stehen zur Verfügung.'}
              {pg === 3 && 'Schwere Beeinträchtigungen. Pflegegeld (572 €/Monat) und umfangreiche Sachleistungen sowie Verhinderungs- und Kurzzeitpflege.'}
              {pg === 4 && 'Schwerste Beeinträchtigungen. Pflegegeld (764 €/Monat) und hohe Sachleistungsbudgets, vollstationäre Versorgung möglich.'}
              {pg === 5 && 'Schwerste Beeinträchtigungen mit besonderen Anforderungen. Pflegegeld (946 €/Monat), höchste Sachleistungsbeträge.'}
            </p>
          </div>
        )}

        {/* Modul-Auswertung */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Auswertung nach Modulen</h3>
          {NBA_MODULES.map(mod => (
            <ModuleBar
              key={mod.id}
              icon={mod.icon}
              label={mod.title}
              score={result.moduleScores[mod.id]}
            />
          ))}
          {m23Used === 3 && (
            <p className="text-xs text-gray-400 pt-1">
              * Modul 3 (Verhalten & Psyche) hat Modul 2 (Kognition) in der Gewichtung ersetzt, da höhere Punktzahl.
            </p>
          )}
        </div>

        {/* Hinweis MDK */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Wichtiger Hinweis</p>
          <p>Diese Einschätzung basiert auf dem offiziellen NBA-Begutachtungsassessment (§ 15 SGB XI). Sie ersetzt keine Begutachtung durch den MDK / MEDICPROOF. Stellen Sie den Antrag bei Ihrer Pflegekasse — nur die offizielle Begutachtung ist rechtswirksam.</p>
        </div>

        {/* Aktions-Buttons */}
        {pg > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleUebernehmen}
              className="block w-full text-center bg-primary-600 text-white font-semibold py-4 rounded-2xl hover:bg-primary-700 transition-colors"
            >
              Meine Leistungen mit PG {pg} berechnen →
            </button>
            <Link
              href={`/antrag?pg=${pg}`}
              className="block w-full text-center border-2 border-primary-200 text-primary-700 font-semibold py-4 rounded-2xl hover:bg-primary-50 transition-colors"
            >
              Antrag stellen (PDF-Vorlage) →
            </Link>
            <Link
              href={`/checkliste?pg=${pg}&m1=${Math.round(result.moduleScores[1])}&m2=${Math.round(result.moduleScores[2])}&m3=${Math.round(result.moduleScores[3])}&m4=${Math.round(result.moduleScores[4])}&m5=${Math.round(result.moduleScores[5])}&m6=${Math.round(result.moduleScores[6])}`}
              className="block w-full text-center border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:border-gray-300 transition-colors"
            >
              MD-Termin Checkliste erstellen →
            </Link>
          </div>
        )}

        {/* App Promo */}
        <div className="bg-gray-900 rounded-2xl p-5 text-center">
          <p className="text-white font-bold mb-1">Vollständige Begutachtung in der App</p>
          <p className="text-gray-300 text-sm mb-3">Push-Benachrichtigungen · PDF-Export · Fristen nie verpassen</p>
          <a
            href="https://apps.apple.com/app/pflegepilot"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            Kostenlos im App Store →
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
      </main>
    </div>
  )
}
