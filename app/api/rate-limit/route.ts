// app/api/rate-limit/route.ts
// Server-side rate limiting for anonymous users

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// In-memory rate limit store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 3600000) // 1 hour

function getClientIdentifier(request: NextRequest): string {
  // Get IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  
  // Get user agent for fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Create a simple fingerprint (in production, use a proper fingerprinting library)
  return `${ip}-${userAgent.slice(0, 50)}`
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== 'check' && action !== 'increment') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    const identifier = getClientIdentifier(request)
    const now = Date.now()
    const windowMs = 24 * 60 * 60 * 1000 // 24 hours
    const limit = 1 // Anonymous users get 1 free generation
    
    let record = rateLimitStore.get(identifier)
    
    // Reset if window expired
    if (!record || record.resetAt < now) {
      record = { count: 0, resetAt: now + windowMs }
      rateLimitStore.set(identifier, record)
    }
    
    if (action === 'check') {
      return NextResponse.json({
        allowed: record.count < limit,
        remaining: Math.max(0, limit - record.count),
        resetAt: record.resetAt,
      })
    }
    
    if (action === 'increment') {
      record.count++
      rateLimitStore.set(identifier, record)
      
      return NextResponse.json({
        allowed: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        resetAt: record.resetAt,
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Rate limit error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Rate limit check failed' },
      { status: 500 }
    )
  }
}

