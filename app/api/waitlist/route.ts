import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// Supabase migration:
// create table waitlist_signups (
//   id uuid primary key default gen_random_uuid(),
//   email text not null unique,
//   source text default 'homepage',
//   created_at timestamptz default now()
// );

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServiceClient() as any
  const { error } = await supabase
    .from('waitlist_signups')
    .insert({ email: email.toLowerCase().trim(), source: 'homepage' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, already: true })
    }
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
