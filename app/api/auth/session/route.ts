import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function GET(request: NextRequest) {
  try {
    // Get session from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ session: null, error: 'Supabase not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    // Try to get session from cookie
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ session: null, error: error.message })
    }

    return NextResponse.json({ session })
  } catch (error: any) {
    return NextResponse.json(
      { session: null, error: error.message || 'Failed to get session' }
    )
  }
}

