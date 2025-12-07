import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/supabaseAuth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    return NextResponse.json({ session })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get session' },
      { status: 401 }
    )
  }
}

