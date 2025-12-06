import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateInstagramTemplate } from '@/lib/templates/instagram'
import { generateLinkedInTemplate } from '@/lib/templates/linkedin'
import { generateTwitterTemplate } from '@/lib/templates/twitter'
import { generateYouTubeTemplate } from '@/lib/templates/youtube'
import { generateHeroBannerTemplate } from '@/lib/templates/heroBanner'
import { TemplateConfig } from '@/lib/templates/templateTypes'

const generateTemplatesSchema = z.object({
  brandSystem: z.object({
    colors: z.object({
      primary: z.array(z.string()),
      secondary: z.array(z.string()),
    }),
    voice: z.object({
      tagline: z.string(),
    }),
  }),
  logoUrl: z.string().optional(),
  types: z.array(z.enum(['instagram', 'linkedin', 'twitter', 'youtube', 'heroBanner'])).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brandSystem, logoUrl, types } = generateTemplatesSchema.parse(body)

    const templateTypes = types || ['instagram', 'linkedin', 'twitter', 'youtube', 'heroBanner']
    const templates: any[] = []

    const config: TemplateConfig = {
      backgroundColor: brandSystem.colors.primary[0] || '#FFFFFF',
      primaryColor: brandSystem.colors.primary[0] || '#000000',
      secondaryColor: brandSystem.colors.secondary[0] || '#666666',
      text: brandSystem.voice.tagline,
      logoUrl,
    }

    // Generate each template type
    for (const type of templateTypes) {
      try {
        let result
        switch (type) {
          case 'instagram':
            result = await generateInstagramTemplate(config)
            break
          case 'linkedin':
            result = await generateLinkedInTemplate(config)
            break
          case 'twitter':
            result = await generateTwitterTemplate(config)
            break
          case 'youtube':
            result = await generateYouTubeTemplate(config)
            break
          case 'heroBanner':
            result = await generateHeroBannerTemplate(config)
            break
        }
        templates.push(result)
      } catch (error) {
        console.error(`Failed to generate ${type} template:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        templates,
      },
    })
  } catch (error: any) {
    console.error('Template generation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate templates' },
      { status: 500 }
    )
  }
}

