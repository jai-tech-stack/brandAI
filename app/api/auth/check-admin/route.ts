import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdmin } from '@/lib/auth/supabaseAuth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const admin = await isAdmin(user.id)
    return NextResponse.json({ isAdmin: admin })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to check admin status' },
      { status: 401 }
    )
  }
}

