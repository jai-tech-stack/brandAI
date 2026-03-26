import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeWebsite } from '@/lib/analyzer/analyzeWebsite'
import { WebsiteAnalysis } from '@/lib/analyzer/extractorTypes'
import { runBrandStrategistFlow } from '@/lib/agents/brandStrategistFlow'
import { generateBrandSystemAgentic } from '@/lib/agents/brandStrategyAgenticPipeline'
import { saveProject } from '@/lib/storage/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const flowiseRunSchema = z.object({
  url: z.string().optional(),
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

export async function POST(request: NextRequest) {
  const runStartedAt = Date.now()

  try {
    const body = await request.json()
    const { url, analysis, businessContext, userId, saveToProject, includeProcess } =
      flowiseRunSchema.parse(body)

    if (!url && !analysis) {
      return NextResponse.json(
        { error: 'Provide either url or analysis payload.' },
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
        analysis: websiteAnalysis,
        strategy: strategistResult.deliverable,
        brandSystem: brandSystemResult.brandSystem,
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
