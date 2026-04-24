'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { calculateBenefits, calculateExpiryDate, type Pflegegrad } from '@/lib/pflegerecht/engine'
import { BUNDESLAENDER, DISCLAIMER } from '@/lib/utils/constants'
import type { BenefitType } from '@/lib/supabase/types'

// ─── Typen ───────────────────────────────────────────────────────────────────

type Wohnsituation = 'zuhause' | 'wg' | 'heim'

interface SetupFormState {
  personName: string
  pflegegrad: Pflegegrad | null
  bundesland: string
  wohnsituation: Wohnsituation | null
  nutztPflegedienst: boolean
  pflegekasse: string
}

// ─── Hilfskomponenten ────────────────────────────────────────────────────────

function PflegegradButton({
  value,
  selected,
  onClick,
}: {
  value: Pflegegrad
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-4 rounded-2xl border-2 font-bold text-lg transition-colors min-h-[52px] ${
        selected
          ? 'border-primary-600 bg-primary-50 text-primary-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
      }`}
    >
      {value}
    </button>
  )
}

// ─── Setup Page ───────────────────────────────────────────────────────────────

export default function SetupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState<SetupFormState>({
    personName: '',
    pflegegrad: null,
    bundesland: '',
    wohnsituation: null,
    nutztPflegedienst: false,
    pflegekasse: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid =
    form.personName.trim().length > 0 &&
    form.pflegegrad !== null &&
    form.bundesland !== '' &&
    form.wohnsituation !== null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      const pflegegrad = form.pflegegrad!

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      // 1. Profil speichern / aktualisieren
      const { error: profileError } = await db
        .from('profiles')
        .upsert({
          id: user.id,
          pflegegrad,
          bundesland: form.bundesland,
          wohnsituation: form.wohnsituation!,
          nutzt_pflegedienst: form.nutztPflegedienst,
          versicherung: form.pflegekasse || null,
        })

      if (profileError) throw profileError

      // 2. Pflegebedürftige Person anlegen
      const { data: personData, error: personError } = await db
        .from('pflegebeduerftiger')
        .insert({
          user_id: user.id,
          name: form.personName.trim(),
          pflegegrad,
          bundesland: form.bundesland,
          nutzt_pflegedienst: form.nutztPflegedienst,
        })
        .select('id')
        .single()

      if (personError) throw personError
      const personId = personData.id as string

      // 3. Benefit-Types aus der DB holen
      const { data: benefitTypesRaw, error: benefitError } = await db
        .from('benefit_types')
        .select('id, slug, deadline_rule') as {
          data: Pick<BenefitType, 'id' | 'slug' | 'deadline_rule'>[] | null
          error: Error | null
        }

      if (benefitError) throw benefitError

      const benefitTypes = benefitTypesRaw ?? []

      // 4. Budgets für das aktuelle Jahr erstellen
      const currentYear = new Date().getFullYear()
      const benefits = calculateBenefits(pflegegrad)

      const budgetsToInsert = benefits
        .map((benefit) => {
          const benefitType = benefitTypes.find((bt) => bt.slug === benefit.slug)
          if (!benefitType) return null

          let expiresAt: string | null = null
          if (benefit.deadlineRule) {
            try {
              expiresAt = calculateExpiryDate(benefit.deadlineRule, currentYear).toISOString()
            } catch {
              // Unbekannte deadline_rule ignorieren
            }
          }

          return {
            user_id: user.id,
            person_id: personId,
            benefit_type_id: benefitType.id,
            year: currentYear,
            total_cents: benefit.amountCentsPerYear,
            expires_at: expiresAt,
          }
        })
        .filter((b): b is NonNullable<typeof b> => b !== null)

      if (budgetsToInsert.length > 0) {
        const { error: budgetError } = await db
          .from('budgets')
          .insert(budgetsToInsert)

        if (budgetError) {
          console.warn('Budget-Insert Warnung:', (budgetError as Error).message)
        }
      }

      router.push(`/dashboard?personId=${personId}`)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err)
      console.error('Setup error:', err)
      setError(message)
      setLoading(false)
    }
  }

  const wohnsituationOptions: { value: Wohnsituation; label: string }[] = [
    { value: 'zuhause', label: 'Zu Hause' },
    { value: 'wg', label: 'Pflege-WG' },
    { value: 'heim', label: 'Pflegeheim' },
  ]

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Person einrichten
        </h1>
        <p className="text-sm text-gray-500">
          Angaben zur pflegebedürftigen Person — für die Berechnung der Budgets.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="personName" className="block text-sm font-semibold text-gray-700 mb-2">
            Name der pflegebedürftigen Person
          </label>
          <input
            id="personName"
            type="text"
            placeholder="z. B. Oma Ingrid"
            value={form.personName}
            onChange={(e) => setForm((s) => ({ ...s, personName: e.target.value }))}
            required
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
          />
        </div>

        {/* Pflegegrad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pflegegrad
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as Pflegegrad[]).map((pg) => (
              <PflegegradButton
                key={pg}
                value={pg}
                selected={form.pflegegrad === pg}
                onClick={() => setForm((s) => ({ ...s, pflegegrad: pg }))}
              />
            ))}
          </div>
        </div>

        {/* Bundesland */}
        <div>
          <label
            htmlFor="bundesland"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Bundesland
          </label>
          <select
            id="bundesland"
            value={form.bundesland}
            onChange={(e) =>
              setForm((s) => ({ ...s, bundesland: e.target.value }))
            }
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 bg-white"
          >
            <option value="">Bundesland wählen…</option>
            {BUNDESLAENDER.map((bl) => (
              <option key={bl.value} value={bl.value}>
                {bl.label}
              </option>
            ))}
          </select>
        </div>

        {/* Wohnsituation */}
        <div>
          <fieldset>
            <legend className="block text-sm font-semibold text-gray-700 mb-3">
              Wohnsituation
            </legend>
            <div className="space-y-2">
              {wohnsituationOptions.map((o) => (
                <label
                  key={o.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-colors min-h-[52px] ${
                    form.wohnsituation === o.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="wohnsituation"
                    value={o.value}
                    checked={form.wohnsituation === o.value}
                    onChange={() =>
                      setForm((s) => ({ ...s, wohnsituation: o.value }))
                    }
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      form.wohnsituation === o.value
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {form.wohnsituation === o.value && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span
                    className={`font-medium text-sm ${
                      form.wohnsituation === o.value
                        ? 'text-primary-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {o.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Pflegedienst Toggle */}
        <div>
          <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border-2 border-gray-200 min-h-[52px]">
            <label
              htmlFor="pflegedienst"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Nutzt ambulanten Pflegedienst
            </label>
            <button
              type="button"
              id="pflegedienst"
              role="switch"
              aria-checked={form.nutztPflegedienst}
              onClick={() =>
                setForm((s) => ({
                  ...s,
                  nutztPflegedienst: !s.nutztPflegedienst,
                }))
              }
              className={`relative inline-flex w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                form.nutztPflegedienst ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.nutztPflegedienst ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Pflegekasse (optional) */}
        <div>
          <label
            htmlFor="pflegekasse"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Pflegekasse{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="pflegekasse"
            type="text"
            placeholder="z. B. AOK Bayern"
            value={form.pflegekasse}
            onChange={(e) =>
              setForm((s) => ({ ...s, pflegekasse: e.target.value }))
            }
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!isValid}
          className="w-full"
        >
          Budgets berechnen →
        </Button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">{DISCLAIMER}</p>
    </div>
  )
}
