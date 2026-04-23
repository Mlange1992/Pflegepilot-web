'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DISCLAIMER } from '@/lib/utils/constants'

interface ChecklistItem {
  id: string
  kategorie: 'dokumente' | 'vorbereitung' | 'termin' | 'danach'
  text: string
  hinweis?: string
  bedingt?: boolean
}

const KATEGORIE_LABEL: Record<string, string> = {
  dokumente: '📁 Dokumente mitbringen',
  vorbereitung: '📝 Vorbereitung',
  termin: '🏠 Am Begutachtungstermin',
  danach: '📬 Nach dem Termin',
}

function generateChecklist(pg: number, m1: number, m2: number, m3: number, m4: number, m5: number): ChecklistItem[] {
  const items: ChecklistItem[] = [
    // ── Dokumente ──
    { id: 'd1', kategorie: 'dokumente', text: 'Krankenversicherungskarte / Versichertenkarte' },
    { id: 'd2', kategorie: 'dokumente', text: 'Personalausweis oder Reisepass' },
    { id: 'd3', kategorie: 'dokumente', text: 'Aktuelle Medikamentenliste (alle Medikamente mit Dosierung)' },
    { id: 'd4', kategorie: 'dokumente', text: 'Arztbriefe und Befundberichte der letzten 12 Monate' },
    { id: 'd5', kategorie: 'dokumente', text: 'Entlass- und Rehabriefe aus dem Krankenhaus' },
    { id: 'd6', kategorie: 'dokumente', text: 'Atteste und ärztliche Gutachten', bedingt: false },
    { id: 'd7', kategorie: 'dokumente', text: 'Pflegedokumentation / Pflegetagebuch (falls vorhanden)' },
    { id: 'd8', kategorie: 'dokumente', text: 'Liste der Hilfsmittel (Rollstuhl, Rollator, Inkontin.-Material etc.)', bedingt: m1 > 30 || m4 > 30 },
    { id: 'd9', kategorie: 'dokumente', text: 'Betreuungsverfügung / Vorsorgevollmacht (falls vorhanden)' },
    { id: 'd10', kategorie: 'dokumente', text: 'Bisherige MDK-Gutachten (falls Höherstufung)', bedingt: pg >= 2 },

    // ── Kognition ──
    { id: 'd_kognition', kategorie: 'dokumente', text: 'Demenz-Diagnosen, neurologische Befunde, Neuropsychologische Gutachten', bedingt: m2 > 30 },
    { id: 'd_psych', kategorie: 'dokumente', text: 'Psychiatrische / psychologische Berichte, Diagnosen', bedingt: m3 > 30 },

    // ── Vorbereitung ──
    { id: 'v1', kategorie: 'vorbereitung', text: 'Pflegetagebuch 2 Wochen vor dem Termin führen', hinweis: 'Notieren Sie täglich: Was kann die Person selbst? Wo braucht sie Hilfe?' },
    { id: 'v2', kategorie: 'vorbereitung', text: 'Alle Alltagseinschränkungen realistisch und vollständig schildern', hinweis: 'Häufiger Fehler: Fähigkeiten überschätzen aus Stolz oder Scham' },
    { id: 'v3', kategorie: 'vorbereitung', text: 'Pflegeperson / Angehörige für den Termin einplanen', hinweis: 'Jemand der gut schildern kann, was die Person nicht mehr allein schafft' },
    { id: 'v4', kategorie: 'vorbereitung', text: 'Ruhige Umgebung für den Hausbesuch vorbereiten', hinweis: 'Keine Ablenkungen, kein Fernsehen — Gutachter beobachtet auch die Wohnsituation' },
    { id: 'v5', kategorie: 'vorbereitung', text: 'Wohnung NICHT aufräumen oder herrichten', hinweis: 'Der Gutachter soll den echten Alltag sehen — nicht eine ideale Version' },
    { id: 'v6', kategorie: 'vorbereitung', text: 'Mobilitätsprobleme nicht verbergen', hinweis: 'Mit Hilfsmittel erscheinen, Gangbild zeigen wie es wirklich ist', bedingt: m1 > 30 },
    { id: 'v7', kategorie: 'vorbereitung', text: 'Inkontinenzmaterial / Pflegeprodukte sichtbar bereitstellen', bedingt: m4 > 50 },
    { id: 'v8', kategorie: 'vorbereitung', text: 'Typische Verhaltensauffälligkeiten beschreiben (schriftlich vorbereiten)', bedingt: m3 > 30 },

    // ── Am Termin ──
    { id: 't1', kategorie: 'termin', text: 'Alle Einschränkungen offen und wahrheitsgemäß benennen' },
    { id: 't2', kategorie: 'termin', text: '"Guten Tage" sagen heißt nicht, dass alles gut ist — so erklären', hinweis: 'Gutachter fragt: "Wie geht es Ihnen?" — bitte keine Höflichkeitsantwort' },
    { id: 't3', kategorie: 'termin', text: 'Den schlechtesten typischen Tag schildern, nicht den besten', hinweis: 'Maßstab ist der Alltag, nicht der Ausnahmetag' },
    { id: 't4', kategorie: 'termin', text: 'Anforderungen an Pflege zeitlich quantifizieren', hinweis: 'z.B. "Waschen dauert 45 Minuten mit Hilfe" statt "ich brauche etwas Hilfe"' },
    { id: 't5', kategorie: 'termin', text: 'Nachtpflege / Schlafstörungen ansprechen', bedingt: m3 > 30 },
    { id: 't6', kategorie: 'termin', text: 'Kognitive Einschränkungen im Alltag konkret beschreiben', bedingt: m2 > 30, hinweis: 'z.B. "Sie findet das Badezimmer nicht mehr", "vergisst Medikamente täglich"' },
    { id: 't7', kategorie: 'termin', text: 'Alle Medikamente und Pflegeleistungen benennen', bedingt: m5 > 30 },
    { id: 't8', kategorie: 'termin', text: 'Gutachter-Protokoll am Ende lesen und bei Unklarheiten nachfragen' },

    // ── Danach ──
    { id: 'n1', kategorie: 'danach', text: 'Begutachtungsprotokoll anfordern (steht Ihnen zu)' },
    { id: 'n2', kategorie: 'danach', text: 'Bescheid abwarten (i.d.R. 4–6 Wochen nach Begutachtung)' },
    { id: 'n3', kategorie: 'danach', text: 'Bei Ablehnung oder zu niedrigem Pflegegrad: Widerspruch einlegen', hinweis: 'Frist: 1 Monat nach Bescheiddatum — nutzen Sie die Antrag-Vorlage im PflegePilot' },
    { id: 'n4', kategorie: 'danach', text: 'Leistungen ab Antragsdatum beantragen (nicht erst ab Bescheid!)' },
    { id: 'n5', kategorie: 'danach', text: 'Budget-Tracker in PflegePilot einrichten — Verfall-Warnungen aktivieren' },
  ]

  return items.filter(item => item.bedingt === undefined || item.bedingt === true)
}

function ChecklistContent() {
  const searchParams = useSearchParams()
  const pg = parseInt(searchParams.get('pg') ?? '2')
  const m1 = parseInt(searchParams.get('m1') ?? '0')
  const m2 = parseInt(searchParams.get('m2') ?? '0')
  const m3 = parseInt(searchParams.get('m3') ?? '0')
  const m4 = parseInt(searchParams.get('m4') ?? '0')
  const m5 = parseInt(searchParams.get('m5') ?? '0')

  const checklist = generateChecklist(pg, m1, m2, m3, m4, m5)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const kategorien = ['dokumente', 'vorbereitung', 'termin', 'danach'] as const
  const total = checklist.length
  const done = checked.size

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between print:hidden">
        <Link href="/nba-ergebnis" className="text-sm text-gray-500 hover:text-gray-700">← Zurück</Link>
        <Link href="/" className="text-sm font-semibold text-primary-600">PflegePilot</Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Titel */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">MD-Termin Checkliste</h1>
          <p className="text-sm text-gray-500 mt-1">
            Personalisiert für Pflegegrad {pg} · {total} Punkte
          </p>
        </div>

        {/* Fortschritt */}
        <div className="print:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Erledigt</span>
            <span className="text-gray-500">{done} / {total}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Checkliste nach Kategorien */}
        {kategorien.map(kat => {
          const items = checklist.filter(i => i.kategorie === kat)
          if (items.length === 0) return null
          return (
            <div key={kat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-gray-800 text-sm">{KATEGORIE_LABEL[kat]}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map(item => (
                  <div key={item.id} className="px-5 py-3 flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors print:hidden ${
                        checked.has(item.id)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {checked.has(item.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className={`flex-1 ${checked.has(item.id) ? 'opacity-50 line-through' : ''} print:opacity-100 print:no-underline`}>
                      <p className="text-sm font-medium text-gray-800">{item.text}</p>
                      {item.hinweis && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.hinweis}</p>
                      )}
                    </div>
                    <div className="print:block hidden shrink-0 w-5 h-5 border-2 border-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Hinweis */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 print:hidden">
          <p className="font-semibold mb-1">Tipp: Widerspruch nicht vergessen</p>
          <p>Falls der Pflegegrad niedriger ausfällt als erwartet: Sofort Widerspruch einlegen (Frist 1 Monat). Die Erfolgsquote bei Widersprüchen liegt bei über 40 %.</p>
        </div>

        {/* Aktionen */}
        <div className="print:hidden space-y-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full bg-primary-600 text-white font-semibold py-4 rounded-2xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Checkliste drucken / als PDF speichern
          </button>
          <Link
            href={`/antrag?pg=${pg}`}
            className="block w-full text-center border-2 border-primary-200 text-primary-700 font-semibold py-4 rounded-2xl hover:bg-primary-50 transition-colors"
          >
            Antrag-Vorlage erstellen →
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center print:hidden">{DISCLAIMER}</p>
      </main>

      <style jsx global>{`
        @media print {
          header, .print\\:hidden { display: none !important; }
          body { background: white; }
          main { max-width: 100%; padding: 0 16px; }
        }
      `}</style>
    </>
  )
}

export default function ChecklistePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Lädt…</div>}>
        <ChecklistContent />
      </Suspense>
    </div>
  )
}
