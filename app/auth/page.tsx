'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

type Tab = 'register' | 'login'

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

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)

  const canSubmit = email.trim().length > 0 && (tab === 'login' ? password.length > 0 : passwordValid)

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (tab === 'register') {
      const { error: supaError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${APP_URL}/auth/callback` },
      })
      setLoading(false)
      if (supaError) {
        setError(supaError.message)
      } else {
        setSent(true)
      }
    } else {
      const { error: supaError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      setLoading(false)
      if (supaError) {
        setError('E-Mail oder Passwort falsch.')
      } else {
        window.location.href = '/dashboard'
      }
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    const { data, error: supaError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${APP_URL}/auth/callback` },
    })
    if (supaError) {
      setGoogleLoading(false)
      setError(supaError.message)
      return
    }
    if (data.url) window.location.href = data.url
    else setGoogleLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="text-5xl">📬</div>
          <h2 className="text-xl font-bold text-gray-900">E-Mail unterwegs!</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Wir haben Ihnen einen Bestätigungs-Link an{' '}
            <span className="font-semibold text-gray-900">{email}</span> geschickt.
            Bitte prüfen Sie Ihre E-Mails.
          </p>
          <button
            type="button"
            onClick={() => { setSent(false); setEmail(''); setPassword('') }}
            className="text-sm text-primary-600 underline underline-offset-2 hover:text-primary-700"
          >
            Andere E-Mail verwenden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="text-4xl mb-2">🧭</div>
          <h1 className="text-2xl font-extrabold text-gray-900">PflegePilot</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ihr persönlicher Pflege-Finanzmanager
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null) }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === 'register'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrieren
            </button>
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null) }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === 'login'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Anmelden
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* E-Mail/Passwort Form */}
          <form onSubmit={handleEmailPassword} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-base min-h-[52px] focus:outline-none focus:border-primary-500 placeholder:text-gray-400"
              />
            </div>

            {/* Live password requirements (register only) */}
            {tab === 'register' && password.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <PasswordRequirement label="Mindestens 8 Zeichen" met={password.length >= 8} />
                <PasswordRequirement label="Mindestens 1 Großbuchstabe (A–Z)" met={/[A-Z]/.test(password)} />
                <PasswordRequirement label="Mindestens 1 Zahl (0–9)" met={/[0-9]/.test(password)} />
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
              {tab === 'register' ? 'Kostenlosen Account erstellen' : 'Anmelden'}
            </Button>
          </form>

          {/* Trennlinie */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">oder</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            loading={googleLoading}
            onClick={handleGoogle}
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Weiter mit Google
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center px-2">
          Durch die Anmeldung stimmen Sie unseren{' '}
          <a href="/datenschutz" className="underline hover:text-gray-600">
            Datenschutzbedingungen
          </a>{' '}
          zu.
        </p>
      </div>
    </div>
  )
}
