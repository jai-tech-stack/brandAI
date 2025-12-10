import { NextRequest, NextResponse } from 'next/server'

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
    const { getBrandKitById } = await import('@/lib/brandKitsStorage')
    const { generateImageWithAI, enhancePromptWithAI } = await import('@/lib/aiService')

    const { prompt, brandId } = await request.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let brandKit
    
    // Handle different brand ID types
    if (brandId === 'session') {
      // Try to get from request body or use a default
      // This would ideally come from session storage on client side
      return NextResponse.json(
        { error: 'Session brand not available. Please select a saved brand project.' },
        { status: 400 }
      )
    } else if (brandId) {
      // Try to get from database (project ID)
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
      
      if (supabase) {
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('brand_system')
          .eq('id', brandId)
          .single()
        
        if (!projectError && project?.brand_system) {
          // Convert brand system to brand kit format
          const bs = project.brand_system
          brandKit = {
            name: bs.brandName || bs.sourceUrl || 'Brand',
            colors: [...(bs.primaryColors || []), ...(bs.secondaryColors || [])],
            typography: [bs.primaryFont, bs.secondaryFont].filter(Boolean),
            style: bs.style || bs.brandPersonality || 'modern',
          }
        }
      }
      
      // Fallback to brandKitsStorage
      if (!brandKit) {
        brandKit = getBrandKitById(brandId)
      }
    }
    
    if (!brandKit) {
      return NextResponse.json(
        { error: `Brand with ID "${brandId}" not found. Please extract and save a brand first, or select a valid brand project.` },
        { status: 404 }
      )
    }

    // Autonomous AI agent: Enhance prompt with brand constraints
    const enhancedPrompt = await enhancePromptWithAI(prompt.trim(), brandKit)
    
    // Autonomous AI agent: Generate asset using AI
    const aiResult = await generateImageWithAI({
      prompt: enhancedPrompt,
      brandColors: brandKit.colors,
      style: brandKit.style,
      size: '1024x1024',
    })

    const assetData = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      enhancedPrompt,
      brandId,
      brandKit: {
        name: brandKit.name,
        colors: brandKit.colors,
        typography: brandKit.typography,
        style: brandKit.style,
      },
      imageUrl: aiResult.imageUrl,
      generatedAt: new Date().toISOString(),
      aiPowered: true,
      autonomous: true,
      generationMethod: `Autonomous AI agent (${aiResult.provider} - ${aiResult.model})`,
      provider: aiResult.provider,
      model: aiResult.model,
    }

    return NextResponse.json({ success: true, data: assetData })
  } catch (error: unknown) {
    console.error('Asset generation error:', error)
    
    // Provide helpful error message
    let errorMessage = 'Failed to generate asset. '
    const errorMsg = error instanceof Error ? error.message : String(error)
    if (errorMsg.includes('No AI image generation service')) {
      errorMessage += 'Please configure an AI service (OPENAI_API_KEY, STABILITY_API_KEY, or REPLICATE_API_TOKEN) in your environment variables.'
    } else {
      errorMessage += errorMsg || 'Please try again.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
