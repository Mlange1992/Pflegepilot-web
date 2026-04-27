'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

function PasswordRequirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-400'}`}>
        {met ? '✓' : '○'}
      </span>
      <span className={`text-xs ${met ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setHasSession(Boolean(data.session))
      setCheckingSession(false)
    })
    return () => { active = false }
  }, [supabase])

  const passwordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  const matches = password.length > 0 && password === confirm
  const canSubmit = passwordValid && matches && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    const { error: supaError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (supaError) {
      setError(supaError.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 text-sm">Sitzung wird geprüft …</p>
      </main>
    )
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center space-y-4 bg-white rounded-3xl border border-gray-100 p-6">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900">Link abgelaufen oder ungültig</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Der Reset-Link funktioniert nur einmal und nur kurze Zeit. Bitte fordern
            Sie einen neuen Link an.
          </p>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => router.push('/auth')}
            className="w-full"
          >
            Zurück zur Anmeldung
          </Button>
        </div>
      </main>
    )
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center space-y-4 bg-white rounded-3xl border border-gray-100 p-6">
          <div className="text-5xl">✅</div>
          <h1 className="text-xl font-bold text-gray-900">Passwort gespeichert</h1>
          <p className="text-gray-600 text-sm">Sie werden weitergeleitet …</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Neues Passwort</h1>
          <p className="text-gray-500 text-sm mt-1">
            Vergeben Sie ein neues Passwort für Ihren Account.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                Neues Passwort
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Passwort bestätigen
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
              />
            </div>

            {password.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <PasswordRequirement label="Mindestens 8 Zeichen" met={password.length >= 8} />
                <PasswordRequirement label="Mindestens 1 Großbuchstabe (A–Z)" met={/[A-Z]/.test(password)} />
                <PasswordRequirement label="Mindestens 1 Zahl (0–9)" met={/[0-9]/.test(password)} />
                <PasswordRequirement label="Beide Eingaben stimmen überein" met={matches} />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!canSubmit}
              className="w-full"
            >
              Passwort speichern
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
