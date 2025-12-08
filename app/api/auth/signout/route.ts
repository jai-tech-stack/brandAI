import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth/supabaseAuth'

export async function POST(request: NextRequest) {
  try {
    await signOut()
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}

