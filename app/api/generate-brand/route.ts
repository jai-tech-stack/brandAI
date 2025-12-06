import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { WebsiteAnalysis } from '@/lib/analyzer/extractorTypes'
import { generateBrandSystem } from '@/lib/generators/generateBrandSystem'

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
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysis } = generateBrandSchema.parse(body)

    // Generate brand system
    const brandSystem = await generateBrandSystem(analysis as WebsiteAnalysis)

    return NextResponse.json({
      success: true,
      data: brandSystem,
    })
  } catch (error: any) {
    console.error('Brand system generation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate brand system' },
      { status: 500 }
    )
  }
}

