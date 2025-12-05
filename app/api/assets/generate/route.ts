import { NextRequest, NextResponse } from 'next/server'
import { getBrandKitById } from '@/lib/brandKitsStorage'
import { generateImageWithAI, enhancePromptWithAI } from '@/lib/aiService'

export async function POST(request: NextRequest) {
  try {
    const { prompt, brandId } = await request.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      )
    }

    // Fetch brand kit data from shared storage
    const brandKit = getBrandKitById(brandId)
    
    if (!brandKit) {
      return NextResponse.json(
        { error: `Brand kit with ID "${brandId}" not found. Please extract and save a brand first, or select a valid brand from Brand Kits.` },
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
  } catch (error: any) {
    console.error('Asset generation error:', error)
    
    // Provide helpful error message
    let errorMessage = 'Failed to generate asset. '
    if (error.message?.includes('No AI image generation service')) {
      errorMessage += 'Please configure an AI service (OPENAI_API_KEY, STABILITY_API_KEY, or REPLICATE_API_TOKEN) in your environment variables.'
    } else {
      errorMessage += error.message || 'Please try again.'
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
