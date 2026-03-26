import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = signupSchema.parse(body)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured on the server.', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (err: unknown) {
    console.error('Signup error:', err)
    
    const error = err instanceof Error ? err : new Error('Unknown error')
    const errorStatus = (err as any)?.status || 400
    
    // Handle rate limiting
    if (errorStatus === 429 || error.message?.includes('rate limit') || error.message?.includes('429')) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please wait a few minutes and try again.',
          code: 'RATE_LIMIT'
        },
        { status: 429 }
      )
    }
    
    // Handle validation errors
    if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists. Please sign in instead.',
          code: 'EMAIL_EXISTS'
        },
        { status: 400 }
      )
    }
    
    // Ensure JSON response
    return NextResponse.json(
      { 
        error: error.message || 'Failed to sign up. Please check your email and password.',
        code: 'SIGNUP_ERROR'
      },
      { status: errorStatus }
    )
  }
}

