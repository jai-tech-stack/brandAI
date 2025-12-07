import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth/supabaseAuth'

export async function POST(request: NextRequest) {
  try {
    await signOut()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to sign out' },
      { status: 400 }
    )
  }
}

