import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function SignOutForm() {
  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth')
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 min-h-[36px] px-2"
      >
        Abmelden
      </button>
    </form>
  )
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-extrabold text-primary-600 text-lg tracking-tight">
            🧭 PflegePilot
          </span>
          <SignOutForm />
        </div>
      </nav>

      {/* Hauptinhalt */}
      <main className="max-w-2xl mx-auto px-4 py-5">{children}</main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="max-w-2xl mx-auto grid grid-cols-3">
          <TabItem href="/dashboard" icon="📊" label="Budgets" />
          <TabItem href="/ratgeber" icon="📚" label="Ratgeber" />
          <TabItem href="/profil" icon="👤" label="Profil" />
        </div>
      </nav>
    </div>
  )
}

function TabItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 text-gray-500 hover:text-primary-600 transition-colors min-h-[56px] group"
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
