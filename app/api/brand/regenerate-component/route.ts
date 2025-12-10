import { NextRequest, NextResponse } from 'next/server'
import { generateImageWithAI, analyzeBrandWithAI } from '@/lib/aiService'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { component, brandSystem, styleVariation } = await request.json()

    if (!component || !brandSystem) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let result: any = {}

    switch (component) {
      case 'logo':
        // Regenerate just logo
        const logoPrompt = `Create a modern logo for brand with colors ${brandSystem.primaryColors.join(', ')}, style: ${styleVariation || brandSystem.style}`
        const logoImage = await generateImageWithAI({
          prompt: logoPrompt,
          brandColors: brandSystem.primaryColors,
          style: styleVariation || brandSystem.style,
          size: '1024x1024',
        })
        result = { logo: logoImage.imageUrl }
        break

      case 'colors':
        // Regenerate color palette (use AI to suggest variations)
        result = { 
          primaryColors: generateColorVariations(brandSystem.primaryColors),
          secondaryColors: generateColorVariations(brandSystem.secondaryColors)
        }
        break

      case 'fonts':
        // Suggest alternative font pairings
        result = {
          primaryFont: suggestAlternativeFont(brandSystem.primaryFont),
          secondaryFont: suggestAlternativeFont(brandSystem.secondaryFont)
        }
        break

      case 'moodboard':
        // Regenerate moodboard
        const moodPrompt = `Visual moodboard for ${styleVariation || brandSystem.style} brand with colors ${brandSystem.primaryColors.join(', ')}`
        const moodImage = await generateImageWithAI({
          prompt: moodPrompt,
          brandColors: brandSystem.primaryColors,
          style: styleVariation || brandSystem.style,
          size: '1024x1024',
        })
        result = { moodboard: [moodImage.imageUrl] }
        break

      default:
        return NextResponse.json({ error: 'Invalid component type' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    console.error('Component regeneration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Regeneration failed' },
      { status: 500 }
    )
  }
}

function generateColorVariations(colors: string[]): string[] {
  // Simple color variation logic (can be enhanced with AI)
  return colors.map(color => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    
    // Slightly adjust hue/saturation
    const adjusted = adjustColor(rgb.r, rgb.g, rgb.b, 0.1)
    return rgbToHex(adjusted.r, adjusted.g, adjusted.b)
  })
}

function suggestAlternativeFont(currentFont: string): string {
  const fontAlternatives: { [key: string]: string[] } = {
    'Inter': ['Roboto', 'Open Sans', 'Lato'],
    'Roboto': ['Inter', 'Montserrat', 'Poppins'],
    'Poppins': ['Raleway', 'Nunito', 'Quicksand'],
  }

  const alternatives = fontAlternatives[currentFont] || ['Inter', 'Roboto']
  return alternatives[Math.floor(Math.random() * alternatives.length)]
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

function adjustColor(r: number, g: number, b: number, factor: number) {
  return {
    r: Math.min(255, Math.max(0, r + (Math.random() - 0.5) * factor * 255)),
    g: Math.min(255, Math.max(0, g + (Math.random() - 0.5) * factor * 255)),
    b: Math.min(255, Math.max(0, b + (Math.random() - 0.5) * factor * 255)),
  }
}