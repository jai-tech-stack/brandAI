import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth/supabaseAuth'
import { z } from 'zod'

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signinSchema.parse(body)

    const data = await signIn(email, password)

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (err: unknown) {
    console.error('Signin error:', err)
    
    const error = err instanceof Error ? err : new Error('Unknown error')
    const errorStatus = (err as any)?.status || 401
    
    // Handle rate limiting
    if (errorStatus === 429 || error.message?.includes('rate limit') || error.message?.includes('429')) {
      return NextResponse.json(
        { 
          error: 'Too many sign-in attempts. Please wait a few minutes and try again.',
          code: 'RATE_LIMIT'
        },
        { status: 429 }
      )
    }
    
    // Handle invalid credentials
    if (errorStatus === 400 || error.message?.includes('Invalid login') || error.message?.includes('invalid')) {
      return NextResponse.json(
        { 
          error: 'Invalid email or password. Please check your credentials and try again.',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      )
    }
    
    // Ensure JSON response
    return NextResponse.json(
      { 
        error: error.message || 'Failed to sign in. Please check your credentials.',
        code: 'SIGNIN_ERROR'
      },
      { status: errorStatus }
    )
  }
}

