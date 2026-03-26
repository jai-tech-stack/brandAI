import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeWebsite } from '@/lib/analyzer/analyzeWebsite'
import { WebsiteAnalysis } from '@/lib/analyzer/extractorTypes'
import { runBrandStrategistFlow } from '@/lib/agents/brandStrategistFlow'
import { generateBrandSystemAgentic } from '@/lib/agents/brandStrategyAgenticPipeline'
import { saveProject } from '@/lib/storage/supabase'
import { buildBrandBlueprint, UserTier } from '@/lib/branding/brandBlueprint'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const flowiseRunSchema = z.object({
  mode: z.enum(['url', 'social', 'logo']).optional().default('url'),
  url: z.string().optional(),
  social: z
    .object({
      platform: z.enum([
        'instagram',
        'linkedin',
        'twitter',
        'youtube',
        'tiktok',
        'facebook',
        'pinterest',
      ]),
      profileUrl: z.string().optional(),
      handle: z.string().optional(),
      bio: z.string().optional(),
      displayName: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  logo: z
    .object({
      logoUrl: z.string().optional(),
      brandName: z.string().optional(),
      tagline: z.string().optional(),
      primaryColors: z.array(z.string()).optional(),
      secondaryColors: z.array(z.string()).optional(),
      fonts: z.array(z.string()).optional(),
      industry: z.string().optional(),
      description: z.string().optional(),
      targetAudience: z.string().optional(),
    })
    .optional(),
  analysis: z
    .object({
      url: z.string(),
      colors: z.any(),
      fonts: z.any(),
      text: z.any(),
      images: z.any(),
      screenshotUrl: z.string(),
      analyzedAt: z.string(),
      metadata: z.any(),
    })
    .optional(),
  businessContext: z
    .object({
      offer: z.string().optional(),
      goals: z.array(z.string()).optional(),
      targetMarket: z.string().optional(),
      differentiators: z.array(z.string()).optional(),
      constraints: z.array(z.string()).optional(),
    })
    .optional(),
  userId: z.string().optional(),
  tier: z.enum(['free', 'pro', 'enterprise']).optional().default('free'),
  saveToProject: z.boolean().optional().default(false),
  includeProcess: z.boolean().optional().default(true),
})

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`
  }
  return trimmed
}

function websiteAnalysisFromLogoInput(
  logo: NonNullable<z.infer<typeof flowiseRunSchema>['logo']>
): WebsiteAnalysis {
  const primaryColors = logo.primaryColors && logo.primaryColors.length > 0
    ? logo.primaryColors
    : ['#111827', '#4F46E5']
  const secondaryColors = logo.secondaryColors && logo.secondaryColors.length > 0
    ? logo.secondaryColors
    : ['#9333EA', '#22C55E']
  const fontPrimary = logo.fonts?.[0] || 'Inter'
  const fontSecondary = logo.fonts?.[1] || 'Poppins'

  const syntheticUrl = logo.logoUrl || 'https://logo-input.local'
  const heading = logo.brandName || 'Brand'
  const description =
    logo.description ||
    logo.tagline ||
    'AI-generated brand strategy seed from logo-first input.'

  return {
    url: syntheticUrl,
    colors: {
      primary: primaryColors,
      secondary: secondaryColors,
      accent: secondaryColors.slice(0, 2),
      neutral: ['#111111', '#FFFFFF', '#F3F4F6'],
    },
    fonts: {
      primary: fontPrimary,
      secondary: fontSecondary,
      weights: [400, 500, 700],
      fallbacks: ['sans-serif'],
    },
    text: {
      headings: {
        h1: [heading],
        h2: [logo.tagline || 'Brand System'],
        h3: [logo.industry || 'Business'],
      },
      paragraphs: [
        description,
        `Target audience: ${logo.targetAudience || 'General audience'}.`,
      ],
      keywords: [
        ...(logo.industry ? [logo.industry] : []),
        ...(logo.targetAudience ? [logo.targetAudience] : []),
        'branding',
        'strategy',
      ],
      metaDescription: description,
      title: heading,
    },
    images: {
      logos: logo.logoUrl
        ? [
            {
              url: logo.logoUrl,
              alt: `${heading} logo`,
              type: 'logo',
            },
          ]
        : [],
      hero: [],
    },
    screenshotUrl: logo.logoUrl || '',
    analyzedAt: new Date().toISOString(),
    metadata: {
      title: heading,
      description,
      ogImage: logo.logoUrl,
    },
  }
}

export async function POST(request: NextRequest) {
  const runStartedAt = Date.now()

  try {
    const body = await request.json()
    const { mode, url, social, logo, analysis, businessContext, userId, tier, saveToProject, includeProcess } =
      flowiseRunSchema.parse(body)

    if (!url && !analysis && !social && !logo) {
      return NextResponse.json(
        { error: 'Provide one of: url, analysis, social, or logo payload.' },
        { status: 400 }
      )
    }

    const stages: Array<{
      id: string
      status: 'completed' | 'failed'
      durationMs: number
      error?: string
    }> = []

    // 1) Analyze website (or reuse provided analysis)
    let websiteAnalysis: WebsiteAnalysis
    const analysisStartedAt = Date.now()

    try {
      if (analysis) {
        websiteAnalysis = analysis as WebsiteAnalysis
      } else if (mode === 'social') {
        if (!social) {
          return NextResponse.json(
            { error: 'social payload is required for mode=social.' },
            { status: 400 }
          )
        }

        if (social.profileUrl) {
          const normalized = normalizeUrl(social.profileUrl)
          websiteAnalysis = await analyzeWebsite(normalized)
        } else {
          const brandName = social.displayName || social.handle || `${social.platform} brand`
          websiteAnalysis = {
            url: `https://${social.platform}.com/${social.handle || 'profile'}`,
            colors: {
              primary: ['#0A66C2', '#111827'],
              secondary: ['#7C3AED', '#10B981'],
              accent: ['#F59E0B'],
              neutral: ['#111111', '#FFFFFF', '#F3F4F6'],
            },
            fonts: {
              primary: 'Inter',
              secondary: 'Poppins',
              weights: [400, 500, 700],
              fallbacks: ['sans-serif'],
            },
            text: {
              headings: {
                h1: [brandName],
                h2: [social.bio || 'Social-first brand'],
                h3: [social.platform],
              },
              paragraphs: [
                social.bio || 'Social profile-derived brand context.',
                `Platform: ${social.platform}`,
              ],
              keywords: social.keywords || [social.platform, 'social', 'branding'],
              metaDescription: social.bio || `${brandName} on ${social.platform}`,
              title: brandName,
            },
            images: {
              logos: [],
              hero: [],
            },
            screenshotUrl: '',
            analyzedAt: new Date().toISOString(),
            metadata: {
              title: brandName,
              description: social.bio,
            },
          }
        }
      } else if (mode === 'logo') {
        if (!logo) {
          return NextResponse.json(
            { error: 'logo payload is required for mode=logo.' },
            { status: 400 }
          )
        }
        websiteAnalysis = websiteAnalysisFromLogoInput(logo)
      } else {
        const normalized = normalizeUrl(url as string)
        websiteAnalysis = await analyzeWebsite(normalized)
      }

      stages.push({
        id: 'analysis-stage',
        status: 'completed',
        durationMs: Date.now() - analysisStartedAt,
      })
    } catch (error: unknown) {
      stages.push({
        id: 'analysis-stage',
        status: 'failed',
        durationMs: Date.now() - analysisStartedAt,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }

    // 2) Run strategist flow
    const strategistStartedAt = Date.now()
    const strategistResult = await runBrandStrategistFlow({
      analysis: websiteAnalysis,
      businessContext,
    })
    stages.push({
      id: 'strategist-stage',
      status: 'completed',
      durationMs: Date.now() - strategistStartedAt,
    })

    // 3) Run visual brand system flow
    const brandSystemStartedAt = Date.now()
    const brandSystemResult = await generateBrandSystemAgentic(websiteAnalysis)
    stages.push({
      id: 'brand-system-stage',
      status: 'completed',
      durationMs: Date.now() - brandSystemStartedAt,
    })

    const blueprintStartedAt = Date.now()
    const brandBlueprint = buildBrandBlueprint({
      mode,
      tier: tier as UserTier,
      analysis: websiteAnalysis,
      strategy: strategistResult.deliverable,
      brandSystem: brandSystemResult.brandSystem,
    })
    stages.push({
      id: 'blueprint-stage',
      status: 'completed',
      durationMs: Date.now() - blueprintStartedAt,
    })

    // 4) Optional project save
    let projectId: string | null = null
    if (saveToProject && userId) {
      const saveStartedAt = Date.now()
      projectId = await saveProject({
        url: websiteAnalysis.url,
        userId,
        analysis: websiteAnalysis,
        brandSystem: {
          ...brandSystemResult.brandSystem,
          strategy: strategistResult.deliverable,
          blueprint: brandBlueprint,
        },
      })
      stages.push({
        id: 'project-save-stage',
        status: 'completed',
        durationMs: Date.now() - saveStartedAt,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        mode,
        analysis: websiteAnalysis,
        strategy: strategistResult.deliverable,
        brandSystem: brandSystemResult.brandSystem,
        blueprint: brandBlueprint,
        projectId,
      },
      ...(includeProcess
        ? {
            process: {
              completedAt: new Date().toISOString(),
              totalDurationMs: Date.now() - runStartedAt,
              pipeline: stages,
              strategist: strategistResult.process,
              brandSystem: brandSystemResult.process,
            },
          }
        : {}),
    })
  } catch (err: unknown) {
    console.error('Flowise run error:', err)

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to run Flowise pipeline' },
      { status: 500 }
    )
  }
}
