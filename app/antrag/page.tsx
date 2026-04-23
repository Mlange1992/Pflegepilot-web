'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PFLEGEKASSEN } from '@/lib/nba/data'
import { DISCLAIMER } from '@/lib/utils/constants'

type AntragTyp = 'erstantrag' | 'hoeherst' | 'widerspruch' | 'vhp' | 'entlastung'

interface AntragData {
  typ: AntragTyp
  pflegekasse: string
  versicherungsnummer: string
  vorname: string
  nachname: string
  geburtsdatum: string
  strasse: string
  plz: string
  ort: string
  telefon: string
  email: string
  pflegegrad: string
  begruendung: string
}

const ANTRAG_TYPEN: { value: AntragTyp; label: string; beschreibung: string }[] = [
  { value: 'erstantrag', label: 'Erstantrag Pflegegrad', beschreibung: 'Erstmalige Beantragung eines Pflegegrades' },
  { value: 'hoeherst', label: 'Höherstufung', beschreibung: 'Antrag auf einen höheren Pflegegrad' },
  { value: 'widerspruch', label: 'Widerspruch', beschreibung: 'Widerspruch gegen den Pflegegrad-Bescheid' },
  { value: 'vhp', label: 'Verhinderungspflege', beschreibung: 'Bis zu 3.539 € / Jahr für Vertretungspflege' },
  { value: 'entlastung', label: 'Entlastungsbetrag', beschreibung: '131 € / Monat für anerkannte Entlastungsleistungen' },
]

function AntragFormContent() {
  const searchParams = useSearchParams()
  const pgParam = searchParams.get('pg')

  const [form, setForm] = useState<AntragData>({
    typ: 'erstantrag',
    pflegekasse: '',
    versicherungsnummer: '',
    vorname: '',
    nachname: '',
    geburtsdatum: '',
    strasse: '',
    plz: '',
    ort: '',
    telefon: '',
    email: '',
    pflegegrad: pgParam ?? '',
    begruendung: '',
  })

  const set = (key: keyof AntragData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const antragTyp = ANTRAG_TYPEN.find(t => t.value === form.typ)!

  const printAntrag = () => {
    window.print()
  }

  return (
    <>
      <div className="print:hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <Link href="/nba-ergebnis" className="text-sm text-gray-500 hover:text-gray-700">← Zurück</Link>
          <Link href="/" className="text-sm font-semibold text-primary-600">PflegePilot</Link>
        </header>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Titel */}
        <div className="print:hidden">
          <h1 className="text-2xl font-extrabold text-gray-900">Antrags-Vorlage erstellen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Füllen Sie das Formular aus und drucken Sie es als PDF aus — fertig zum Einreichen.
          </p>
        </div>

        {/* Antrag-Typ */}
        <div className="print:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900">Art des Antrags</h2>
          {ANTRAG_TYPEN.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => set('typ', t.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                form.typ === t.value
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700 hover:border-primary-300'
              }`}
            >
              <p className="font-semibold text-sm">{t.label}</p>
              <p className="text-xs text-gray-500">{t.beschreibung}</p>
            </button>
          ))}
        </div>

        {/* ─── DRUCKBARER BRIEF ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 print:shadow-none print:border-0 print:rounded-none print:p-0">

          {/* Briefkopf */}
          <div className="print:mb-8">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Vorname</label>
                <input
                  value={form.vorname}
                  onChange={e => set('vorname', e.target.value)}
                  placeholder="Vorname"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-base"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Nachname</label>
                <input
                  value={form.nachname}
                  onChange={e => set('nachname', e.target.value)}
                  placeholder="Nachname"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-base print:font-bold"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Straße und Hausnummer</label>
                <input
                  value={form.strasse}
                  onChange={e => set('strasse', e.target.value)}
                  placeholder="Straße und Hausnummer"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">PLZ</label>
                <input
                  value={form.plz}
                  onChange={e => set('plz', e.target.value)}
                  placeholder="PLZ"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Ort</label>
                <input
                  value={form.ort}
                  onChange={e => set('ort', e.target.value)}
                  placeholder="Ort"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Telefon</label>
                <input
                  value={form.telefon}
                  onChange={e => set('telefon', e.target.value)}
                  placeholder="Telefon"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">E-Mail</label>
                <input
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="E-Mail"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Geburtsdatum</label>
                <input
                  type="date"
                  value={form.geburtsdatum}
                  onChange={e => set('geburtsdatum', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Versicherungsnummer</label>
                <input
                  value={form.versicherungsnummer}
                  onChange={e => set('versicherungsnummer', e.target.value)}
                  placeholder="Versicherungsnummer"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 print:border-0 print:p-0 print:text-sm"
                />
              </div>
            </div>

            {/* Pflegekasse */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1 print:hidden">Pflegekasse</label>
              <select
                value={form.pflegekasse}
                onChange={e => set('pflegekasse', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-white print:border-0 print:p-0 print:text-sm print:appearance-none"
              >
                <option value="">Pflegekasse auswählen…</option>
                {PFLEGEKASSEN.map(pk => (
                  <option key={pk} value={pk}>{pk}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trennlinie */}
          <hr className="border-gray-200" />

          {/* Empfänger (Pflegekasse) */}
          <div className="text-sm">
            <p className="font-semibold">{form.pflegekasse || '[Pflegekasse]'}</p>
            <p className="text-gray-400 text-xs">— Bitte Adresse der Pflegekasse ergänzen —</p>
          </div>

          {/* Datum + Ort */}
          <p className="text-sm text-right text-gray-600">
            {form.ort || '[Ort]'}, den {new Date().toLocaleDateString('de-DE')}
          </p>

          {/* Betreff */}
          <div className="text-sm font-bold">
            Betreff: {antragTyp.label}
            {form.pflegegrad ? ` — Pflegegrad ${form.pflegegrad}` : ''}
            {form.versicherungsnummer ? ` · Vers.-Nr. ${form.versicherungsnummer}` : ''}
          </div>

          {/* Anrede */}
          <p className="text-sm">Sehr geehrte Damen und Herren,</p>

          {/* Automatischer Antrag-Text */}
          <div className="text-sm leading-relaxed space-y-3">
            {form.typ === 'erstantrag' && (
              <>
                <p>hiermit beantrage ich gemäß § 14 und § 15 SGB XI die Einstufung in einen Pflegegrad für die versicherte Person:</p>
                <p className="font-semibold">{form.vorname || '[Vorname]'} {form.nachname || '[Nachname]'}, geb. am {form.geburtsdatum || '[Geburtsdatum]'}</p>
                <p>Ich bitte um Begutachtung durch den Medizinischen Dienst (MDK / MEDICPROOF) zur Feststellung des Pflegegrades und um Übersendung des Begutachtungstermins.</p>
              </>
            )}
            {form.typ === 'hoeherst' && (
              <>
                <p>hiermit beantrage ich die Höherstufung des bestehenden Pflegegrades für:</p>
                <p className="font-semibold">{form.vorname || '[Vorname]'} {form.nachname || '[Nachname]'}, geb. am {form.geburtsdatum || '[Geburtsdatum]'}</p>
                <p>Der Gesundheitszustand der pflegebedürftigen Person hat sich seit der letzten Begutachtung erheblich verschlechtert. Ich bitte daher um erneute Begutachtung und Überprüfung der Einstufung.</p>
              </>
            )}
            {form.typ === 'widerspruch' && (
              <>
                <p>hiermit lege ich fristgemäß <strong>Widerspruch</strong> gegen den Bescheid vom [Datum des Bescheids] ein, mit dem mir der Pflegegrad {form.pflegegrad || '[Pflegegrad]'} zuerkannt wurde.</p>
                <p>Ich bin der Auffassung, dass die Begutachtung meinen tatsächlichen Pflegebedarf nicht zutreffend widerspiegelt und bitte um erneute Prüfung.</p>
              </>
            )}
            {form.typ === 'vhp' && (
              <>
                <p>hiermit beantrage ich die Erstattung von Kosten für <strong>Verhinderungspflege</strong> gemäß § 39 SGB XI.</p>
                <p>Die Verhinderungspflege wurde in folgendem Zeitraum in Anspruch genommen: [Zeitraum eintragen]. Belege sind beigefügt.</p>
              </>
            )}
            {form.typ === 'entlastung' && (
              <>
                <p>hiermit beantrage ich die Erstattung von Kosten für anerkannte Entlastungsleistungen gemäß § 45b SGB XI (<strong>Entlastungsbetrag</strong>).</p>
                <p>Die Leistungen wurden durch [Anbieter eintragen] erbracht. Belege und Nachweise sind beigefügt.</p>
              </>
            )}

            {/* Individuelle Begründung */}
            <div className="print:hidden">
              <label className="block text-xs font-medium text-gray-500 mb-1">Zusätzliche Begründung (optional)</label>
              <textarea
                value={form.begruendung}
                onChange={e => set('begruendung', e.target.value)}
                placeholder="Weitere Angaben zum Krankheitsbild, Medikamenten, Pflegesituation…"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
            {form.begruendung && (
              <p className="text-sm">{form.begruendung}</p>
            )}
          </div>

          {/* Grußformel */}
          <div className="text-sm space-y-8">
            <p>Ich bitte um schriftliche Bestätigung des Eingangs dieses Antrags und um baldige Bearbeitung.</p>
            <p>Mit freundlichen Grüßen,</p>
            <div className="border-t border-gray-300 w-48 pt-2">
              <p>{form.vorname} {form.nachname}</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 print:hidden">{DISCLAIMER}</p>
        </div>

        {/* Druck-Button */}
        <div className="print:hidden space-y-3">
          <button
            type="button"
            onClick={printAntrag}
            className="w-full bg-primary-600 text-white font-semibold py-4 rounded-2xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Als PDF drucken / speichern
          </button>
          <p className="text-xs text-center text-gray-400">
            Im Druckdialog „Als PDF speichern" wählen · Dann per Post oder Fax einreichen
          </p>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          header, .print\\:hidden { display: none !important; }
          body { background: white; }
          main { max-width: 100%; padding: 0; }
        }
      `}</style>
    </>
  )
}

export default function AntragPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Lädt…</div>}>
        <AntragFormContent />
      </Suspense>
    </div>
  )
}
