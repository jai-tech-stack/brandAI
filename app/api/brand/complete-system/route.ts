import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrandWithAI } from '@/lib/aiService'
import { generateImageWithAI, enhancePromptWithAI } from '@/lib/aiService'

// Enhanced brand extraction with complete system
async function extractCompleteBrandSystem(url: string) {
  // Normalize URL
  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  const validUrl = new URL(normalizedUrl)
  const baseUrl = validUrl.origin

  // Try to use Playwright for accurate color extraction
  let html = ''
  let extractedColors: string[] = []
  
  try {
    // Don't try to load playwright during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      throw new Error('Build phase - skipping Playwright')
    }
    
    // Check if Playwright is available
    // Using dynamic require to prevent webpack from trying to resolve it at build time
    const requirePlaywright = new Function('moduleName', 'return require(moduleName)')
    const playwright = requirePlaywright('playwright')
    if (!playwright) {
      throw new Error('Playwright not available')
    }
    const browser = await playwright.chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    const page = await context.newPage()
    
    await page.goto(validUrl.toString(), { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000) // Wait for dynamic content
    
    html = await page.content()
    
    // Extract colors from computed styles of visible elements
    const colorData = await page.evaluate(() => {
      const colors = new Set<string>()
      const colorFrequency = new Map<string, number>()
      
      // Get all visible elements
      const elements = document.querySelectorAll('*')
      
      elements.forEach((el: Element) => {
        const computed = window.getComputedStyle(el as HTMLElement)
        const bgColor = computed.backgroundColor
        const textColor = computed.color
        const borderColor = computed.borderColor
        
        // Convert rgb/rgba to hex
        const toHex = (color: string): string | null => {
          if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null
          
          const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
            const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
            const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
            return `#${r}${g}${b}`.toUpperCase()
          }
          return null
        }
        
        [bgColor, textColor, borderColor].forEach(color => {
          const hex = toHex(color)
          if (hex && hex !== '#FFFFFF' && hex !== '#000000' && hex !== '#FFF' && hex !== '#000') {
            colors.add(hex)
            colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 1)
          }
        })
      })
      
      // Sort by frequency and return top colors
      return Array.from(colorFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .filter(color => {
          // Filter out very light/dark grays
          const hex = color.replace('#', '')
          if (hex.length < 6) return true
          const r = parseInt(hex.substring(0, 2), 16)
          const g = parseInt(hex.substring(2, 4), 16)
          const b = parseInt(hex.substring(4, 6), 16)
          const brightness = (r + g + b) / 3
          const saturation = Math.max(r, g, b) - Math.min(r, g, b)
          return brightness > 30 && brightness < 230 && saturation > 20
        })
    })
    
    extractedColors = colorData.slice(0, 8)
    
    await browser.close()
  } catch (playwrightError) {
    // Fallback to fetch-based extraction
    console.warn('Playwright not available, using fetch fallback:', playwrightError)
    
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }

    html = await response.text()

    // Extract colors from CSS
    const colorRegex = /(?:color|background-color|background|border-color):\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/gi
    const colorMatches = html.match(colorRegex) || []
    const colorSet = new Set<string>()
    
    colorMatches.forEach(match => {
      const colorMatch = match.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/)
      if (colorMatch) {
        let color = colorMatch[1]
        if (color.startsWith('#')) {
          if (color.length === 4) {
            color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
          }
          colorSet.add(color.toUpperCase())
        } else if (color.startsWith('rgb')) {
          const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
            const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
            const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
            colorSet.add(`#${r}${g}${b}`.toUpperCase())
          }
        }
      }
    })

    extractedColors = Array.from(colorSet).slice(0, 8)
  }

  // Ensure we have at least some colors
  if (extractedColors.length === 0) {
    extractedColors = ['#4285F4', '#34A853', '#FBBC04', '#EA4335'] // Google colors as fallback
  }

  const primaryColors = extractedColors.slice(0, 2)
  const secondaryColors = extractedColors.slice(2, 4)

  // Extract fonts
  const fonts: string[] = []
  const fontRegex = /font-family:\s*([^;]+)/gi
  const fontMatches = html.match(fontRegex) || []
  const fontSet = new Set<string>()

  fontMatches.forEach(match => {
    const fontMatch = match.match(/font-family:\s*(.+)/i)
    if (fontMatch) {
      const fontFamilies = fontMatch[1].split(',').map(f => f.trim().replace(/['"]/g, ''))
      fontFamilies.forEach(font => {
        if (font && !font.match(/^(sans-serif|serif|monospace|system-ui)$/i)) {
          fontSet.add(font)
        }
      })
    }
  })

  // Google Fonts
  const googleFontRegex = /fonts\.googleapis\.com\/css\?family=([^&"']+)/gi
  const googleFontMatch = html.match(googleFontRegex)
  if (googleFontMatch) {
    const googleFonts = googleFontMatch[0].split('family=')[1]?.split('&')[0]?.split('|') || []
    googleFonts.forEach(font => {
      const fontName = font.split(':')[0].replace(/\+/g, ' ').trim()
      if (fontName) fontSet.add(fontName)
    })
  }

  const extractedFonts = Array.from(fontSet).slice(0, 3)
  const primaryFont = extractedFonts[0] || 'System Font'
  const secondaryFont = extractedFonts[1] || 'Sans-serif'

  // Extract logo
  const logoRegex = /<img[^>]*(?:logo|brand)[^>]*src=["']([^"']+)["']/i
  const logoMatch = html.match(logoRegex)
  let logoUrl: string | null = null
  if (logoMatch) {
    logoUrl = logoMatch[1]
    if (!logoUrl.startsWith('http')) {
      logoUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`
    }
  }

  // AI Analysis
  const aiAnalysis = await analyzeBrandWithAI(html, extractedColors, extractedFonts)

  return {
    logo: logoUrl,
    primaryColors,
    secondaryColors,
    allColors: extractedColors,
    primaryFont,
    secondaryFont,
    typographyPairings: [primaryFont, secondaryFont],
    style: aiAnalysis.style,
    brandPersonality: aiAnalysis.brandPersonality,
    brandTone: aiAnalysis.brandPersonality,
    messaging: aiAnalysis.recommendations,
    sourceUrl: validUrl.toString(),
  }
}

// Generate all brand assets
async function generateAllBrandAssets(brandSystem: any) {
  const assets: any[] = []

  // 1. Logo alternatives
  const logoPrompts = [
    `Create a modern logo alternative for ${brandSystem.sourceUrl} using colors ${brandSystem.primaryColors.join(', ')}`,
    `Design a minimalist logo variation for ${brandSystem.sourceUrl} with ${brandSystem.style} style`,
    `Generate a creative logo concept for ${brandSystem.sourceUrl} using typography ${brandSystem.primaryFont}`,
  ]

  for (const prompt of logoPrompts.slice(0, 2)) {
    try {
      const enhanced = await enhancePromptWithAI(prompt, {
        colors: brandSystem.allColors,
        typography: [brandSystem.primaryFont, brandSystem.secondaryFont],
        style: brandSystem.style,
      })
      const result = await generateImageWithAI({
        prompt: enhanced,
        brandColors: brandSystem.allColors,
        style: brandSystem.style,
        size: '1024x1024',
      })
      assets.push({
        type: 'logo-alternative',
        name: `Logo Alternative ${assets.filter(a => a.type === 'logo-alternative').length + 1}`,
        imageUrl: result.imageUrl,
        prompt: enhanced,
      })
    } catch (e) {
      console.error('Logo generation failed:', e)
    }
  }

  // 2. Social media templates
  const socialPrompts = [
    `Create a social media banner template for ${brandSystem.sourceUrl} using brand colors ${brandSystem.primaryColors.join(', ')} and ${brandSystem.style} style`,
    `Design an Instagram post template for ${brandSystem.sourceUrl} with ${brandSystem.primaryFont} typography`,
    `Generate a Twitter header template for ${brandSystem.sourceUrl} using ${brandSystem.style} aesthetic`,
  ]

  for (const prompt of socialPrompts.slice(0, 2)) {
    try {
      const enhanced = await enhancePromptWithAI(prompt, {
        colors: brandSystem.allColors,
        typography: [brandSystem.primaryFont],
        style: brandSystem.style,
      })
      const result = await generateImageWithAI({
        prompt: enhanced,
        brandColors: brandSystem.allColors,
        style: brandSystem.style,
        size: '1792x1024',
      })
      assets.push({
        type: 'social-template',
        name: `Social Template ${assets.filter(a => a.type === 'social-template').length + 1}`,
        imageUrl: result.imageUrl,
        prompt: enhanced,
      })
    } catch (e) {
      console.error('Social template generation failed:', e)
    }
  }

  // 3. Banner & ad templates
  const bannerPrompts = [
    `Create a web banner ad template for ${brandSystem.sourceUrl} using ${brandSystem.primaryColors.join(', ')} colors`,
    `Design a marketing banner template for ${brandSystem.sourceUrl} with ${brandSystem.style} style`,
  ]

  for (const prompt of bannerPrompts.slice(0, 1)) {
    try {
      const enhanced = await enhancePromptWithAI(prompt, {
        colors: brandSystem.allColors,
        typography: [brandSystem.primaryFont],
        style: brandSystem.style,
      })
      const result = await generateImageWithAI({
        prompt: enhanced,
        brandColors: brandSystem.allColors,
        style: brandSystem.style,
        size: '1792x1024',
      })
      assets.push({
        type: 'banner-template',
        name: 'Banner Template',
        imageUrl: result.imageUrl,
        prompt: enhanced,
      })
    } catch (e) {
      console.error('Banner generation failed:', e)
    }
  }

  // 4. Visual moodboard
  try {
    const moodboardPrompt = `Create a visual moodboard for ${brandSystem.sourceUrl} showing ${brandSystem.style} style, using colors ${brandSystem.allColors.join(', ')}, typography ${brandSystem.primaryFont}, showing brand aesthetic, textures, patterns, and visual elements`
    const enhanced = await enhancePromptWithAI(moodboardPrompt, {
      colors: brandSystem.allColors,
      typography: [brandSystem.primaryFont],
      style: brandSystem.style,
    })
    const result = await generateImageWithAI({
      prompt: enhanced,
      brandColors: brandSystem.allColors,
      style: brandSystem.style,
      size: '1024x1024',
    })
    assets.push({
      type: 'moodboard',
      name: 'Visual Moodboard',
      imageUrl: result.imageUrl,
      prompt: enhanced,
    })
  } catch (e) {
    console.error('Moodboard generation failed:', e)
  }

  // 5. Pitch-deck visual kit
  try {
    const pitchDeckPrompt = `Create a professional pitch-deck slide template for ${brandSystem.sourceUrl} using ${brandSystem.primaryColors.join(', ')} colors, ${brandSystem.primaryFont} typography, ${brandSystem.style} style, modern and professional design`
    const enhanced = await enhancePromptWithAI(pitchDeckPrompt, {
      colors: brandSystem.allColors,
      typography: [brandSystem.primaryFont],
      style: brandSystem.style,
    })
    const result = await generateImageWithAI({
      prompt: enhanced,
      brandColors: brandSystem.allColors,
      style: brandSystem.style,
      size: '1792x1024',
    })
    assets.push({
      type: 'pitch-deck',
      name: 'Pitch Deck Template',
      imageUrl: result.imageUrl,
      prompt: enhanced,
    })
  } catch (e) {
    console.error('Pitch deck generation failed:', e)
  }

  return assets
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Step 1: Extract complete brand system
    const brandSystem = await extractCompleteBrandSystem(url)

    // Step 2: Generate all brand assets
    const assets = await generateAllBrandAssets(brandSystem)

    const completeSystem = {
      ...brandSystem,
      assets,
      generatedAt: new Date().toISOString(),
      aiPowered: true,
      autonomous: true,
    }

    return NextResponse.json({ success: true, data: completeSystem })
  } catch (error: any) {
    console.error('Complete brand system generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate complete brand system' },
      { status: 500 }
    )
  }
}

