'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-white font-bold text-lg">Du bist auf der Liste!</p>
        <p className="text-gray-300 text-sm mt-2">
          Wir benachrichtigen dich, sobald die iOS-App verfügbar ist.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de"
        className="flex-1 rounded-xl px-4 py-3 text-gray-900 text-base outline-none focus:ring-2 focus:ring-primary-400"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Wird gespeichert…' : 'Benachrichtigen'}
      </button>
      {status === 'error' && (
        <p className="text-red-300 text-sm w-full">Fehler — bitte nochmal versuchen.</p>
      )}
    </form>
  )
}
