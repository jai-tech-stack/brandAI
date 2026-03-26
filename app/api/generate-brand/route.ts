import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { WebsiteAnalysis } from '@/lib/analyzer/extractorTypes'
import { generateBrandSystemAgentic } from '@/lib/agents/brandStrategyAgenticPipeline'

const generateBrandSchema = z.object({
  analysis: z.object({
    url: z.string(),
    colors: z.any(),
    fonts: z.any(),
    text: z.any(),
    images: z.any(),
    screenshotUrl: z.string(),
    analyzedAt: z.string(),
    metadata: z.any(),
  }),
  includeProcess: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysis, includeProcess } = generateBrandSchema.parse(body)

    // Generate brand system through the agentic orchestration pipeline
    const result = await generateBrandSystemAgentic(analysis as WebsiteAnalysis)

    return NextResponse.json({
      success: true,
      data: result.brandSystem,
      ...(includeProcess ? { process: result.process } : {}),
    })
  } catch (err: unknown) {
    console.error('Brand system generation error:', err)

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.errors },
        { status: 400 }
      )
    }

    const errorMessage = err instanceof Error ? err.message : 'Failed to generate brand system'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

