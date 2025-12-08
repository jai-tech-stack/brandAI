/**
 * Feature Access Control - AI/ML Developer Approach
 * Implements intelligent feature gating based on subscription tiers
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export interface FeatureLimits {
  maxBrandSystems: number
  maxAssetsPerSystem: number
  allowLogoGeneration: boolean
  allowSocialTemplates: boolean
  allowPDFExport: boolean
  allowAPI: boolean
  allowPrioritySupport: boolean
  allowCustomIntegrations: boolean
}

export const FEATURE_LIMITS: Record<SubscriptionTier, FeatureLimits> = {
  free: {
    maxBrandSystems: 1,
    maxAssetsPerSystem: 3,
    allowLogoGeneration: false,
    allowSocialTemplates: false,
    allowPDFExport: false,
    allowAPI: false,
    allowPrioritySupport: false,
    allowCustomIntegrations: false,
  },
  pro: {
    maxBrandSystems: Infinity,
    maxAssetsPerSystem: Infinity,
    allowLogoGeneration: true,
    allowSocialTemplates: true,
    allowPDFExport: true,
    allowAPI: false,
    allowPrioritySupport: false,
    allowCustomIntegrations: false,
  },
  enterprise: {
    maxBrandSystems: Infinity,
    maxAssetsPerSystem: Infinity,
    allowLogoGeneration: true,
    allowSocialTemplates: true,
    allowPDFExport: true,
    allowAPI: true,
    allowPrioritySupport: true,
    allowCustomIntegrations: true,
  },
}

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: keyof FeatureLimits
): boolean {
  const limits = FEATURE_LIMITS[tier]
  return limits[feature] === true || limits[feature] === Infinity
}

/**
 * Get remaining quota for a feature
 */
export function getRemainingQuota(
  tier: SubscriptionTier,
  feature: 'maxBrandSystems' | 'maxAssetsPerSystem',
  currentUsage: number
): number {
  const limit = FEATURE_LIMITS[tier][feature]
  if (limit === Infinity) return Infinity
  return Math.max(0, limit - currentUsage)
}

/**
 * Check if user can perform an action
 */
export function canPerformAction(
  tier: SubscriptionTier,
  action: keyof FeatureLimits,
  currentUsage?: number
): { allowed: boolean; reason?: string } {
  const limits = FEATURE_LIMITS[tier]

  switch (action) {
    case 'maxBrandSystems':
      if (limits.maxBrandSystems === Infinity) {
        return { allowed: true }
      }
      if (currentUsage !== undefined && currentUsage >= limits.maxBrandSystems) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.maxBrandSystems} brand system${limits.maxBrandSystems > 1 ? 's' : ''}. Upgrade to Pro for unlimited generations.`,
        }
      }
      return { allowed: true }

    case 'maxAssetsPerSystem':
      if (limits.maxAssetsPerSystem === Infinity) {
        return { allowed: true }
      }
      if (currentUsage !== undefined && currentUsage >= limits.maxAssetsPerSystem) {
        return {
          allowed: false,
          reason: `You've reached your limit of ${limits.maxAssetsPerSystem} assets per system. Upgrade to Pro for unlimited assets.`,
        }
      }
      return { allowed: true }

    case 'allowLogoGeneration':
      if (!limits.allowLogoGeneration) {
        return {
          allowed: false,
          reason: 'Logo generation is available in Pro and Enterprise plans. Upgrade to unlock this feature.',
        }
      }
      return { allowed: true }

    case 'allowSocialTemplates':
      if (!limits.allowSocialTemplates) {
        return {
          allowed: false,
          reason: 'Social media templates are available in Pro and Enterprise plans. Upgrade to unlock this feature.',
        }
      }
      return { allowed: true }

    case 'allowPDFExport':
      if (!limits.allowPDFExport) {
        return {
          allowed: false,
          reason: 'PDF export is available in Pro and Enterprise plans. Upgrade to unlock this feature.',
        }
      }
      return { allowed: true }

    case 'allowAPI':
      if (!limits.allowAPI) {
        return {
          allowed: false,
          reason: 'API access is available in Enterprise plans only. Contact sales for more information.',
        }
      }
      return { allowed: true }

    default:
      return { allowed: true }
  }
}

/**
 * Get user's subscription tier (defaults to 'free')
 */
export async function getUserTier(userId?: string): Promise<SubscriptionTier> {
  if (!userId) return 'free'

  try {
    // In a real implementation, fetch from database
    // For now, return default
    return 'free'
  } catch (error: unknown) {
    console.error('Error fetching user tier:', error)
    return 'free'
  }
}

