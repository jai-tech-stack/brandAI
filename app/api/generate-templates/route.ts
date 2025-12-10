import { NextRequest, NextResponse } from 'next/server'
import type { TemplateConfig } from '@/lib/templates/templateTypes'
import { TEMPLATE_SIZES } from '@/lib/templates/templateTypes'

// Mark route as fully dynamic to prevent Vercel build errors
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function POST(request: NextRequest) {
  // Prevent static analysis during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json(
      { error: 'This route is not available during build' },
      { status: 503 }
    )
  }

  try {
    // Dynamic imports to prevent build-time execution
    const { z } = await import('zod')
    const { generateInstagramTemplate } = await import('@/lib/templates/instagram')
    const { generateLinkedInTemplate } = await import('@/lib/templates/linkedin')
    const { generateTwitterTemplate } = await import('@/lib/templates/twitter')
    const { generateYouTubeTemplate } = await import('@/lib/templates/youtube')
    const { generateHeroBannerTemplate } = await import('@/lib/templates/heroBanner')
    const { generateTikTokTemplate } = await import('@/lib/templates/tiktok')
    const { generateInstagramStoryTemplate } = await import('@/lib/templates/instagramStory')
    const { generateInstagramReelTemplate } = await import('@/lib/templates/instagramReel')
    const { generatePinterestTemplate } = await import('@/lib/templates/pinterest')
    const { generateFacebookTemplate } = await import('@/lib/templates/facebook')

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
      types: z.array(z.enum(['instagram', 'linkedin', 'twitter', 'youtube', 'heroBanner', 'tiktok', 'instagramStory', 'instagramReel', 'pinterest', 'facebook'])).optional(),
    })

    const body = await request.json()
    const { brandSystem, logoUrl, types } = generateTemplatesSchema.parse(body)

    const templateTypes = types || ['instagram', 'linkedin', 'twitter', 'youtube', 'heroBanner', 'tiktok', 'instagramStory', 'instagramReel', 'pinterest', 'facebook']
    const templates: any[] = []

    // Generate each template type
    for (const type of templateTypes) {
      try {
        // Get template size for this type
        const size = TEMPLATE_SIZES[type as keyof typeof TEMPLATE_SIZES]
        if (!size) {
          console.warn(`Unknown template type: ${type}`)
          continue
        }
        
        // Create config with required width and height
        const config: TemplateConfig = {
          width: size.width,
          height: size.height,
          backgroundColor: brandSystem.colors.primary[0] || '#FFFFFF',
          primaryColor: brandSystem.colors.primary[0] || '#000000',
          secondaryColor: brandSystem.colors.secondary[0] || '#666666',
          text: brandSystem.voice.tagline,
          logoUrl,
        }

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
          case 'tiktok':
            result = await generateTikTokTemplate(config)
            break
          case 'instagramStory':
            result = await generateInstagramStoryTemplate(config)
            break
          case 'instagramReel':
            result = await generateInstagramReelTemplate(config)
            break
          case 'pinterest':
            result = await generatePinterestTemplate(config)
            break
          case 'facebook':
            result = await generateFacebookTemplate(config)
            break
          default:
            console.warn(`Unhandled template type: ${type}`)
            continue
        }
        templates.push(result)
      } catch (error: unknown) {
        console.error(`Failed to generate ${type} template:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        templates,
      },
    })
  } catch (error: unknown) {
    console.error('Template generation error:', error)

    // Dynamic import for error handling
    const { z } = await import('zod')
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate templates'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

