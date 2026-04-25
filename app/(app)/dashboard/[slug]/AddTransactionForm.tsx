'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export function AddTransactionForm({
  budgetId,
  todayStr,
}: {
  budgetId: string
  todayStr: string
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return

    setError(null)
    setSuccess(false)
    setPending(true)

    const fd = new FormData(e.currentTarget)
    const payload = {
      budget_id: budgetId,
      amount_euros: String(fd.get('amount') ?? ''),
      description: String(fd.get('description') ?? ''),
      provider: String(fd.get('provider') ?? ''),
      date: String(fd.get('date') ?? ''),
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      })

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        setError(data.error || `Speichern fehlgeschlagen (HTTP ${res.status}).`)
        setPending(false)
        return
      }

      setSuccess(true)
      formRef.current?.reset()
      router.refresh()
    } catch (err) {
      console.error('AddTransactionForm submit failed', err)
      setError('Netzwerk-Fehler. Bitte erneut versuchen.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-danger-50 ring-1 ring-danger-100 px-4 py-3 text-sm text-danger-700">
          <p className="font-semibold mb-0.5">Speichern fehlgeschlagen</p>
          <p className="text-danger-700/90">{error}</p>
        </div>
      )}

      {success && (
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
            defaultValue={todayStr}
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
