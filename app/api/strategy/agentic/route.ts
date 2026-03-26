import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { WebsiteAnalysis } from '@/lib/analyzer/extractorTypes'
import { runBrandStrategistFlow } from '@/lib/agents/brandStrategistFlow'

const strategistSchema = z.object({
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
  businessContext: z
    .object({
      offer: z.string().optional(),
      goals: z.array(z.string()).optional(),
      targetMarket: z.string().optional(),
      differentiators: z.array(z.string()).optional(),
      constraints: z.array(z.string()).optional(),
    })
    .optional(),
  includeProcess: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysis, businessContext, includeProcess } = strategistSchema.parse(body)

    const result = await runBrandStrategistFlow({
      analysis: analysis as WebsiteAnalysis,
      businessContext,
    })

    return NextResponse.json({
      success: true,
      data: result.deliverable,
      ...(includeProcess ? { process: result.process } : {}),
    })
  } catch (err: unknown) {
    console.error('Agentic strategist flow error:', err)

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Failed to run strategist flow',
      },
      { status: 500 }
    )
  }
}
