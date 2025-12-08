import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserTier, canPerformAction, type SubscriptionTier } from '@/lib/subscription/featureAccess'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { userId, action, currentUsage } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user tier from database
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    let tier: SubscriptionTier = 'free'

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('subscription_tier')
          .eq('id', userId)
          .single()

        if (!error && data?.subscription_tier) {
          tier = data.subscription_tier as SubscriptionTier
        }
      } catch (error) {
        console.warn('Error fetching user tier:', error)
      }
    }

    // Check if action is allowed
    const result = canPerformAction(tier, action, currentUsage)

    return NextResponse.json({
      success: true,
      allowed: result.allowed,
      tier,
      reason: result.reason,
    })
  } catch (error: unknown) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check subscription',
      },
      { status: 500 }
    )
  }
}

