/**
 * Feature Gate Middleware - API Protection
 * Protects API routes based on subscription tiers
 */

import { NextRequest, NextResponse } from 'next/server'
import { canPerformAction, type SubscriptionTier } from '@/lib/subscription/featureAccess'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function checkFeatureAccess(
  request: NextRequest,
  feature: 'maxBrandSystems' | 'allowLogoGeneration' | 'allowSocialTemplates' | 'allowPDFExport' | 'allowAPI',
  currentUsage?: number
): Promise<{ allowed: boolean; tier: SubscriptionTier; reason?: string }> {
  try {
    // Get user ID from request (could be from auth token, session, etc.)
    const authHeader = request.headers.get('authorization')
    const userId = request.headers.get('x-user-id') || authHeader?.replace('Bearer ', '')

    if (!userId) {
      return {
        allowed: false,
        tier: 'free',
        reason: 'Authentication required',
      }
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

    // Check feature access
    const result = canPerformAction(tier, feature, currentUsage)

    return {
      allowed: result.allowed,
      tier,
      reason: result.reason,
    }
  } catch (error) {
    console.error('Feature gate error:', error)
    return {
      allowed: false,
      tier: 'free',
      reason: 'Error checking feature access',
    }
  }
}

export function createFeatureGateResponse(reason: string, tier: SubscriptionTier) {
  return NextResponse.json(
    {
      error: reason,
      tier,
      upgradeRequired: true,
      upgradeUrl: '/#pricing',
    },
    { status: 403 }
  )
}

