import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ isAdmin: false, error: 'Supabase not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get user from session
    const authHeader = request.headers.get('authorization')
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { session } } = await supabaseAnon.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    // Check admin status
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ isAdmin: false })
    }

    return NextResponse.json({ isAdmin: data.role === 'admin' })
  } catch (error: any) {
    return NextResponse.json(
      { isAdmin: false, error: error.message || 'Failed to check admin status' }
    )
  }
}

