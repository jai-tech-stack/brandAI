/**
 * Credit Management System
 * Handles credit tracking, deduction, and refunds
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export interface CreditInfo {
  credits: number
  subscriptionTier: 'free' | 'starter' | 'plus' | 'pro' | 'enterprise'
  monthlyCredits: number
  creditsResetDate?: string
}

/**
 * Get user's credit information
 */
export async function getUserCredits(userId: string): Promise<CreditInfo | null> {
  if (!supabase || !userId) return null

  try {
    const { data, error } = await supabase
      .from('users')
      .select('credits, subscription_tier, credits_reset_date')
      .eq('id', userId)
      .single()

    if (error || !data) return null

    const tier = data.subscription_tier as CreditInfo['subscriptionTier']
    const monthlyCredits = getMonthlyCreditsForTier(tier)

    return {
      credits: data.credits || 0,
      subscriptionTier: tier,
      monthlyCredits,
      creditsResetDate: data.credits_reset_date || undefined,
    }
  } catch (error) {
    console.error('Error fetching user credits:', error)
    return null
  }
}

/**
 * Get monthly credits for a subscription tier
 */
export function getMonthlyCreditsForTier(tier: 'free' | 'starter' | 'plus' | 'pro' | 'enterprise'): number {
  switch (tier) {
    case 'free':
      return 0 // Free tier gets 6 one-time credits, no monthly reset
    case 'starter':
      return 25
    case 'plus':
      return 50
    case 'pro':
      return 100
    case 'enterprise':
      return Infinity
    default:
      return 0
  }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(userId: string, requiredCredits: number = 1): Promise<boolean> {
  const creditInfo = await getUserCredits(userId)
  if (!creditInfo) return false
  return creditInfo.credits >= requiredCredits
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(
  userId: string,
  amount: number,
  projectId?: string,
  assetId?: string,
  description?: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  if (!supabase || !userId) {
    return { success: false, error: 'Invalid user or database connection' }
  }

  try {
    // Get current credits
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: 'Failed to fetch user credits' }
    }

    const currentCredits = userData.credits || 0
    if (currentCredits < amount) {
      return { success: false, error: 'Insufficient credits' }
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: currentCredits - amount })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: 'Failed to deduct credits' }
    }

    // Record transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        project_id: projectId || null,
        asset_id: assetId || null,
        amount: -amount,
        type: 'generation',
        description: description || `Used ${amount} credit${amount > 1 ? 's' : ''} for asset generation`,
      })

    return { success: true, remainingCredits: currentCredits - amount }
  } catch (error) {
    console.error('Error deducting credits:', error)
    return { success: false, error: 'Failed to deduct credits' }
  }
}

/**
 * Refund credits to user account (e.g., when generation fails)
 */
export async function refundCredits(
  userId: string,
  amount: number,
  assetId?: string,
  description?: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  if (!supabase || !userId) {
    return { success: false, error: 'Invalid user or database connection' }
  }

  try {
    // Get current credits
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: 'Failed to fetch user credits' }
    }

    const currentCredits = userData.credits || 0

    // Add credits back
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: currentCredits + amount })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: 'Failed to refund credits' }
    }

    // Mark asset as refunded if assetId provided
    if (assetId) {
      await supabase
        .from('assets')
        .update({ refunded: true })
        .eq('id', assetId)
    }

    // Record transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        asset_id: assetId || null,
        amount: amount,
        type: 'refund',
        description: description || `Refunded ${amount} credit${amount > 1 ? 's' : ''} due to generation failure`,
      })

    return { success: true, remainingCredits: currentCredits + amount }
  } catch (error) {
    console.error('Error refunding credits:', error)
    return { success: false, error: 'Failed to refund credits' }
  }
}

/**
 * Reset monthly credits (called on subscription renewal or monthly reset)
 */
export async function resetMonthlyCredits(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !userId) {
    return { success: false, error: 'Invalid user or database connection' }
  }

  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: 'Failed to fetch user data' }
    }

    const tier = userData.subscription_tier as CreditInfo['subscriptionTier']
    const monthlyCredits = getMonthlyCreditsForTier(tier)

    // Free tier doesn't get monthly resets (only one-time 6 credits)
    if (tier === 'free') {
      return { success: true }
    }

    // Calculate next reset date (30 days from now)
    const nextResetDate = new Date()
    nextResetDate.setDate(nextResetDate.getDate() + 30)

    // Update credits and reset date
    const { error: updateError } = await supabase
      .from('users')
      .update({
        credits: monthlyCredits,
        credits_reset_date: nextResetDate.toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: 'Failed to reset monthly credits' }
    }

    // Record transaction
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: monthlyCredits,
        type: 'monthly_reset',
        description: `Monthly credit reset: ${monthlyCredits} credits`,
      })

    return { success: true }
  } catch (error) {
    console.error('Error resetting monthly credits:', error)
    return { success: false, error: 'Failed to reset monthly credits' }
  }
}

/**
 * Check and auto-reset credits if reset date has passed
 */
export async function checkAndResetCredits(userId: string): Promise<void> {
  if (!supabase || !userId) return

  try {
    const { data, error } = await supabase
      .from('users')
      .select('credits_reset_date, subscription_tier')
      .eq('id', userId)
      .single()

    if (error || !data || !data.credits_reset_date) return

    const resetDate = new Date(data.credits_reset_date)
    const now = new Date()

    // If reset date has passed, reset credits
    if (now >= resetDate) {
      await resetMonthlyCredits(userId)
    }
  } catch (error) {
    console.error('Error checking credit reset:', error)
  }
}

