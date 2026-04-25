'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DISCLAIMER } from '@/lib/utils/constants'

type Profile = {
  pflegegrad: number | null
  bundesland: string | null
  nutzt_pflegedienst: boolean | null
}

export default function ProfilPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setEmail(user.email ?? null)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('profiles')
        .select('pflegegrad, bundesland, nutzt_pflegedienst')
        .eq('id', user.id)
        .single()

      setProfile(data ?? null)
      setLoading(false)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setDeleteError(data.error || `Löschen fehlgeschlagen (HTTP ${res.status}).`)
        setDeleting(false)
        return
      }
      // Auth-Cookie wird serverseitig invalidiert — lokal Session-Cache leeren.
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (err) {
      console.error('handleDeleteAccount failed', err)
      setDeleteError('Netzwerk-Fehler. Bitte erneut versuchen.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400 text-sm">Laden…</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Profil</h1>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Account</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{email}</p>
            <p className="text-xs text-gray-400">Eingeloggter Account</p>
          </div>
        </div>
      </div>

      {/* Pflegeprofil */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Pflegeprofil</h2>
          <div className="space-y-2">
            {profile.pflegegrad && (
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Pflegegrad</span>
                <span className="font-semibold text-gray-900">PG {profile.pflegegrad}</span>
              </div>
            )}
            {profile.bundesland && (
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">Bundesland</span>
                <span className="font-semibold text-gray-900">{profile.bundesland}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Ambulanter Pflegedienst</span>
              <span className="font-semibold text-gray-900">
                {profile.nutzt_pflegedienst ? 'Ja' : 'Nein'}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/setup')}
            className="w-full text-center text-sm text-primary-600 font-medium py-2 hover:underline"
          >
            Profil bearbeiten →
          </button>
        </div>
      )}

      {/* Links */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <a
          href="/datenschutz"
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm text-gray-700">Datenschutzerklärung</span>
          <span className="text-gray-400">›</span>
        </a>
        <a
          href="/impressum"
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm text-gray-700">Impressum</span>
          <span className="text-gray-400">›</span>
        </a>
      </div>

      {/* Abmelden */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full bg-white border border-gray-200 rounded-2xl py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        {signingOut ? 'Abmelden…' : 'Abmelden'}
      </button>

      {/* Account löschen */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
        <h2 className="font-bold text-red-600 text-sm mb-2">Account löschen</h2>
        <p className="text-xs text-gray-500 mb-3">
          Alle Daten werden unwiderruflich gelöscht (DSGVO Art. 17).
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="text-sm text-red-600 font-medium underline underline-offset-2"
          >
            Account und alle Daten löschen
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">Wirklich alle Daten löschen?</p>
            {deleteError && (
              <p className="text-xs text-red-700 bg-red-50 ring-1 ring-red-100 rounded-lg px-3 py-2">
                {deleteError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Löschen…' : 'Ja, löschen'}
              </button>
              <button
                onClick={() => { setDeleteConfirm(false); setDeleteError(null) }}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">{DISCLAIMER}</p>
    </div>
  )
}
