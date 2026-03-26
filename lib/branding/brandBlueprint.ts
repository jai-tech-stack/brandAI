import { WebsiteAnalysis } from '../analyzer/extractorTypes'

export type UserTier = 'free' | 'pro' | 'enterprise'
export type InputMode = 'url' | 'social' | 'logo'

type MinTier = UserTier

export interface BlueprintItem {
  id: string
  pillar: string
  section: string
  title: string
  minTier: MinTier
  availability: 'available' | 'locked'
  status: 'ready' | 'draft' | 'needs_input' | 'locked'
  confidence: {
    score: number
    level: 'high' | 'medium' | 'low'
    rationale: string
  }
  source: Array<'url' | 'social' | 'logo' | 'user_input' | 'ai_inferred'>
  needsReview: boolean
  data: Record<string, unknown>
}

export interface BrandBlueprint {
  meta: {
    mode: InputMode
    tier: UserTier
    generatedAt: string
  }
  pillars: Array<{
    key: string
    title: string
    items: BlueprintItem[]
  }>
}

interface BuildInput {
  mode: InputMode
  tier: UserTier
  analysis: WebsiteAnalysis
  strategy: any
  brandSystem: any
}

const tierRank: Record<UserTier, number> = {
  free: 1,
  pro: 2,
  enterprise: 3,
}

function levelFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 75) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

function computeConfidence(mode: InputMode, hasData: boolean, strategic = false): BlueprintItem['confidence'] {
  if (!hasData) {
    return {
      score: 30,
      level: 'low',
      rationale: 'Insufficient input signals. Add more context for accuracy.',
    }
  }

  let score = 65
  if (mode === 'url') score = 85
  if (mode === 'social') score = strategic ? 70 : 75
  if (mode === 'logo') score = strategic ? 55 : 72

  return {
    score,
    level: levelFromScore(score),
    rationale:
      mode === 'url'
        ? 'Website structure, copy, and visual signals improve extraction accuracy.'
        : mode === 'social'
        ? 'Social profile data provides moderate signal depth.'
        : 'Logo-first mode is strongest for visual identity, weaker for strategy semantics.',
  }
}

function availabilityFor(minTier: MinTier, tier: UserTier): 'available' | 'locked' {
  return tierRank[tier] >= tierRank[minTier] ? 'available' : 'locked'
}

function makeItem(
  base: Omit<BlueprintItem, 'availability' | 'status'> & { minTier: MinTier },
  tier: UserTier
): BlueprintItem {
  const availability = availabilityFor(base.minTier, tier)
  const status =
    availability === 'locked'
      ? 'locked'
      : base.confidence.score < 50
      ? 'needs_input'
      : base.confidence.score < 75
      ? 'draft'
      : 'ready'

  return {
    ...base,
    availability,
    status,
  }
}

export function buildBrandBlueprint(input: BuildInput): BrandBlueprint {
  const { mode, tier, analysis, strategy, brandSystem } = input
  const brandName = strategy?.brandCore?.brandName || analysis?.metadata?.title || 'Brand'
  const hasLogo = Boolean(brandSystem?.logos?.icon?.length || analysis?.images?.logos?.length)
  const hasColors = Boolean(brandSystem?.colors?.primary?.length || brandSystem?.primaryColors?.length)
  const hasTypography = Boolean(brandSystem?.typography?.primary?.name || brandSystem?.primaryFont)
  const hasStrategy = Boolean(strategy?.positioning?.statement || strategy?.brandCore?.mission)
  const hasAssets = Boolean(brandSystem?.assets?.length || brandSystem?.starterAssets?.length)

  const strategyItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'vision-mission',
        pillar: 'brand-strategy',
        section: 'Brand Strategy',
        title: 'Vision and Mission',
        minTier: 'free',
        confidence: computeConfidence(mode, Boolean(strategy?.brandCore?.mission), true),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          vision: strategy?.brandCore?.vision || '',
          mission: strategy?.brandCore?.mission || '',
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'brand-values',
        pillar: 'brand-strategy',
        section: 'Brand Strategy',
        title: 'Brand Values',
        minTier: 'free',
        confidence: computeConfidence(mode, Boolean(brandSystem?.values?.length), true),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          values: brandSystem?.values || [],
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'brand-personality',
        pillar: 'brand-strategy',
        section: 'Brand Strategy',
        title: 'Brand Personality',
        minTier: 'free',
        confidence: computeConfidence(mode, Boolean(brandSystem?.brandPersonality), true),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          personality: brandSystem?.brandPersonality || '',
          tone: brandSystem?.brandTone || strategy?.messaging?.elevatorPitch || '',
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'brand-story',
        pillar: 'brand-strategy',
        section: 'Brand Strategy',
        title: 'Brand Story',
        minTier: 'pro',
        confidence: computeConfidence(mode, Boolean(strategy?.messaging?.elevatorPitch), true),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          story:
            strategy?.messaging?.elevatorPitch ||
            strategy?.brandCore?.oneLiner ||
            analysis?.text?.metaDescription ||
            '',
        },
      },
      tier
    ),
  ]

  const identityItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'brand-identity',
        pillar: 'brand-identity',
        section: 'Brand Identity',
        title: 'Brand Identity',
        minTier: 'free',
        confidence: computeConfidence(mode, hasLogo || hasColors),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: {
          brandName,
          logoCount:
            (brandSystem?.logos?.icon?.length || 0) +
            (brandSystem?.logos?.horizontal?.length || 0) +
            (brandSystem?.logos?.badge?.length || 0) +
            (brandSystem?.logos?.symbol?.length || 0),
          colorSystem: brandSystem?.colors || null,
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'identity-concept',
        pillar: 'brand-identity',
        section: 'Brand Identity',
        title: 'Identity Concept',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasStrategy),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          concept:
            strategy?.positioning?.uniqueValue ||
            strategy?.positioning?.statement ||
            'Identity concept draft based on available brand signals.',
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'logo-construction',
        pillar: 'brand-identity',
        section: 'Brand Identity',
        title: 'Logo Construction',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasLogo),
        source: hasLogo ? ['ai_inferred', mode] : ['ai_inferred'],
        needsReview: true,
        data: {
          notes:
            hasLogo
              ? 'Generated logo set available. Construction grid/spec requires design review.'
              : 'No logo asset found. Provide logo upload or generate logos first.',
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'identity-system',
        pillar: 'brand-identity',
        section: 'Brand Identity',
        title: 'Identity System',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasColors && hasTypography),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: {
          colors: brandSystem?.colors || null,
          typography: brandSystem?.typography || null,
          voice: brandSystem?.voice || null,
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'logo-colour-variants',
        pillar: 'brand-identity',
        section: 'Brand Identity',
        title: 'Logo Colour Variants',
        minTier: 'enterprise',
        confidence: computeConfidence(mode, hasLogo),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          variants: {
            icon: brandSystem?.logos?.icon || [],
            horizontal: brandSystem?.logos?.horizontal || [],
            badge: brandSystem?.logos?.badge || [],
            symbol: brandSystem?.logos?.symbol || [],
          },
        },
      },
      tier
    ),
  ]

  const guidelineItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'logo-clear-space',
        pillar: 'identity-guidelines',
        section: 'Identity Guidelines',
        title: 'Logo Clear Space',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasLogo),
        source: ['ai_inferred'],
        needsReview: true,
        data: { rule: 'Use clear space equal to 0.5x logo height on all sides.' },
      },
      tier
    ),
    makeItem(
      {
        id: 'size-and-scale',
        pillar: 'identity-guidelines',
        section: 'Identity Guidelines',
        title: 'Size and Scale',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasLogo),
        source: ['ai_inferred'],
        needsReview: true,
        data: { minDigitalPx: 24, minPrintMm: 10 },
      },
      tier
    ),
    makeItem(
      {
        id: 'logo-dos',
        pillar: 'identity-guidelines',
        section: 'Identity Guidelines',
        title: 'Logo Dos',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasLogo),
        source: ['ai_inferred'],
        needsReview: false,
        data: {
          list: ['Use approved color variants', 'Maintain clear space', 'Keep aspect ratio locked'],
        },
      },
      tier
    ),
    makeItem(
      {
        id: 'logo-donts',
        pillar: 'identity-guidelines',
        section: 'Identity Guidelines',
        title: "Logo Don'ts",
        minTier: 'pro',
        confidence: computeConfidence(mode, hasLogo),
        source: ['ai_inferred'],
        needsReview: false,
        data: {
          list: ['Do not stretch or skew', 'Do not recolor arbitrarily', 'Do not place on low-contrast backgrounds'],
        },
      },
      tier
    ),
  ]

  const colorItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'primary-colours',
        pillar: 'colour-guidelines',
        section: 'Colour Guidelines',
        title: 'Primary Colours',
        minTier: 'free',
        confidence: computeConfidence(mode, hasColors),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: { primary: brandSystem?.colors?.primary || brandSystem?.primaryColors || [] },
      },
      tier
    ),
    makeItem(
      {
        id: 'secondary-colours',
        pillar: 'colour-guidelines',
        section: 'Colour Guidelines',
        title: 'Secondary Colours',
        minTier: 'free',
        confidence: computeConfidence(mode, hasColors),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: { secondary: brandSystem?.colors?.secondary || brandSystem?.secondaryColors || [] },
      },
      tier
    ),
    makeItem(
      {
        id: 'colour-usage',
        pillar: 'colour-guidelines',
        section: 'Colour Guidelines',
        title: 'Colour Usage',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasColors),
        source: ['ai_inferred'],
        needsReview: true,
        data: {
          rules: ['60-30-10 distribution', 'Use neutral backgrounds for readability', 'Preserve contrast for accessibility'],
        },
      },
      tier
    ),
  ]

  const typographyItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'typography',
        pillar: 'typography-guidelines',
        section: 'Typography Guidelines',
        title: 'Typography',
        minTier: 'free',
        confidence: computeConfidence(mode, hasTypography),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: { typography: brandSystem?.typography || null },
      },
      tier
    ),
    makeItem(
      {
        id: 'typography-application',
        pillar: 'typography-guidelines',
        section: 'Typography Guidelines',
        title: 'Typography Application',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasTypography),
        source: ['ai_inferred'],
        needsReview: true,
        data: {
          applications: ['H1/H2 hierarchy', 'Body copy readability', 'CTA emphasis styles'],
        },
      },
      tier
    ),
  ]

  const designLanguageItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'brand-pattern',
        pillar: 'design-language',
        section: 'Design Language',
        title: 'Brand Pattern',
        minTier: 'enterprise',
        confidence: computeConfidence(mode, Boolean(brandSystem?.moodboard?.length)),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: { moodboard: brandSystem?.moodboard || [] },
      },
      tier
    ),
  ]

  const keyMessageItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'key-messages',
        pillar: 'key-messages',
        section: 'Key Messages',
        title: 'Key Messages',
        minTier: 'free',
        confidence: computeConfidence(mode, Boolean(strategy?.messaging?.pillars?.length), true),
        source: ['ai_inferred', mode],
        needsReview: true,
        data: {
          pillars: strategy?.messaging?.pillars || [],
          taglineOptions: strategy?.messaging?.taglineOptions || [],
        },
      },
      tier
    ),
  ]

  const layoutItems: BlueprintItem[] = [
    makeItem(
      {
        id: 'creatives',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Creatives',
        minTier: 'free',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: { assets: brandSystem?.starterAssets || brandSystem?.assets || [] },
      },
      tier
    ),
    makeItem(
      {
        id: 'office-applications',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Office Applications',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred'],
        needsReview: true,
        data: { templates: ['Letterhead', 'Presentation Deck', 'Doc Cover'] },
      },
      tier
    ),
    makeItem(
      {
        id: 'stationery',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Stationery',
        minTier: 'pro',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred'],
        needsReview: true,
        data: { templates: ['Business Card', 'Envelope', 'Invoice'] },
      },
      tier
    ),
    makeItem(
      {
        id: 'signage',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Signage',
        minTier: 'enterprise',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred'],
        needsReview: true,
        data: { templates: ['Storefront', 'Roll-up Banner', 'Event Backdrop'] },
      },
      tier
    ),
    makeItem(
      {
        id: 'print-applications',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Print Applications',
        minTier: 'enterprise',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred'],
        needsReview: true,
        data: { templates: ['Brochure', 'Poster', 'Flyer'] },
      },
      tier
    ),
    makeItem(
      {
        id: 'digital-applications',
        pillar: 'layouts',
        section: 'Layouts',
        title: 'Digital Applications',
        minTier: 'free',
        confidence: computeConfidence(mode, hasAssets),
        source: ['ai_inferred', mode],
        needsReview: false,
        data: { templates: ['Social Posts', 'Website Hero', 'Ad Creatives'] },
      },
      tier
    ),
  ]

  return {
    meta: {
      mode,
      tier,
      generatedAt: new Date().toISOString(),
    },
    pillars: [
      { key: 'brand-strategy', title: 'Brand Strategy', items: strategyItems },
      { key: 'brand-identity', title: 'Brand Identity', items: identityItems },
      { key: 'identity-guidelines', title: 'Identity Guidelines', items: guidelineItems },
      { key: 'colour-guidelines', title: 'Colour Guidelines', items: colorItems },
      { key: 'typography-guidelines', title: 'Typography Guidelines', items: typographyItems },
      { key: 'design-language', title: 'Design Language', items: designLanguageItems },
      { key: 'key-messages', title: 'Key Messages', items: keyMessageItems },
      { key: 'layouts', title: 'Layouts', items: layoutItems },
    ],
  }
}
