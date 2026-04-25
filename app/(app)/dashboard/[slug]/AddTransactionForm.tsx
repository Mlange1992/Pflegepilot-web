'use client'

import { useActionState, useEffect, useRef } from 'react'

export type AddTransactionState = {
  ok: boolean
  error?: string
  fields?: { amount?: string; date?: string; description?: string; provider?: string }
}

const INITIAL: AddTransactionState = { ok: false }

export function AddTransactionForm({
  budgetId,
  todayStr,
  action,
}: {
  budgetId: string
  todayStr: string
  action: (prev: AddTransactionState, formData: FormData) => Promise<AddTransactionState>
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok && formRef.current) {
      formRef.current.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="budget_id" value={budgetId} />

      {state.error && (
        <div className="rounded-xl bg-danger-50 ring-1 ring-danger-100 px-4 py-3 text-sm text-danger-700">
          <p className="font-semibold mb-0.5">Speichern fehlgeschlagen</p>
          <p className="text-danger-700/90">{state.error}</p>
        </div>
      )}

      {state.ok && (
        <div className="rounded-xl bg-success-50 ring-1 ring-success-100 px-4 py-3 text-sm text-success-700 font-medium">
          ✓ Ausgabe gespeichert
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="amount" className="block text-xs font-medium text-gray-600 mb-1">
            Betrag (€) *
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            placeholder="z.B. 124,50"
            required
            defaultValue={state.fields?.amount}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="date" className="block text-xs font-medium text-gray-600 mb-1">
            Datum *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={state.fields?.date ?? todayStr}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="block text-xs font-medium text-gray-600 mb-1">
            Beschreibung *
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="z.B. Haushaltshilfe Frau Müller"
            required
            defaultValue={state.fields?.description}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="provider" className="block text-xs font-medium text-gray-600 mb-1">
            Anbieter (optional)
          </label>
          <input
            id="provider"
            name="provider"
            type="text"
            placeholder="z.B. Pflegedienst Sonnenschein GmbH"
            defaultValue={state.fields?.provider}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[48px]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl min-h-[48px] hover:bg-primary-700 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Wird gespeichert…' : 'Ausgabe speichern'}
      </button>
    </form>
  )
}
