'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { BUNDESLAENDER, QUICK_CHECK_LEISTUNGEN, VERBRAUCHERZENTRALE_URL, DISCLAIMER } from '@/lib/utils/constants'
import type { Pflegegrad } from '@/lib/pflegerecht/engine'

// ─── Typen ───────────────────────────────────────────────────────────────────

type Wohnsituation = 'zuhause' | 'wg' | 'heim'

interface WizardState {
  pflegegrad: Pflegegrad | null
  keinPflegegrad: boolean
  wohnsituation: Wohnsituation | null
  bundesland: string
  genutzteLeistungen: string[]
  nutztPflegedienst: boolean | null
}

const TOTAL_STEPS = 5

// ─── Hilfskomponenten ────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Schritt {step} von {TOTAL_STEPS}</span>
        <span>{Math.round((step / TOTAL_STEPS) * 100)} %</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-colors min-h-[52px] ${
        selected
          ? 'border-primary-600 bg-primary-50 text-primary-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
      }`}
    >
      {children}
    </button>
  )
}

// ─── Schritte ────────────────────────────────────────────────────────────────

function Step1({
  state,
  setState,
}: {
  state: WizardState
  setState: React.Dispatch<React.SetStateAction<WizardState>>
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Hat die Person bereits einen Pflegegrad?
      </h2>

      {([1, 2, 3, 4, 5] as Pflegegrad[]).map((pg) => (
        <ChoiceButton
          key={pg}
          selected={state.pflegegrad === pg && !state.keinPflegegrad}
          onClick={() =>
            setState((s) => ({ ...s, pflegegrad: pg, keinPflegegrad: false }))
          }
        >
          Ja — Pflegegrad {pg}
        </ChoiceButton>
      ))}

      <ChoiceButton
        selected={state.keinPflegegrad}
        onClick={() =>
          setState((s) => ({ ...s, keinPflegegrad: true, pflegegrad: null }))
        }
      >
        Nein / Noch nicht bekannt
      </ChoiceButton>

      {state.keinPflegegrad && (
        <div className="mt-4 rounded-2xl bg-primary-50 border border-primary-200 p-4 space-y-3">
          <p className="text-sm text-primary-800 font-medium">
            Noch keinen Pflegegrad? Nutzen Sie zuerst den kostenlosen
            Pflegegrad-Rechner der Verbraucherzentrale.
          </p>
          <a
            href={VERBRAUCHERZENTRALE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 underline underline-offset-2"
          >
            Zum Pflegegrad-Rechner →
          </a>
          <div className="pt-1">
            <button
              type="button"
              onClick={() =>
                setState((s) => ({
                  ...s,
                  keinPflegegrad: true,
                  pflegegrad: 2,
                }))
              }
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
            >
              Trotzdem schätzen (mit PG 2 als Beispiel)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Step2({
  state,
  setState,
}: {
  state: WizardState
  setState: React.Dispatch<React.SetStateAction<WizardState>>
}) {
  const options: { value: Wohnsituation; label: string }[] = [
    { value: 'zuhause', label: 'Ja, zu Hause' },
    { value: 'wg', label: 'In einer Pflege-WG' },
    { value: 'heim', label: 'Im Pflegeheim' },
  ]

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Wird die Person zu Hause versorgt?
      </h2>
      {options.map((o) => (
        <ChoiceButton
          key={o.value}
          selected={state.wohnsituation === o.value}
          onClick={() =>
            setState((s) => ({ ...s, wohnsituation: o.value }))
          }
        >
          {o.label}
        </ChoiceButton>
      ))}
    </div>
  )
}

function Step3({
  state,
  setState,
}: {
  state: WizardState
  setState: React.Dispatch<React.SetStateAction<WizardState>>
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        In welchem Bundesland?
      </h2>
      <select
        value={state.bundesland}
        onChange={(e) =>
          setState((s) => ({ ...s, bundesland: e.target.value }))
        }
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-base min-h-[52px] focus:outline-none focus:border-primary-500 bg-white"
      >
        <option value="">Bundesland wählen…</option>
        {BUNDESLAENDER.map((bl) => (
          <option key={bl.value} value={bl.value}>
            {bl.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Step4({
  state,
  setState,
}: {
  state: WizardState
  setState: React.Dispatch<React.SetStateAction<WizardState>>
}) {
  const toggle = (slug: string) => {
    setState((s) => ({
      ...s,
      genutzteLeistungen: s.genutzteLeistungen.includes(slug)
        ? s.genutzteLeistungen.filter((l) => l !== slug)
        : [...s.genutzteLeistungen, slug],
    }))
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Welche Leistungen nutzen Sie bereits?
      </h2>
      <p className="text-sm text-gray-500 mb-4">Mehrfachauswahl möglich.</p>

      {QUICK_CHECK_LEISTUNGEN.map((l) => {
        const checked = state.genutzteLeistungen.includes(l.slug)
        return (
          <button
            key={l.slug}
            type="button"
            onClick={() => toggle(l.slug)}
            className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-colors min-h-[52px] flex items-center gap-3 ${
              checked
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                checked
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-300'
              }`}
            >
              {checked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            {l.label}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => setState((s) => ({ ...s, genutzteLeistungen: [] }))}
        className="w-full text-left px-5 py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-500 hover:border-gray-300 font-medium min-h-[52px]"
      >
        Keine / Weiß nicht
      </button>
    </div>
  )
}

function Step5({
  state,
  setState,
}: {
  state: WizardState
  setState: React.Dispatch<React.SetStateAction<WizardState>>
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Nutzen Sie einen ambulanten Pflegedienst?
      </h2>
      <ChoiceButton
        selected={state.nutztPflegedienst === true}
        onClick={() =>
          setState((s) => ({ ...s, nutztPflegedienst: true }))
        }
      >
        Ja
      </ChoiceButton>
      <ChoiceButton
        selected={state.nutztPflegedienst === false}
        onClick={() =>
          setState((s) => ({ ...s, nutztPflegedienst: false }))
        }
      >
        Nein
      </ChoiceButton>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CheckPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>({
    pflegegrad: null,
    keinPflegegrad: false,
    wohnsituation: null,
    bundesland: '',
    genutzteLeistungen: [],
    nutztPflegedienst: null,
  })

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return state.pflegegrad !== null
      case 2:
        return state.wohnsituation !== null
      case 3:
        return state.bundesland !== ''
      case 4:
        return true // Checkboxen sind optional
      case 5:
        return state.nutztPflegedienst !== null
      default:
        return false
    }
  }

  const handleWeiter = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      return
    }

    // Schritt 5 abgeschlossen → zur Ergebnisseite navigieren
    const pg = state.pflegegrad ?? 2
    const wohn = state.wohnsituation ?? 'zuhause'
    const bl = state.bundesland || 'NW'
    const leistungen = state.genutzteLeistungen.join(',')
    const pflegedienst = state.nutztPflegedienst ? 'true' : 'false'

    router.push(
      `/ergebnis?pg=${pg}&wohn=${wohn}&bl=${bl}&leistungen=${leistungen}&pflegedienst=${pflegedienst}`
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zurück
          </button>
        ) : (
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            PflegePilot
          </Link>
        )}
        <span className="text-xs text-gray-400">
          Schritt {step}/{TOTAL_STEPS}
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <ProgressBar step={step} />

        {step === 1 && <Step1 state={state} setState={setState} />}
        {step === 2 && <Step2 state={state} setState={setState} />}
        {step === 3 && <Step3 state={state} setState={setState} />}
        {step === 4 && <Step4 state={state} setState={setState} />}
        {step === 5 && <Step5 state={state} setState={setState} />}

        {step === TOTAL_STEPS && (
          <p className="mt-6 text-xs text-gray-400 text-center">{DISCLAIMER}</p>
        )}
      </main>

      {/* Sticky Footer Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 safe-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!canProceed()}
            onClick={handleWeiter}
          >
            {step === TOTAL_STEPS ? 'Ergebnis anzeigen' : 'Weiter'}
          </Button>
        </div>
      </div>
    </div>
  )
}
