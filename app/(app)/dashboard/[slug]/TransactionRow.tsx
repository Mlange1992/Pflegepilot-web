'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Tx = {
  id: string
  amount_cents: number
  description: string | null
  provider_name: string | null
  date: string
}

function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  })
}

function formatDateDe(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function centsToInputString(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export function TransactionRow({ tx }: { tx: Tx }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [amount, setAmount] = useState(centsToInputString(tx.amount_cents))
  const [description, setDescription] = useState(tx.description ?? '')
  const [provider, setProvider] = useState(tx.provider_name ?? '')
  const [date, setDate] = useState(tx.date)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return
    setError(null)
    setPending(true)
    try {
      const res = await fetch(`/api/transactions/${tx.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amount_euros: amount,
          description,
          provider,
          date,
        }),
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || `Fehler (HTTP ${res.status}).`)
        setPending(false)
        return
      }
      setEditing(false)
      router.refresh()
    } catch {
      setError('Netzwerk-Fehler. Bitte erneut versuchen.')
    } finally {
      setPending(false)
    }
  }

  async function handleDelete() {
    if (pending) return
    setError(null)
    setPending(true)
    try {
      const res = await fetch(`/api/transactions/${tx.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || `Fehler (HTTP ${res.status}).`)
        setPending(false)
        return
      }
      router.refresh()
    } catch {
      setError('Netzwerk-Fehler. Bitte erneut versuchen.')
      setPending(false)
    }
  }

  if (editing) {
    return (
      <div className="px-5 py-4 bg-primary-50/30">
        <form onSubmit={handleSave} className="space-y-3">
          {error && (
            <p className="text-xs text-danger-700 bg-danger-50 ring-1 ring-danger-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Betrag (€) *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[40px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Datum *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[40px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Beschreibung *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[40px]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Anbieter
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[40px]"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {pending ? 'Speichern…' : 'Speichern'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setError(null)
                setAmount(centsToInputString(tx.amount_cents))
                setDescription(tx.description ?? '')
                setProvider(tx.provider_name ?? '')
                setDate(tx.date)
              }}
              disabled={pending}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="px-5 py-3 flex items-center justify-between gap-3 group">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {tx.description ?? '—'}
        </p>
        <p className="text-xs text-gray-400">
          {formatDateDe(tx.date)}
          {tx.provider_name ? ` · ${tx.provider_name}` : ''}
        </p>
        {error && (
          <p className="text-xs text-danger-700 mt-1">{error}</p>
        )}
      </div>

      <span className="text-sm font-semibold text-danger-600 shrink-0">
        −{formatEuro(tx.amount_cents)}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        {!confirmingDelete ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={pending}
              aria-label="Bearbeiten"
              title="Bearbeiten"
              className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
              aria-label="Löschen"
              title="Löschen"
              className="p-2 text-gray-400 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="px-3 py-1.5 bg-danger-600 text-white text-xs font-semibold rounded-lg hover:bg-danger-700 transition-colors min-h-[36px] disabled:opacity-60"
            >
              {pending ? '…' : 'Löschen'}
            </button>
            <button
              type="button"
              onClick={() => { setConfirmingDelete(false); setError(null) }}
              disabled={pending}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors min-h-[36px]"
            >
              Abbr.
            </button>
          </>
        )}
      </div>
    </div>
  )
}
