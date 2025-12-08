import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrandWithAI } from '@/lib/aiService'
import { generateImageWithAI, enhancePromptWithAI } from '@/lib/aiService'

// Mark route as dynamic to prevent static analysis during build
export const dynamic = 'force-dynamic'

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
    
    await page.goto(validUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1000) // Reduced wait time
    
    html = await page.content()
    
    // Extract colors from computed styles of visible elements with better accuracy
    const colorData = await page.evaluate(() => {
      const colorFrequency = new Map<string, number>()
      const elementTypes = new Map<string, Set<string>>()
      
      // Get all visible elements, prioritizing important ones
      const importantSelectors = [
        'header', 'nav', 'main', 'section', 'article',
        '[class*="hero"]', '[class*="banner"]', '[class*="header"]',
        '[class*="brand"]', '[class*="logo"]', '[id*="hero"]',
        'h1', 'h2', 'h3', 'button', 'a', '[role="button"]'
      ]
      
      // First, get colors from important elements
      importantSelectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach((el: Element) => {
            const computed = window.getComputedStyle(el as HTMLElement)
            const rect = (el as HTMLElement).getBoundingClientRect()
            
            // Only process visible elements
            if (rect.width === 0 || rect.height === 0) return
            
            const bgColor = computed.backgroundColor
            const textColor = computed.color
            const borderColor = computed.borderColor
            
            // Convert rgb/rgba to hex
            const toHex = (color: string): string | null => {
              if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null
              
              const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
              if (rgbMatch) {
                const r = parseInt(rgbMatch[1])
                const g = parseInt(rgbMatch[2])
                const b = parseInt(rgbMatch[3])
                const a = rgbMatch[0].includes('rgba') ? parseFloat(color.match(/,\s*([\d.]+)\)/)?.[1] || '1') : 1
                
                // Skip transparent colors
                if (a < 0.1) return null
                
                const rHex = r.toString(16).padStart(2, '0')
                const gHex = g.toString(16).padStart(2, '0')
                const bHex = b.toString(16).padStart(2, '0')
                return `#${rHex}${gHex}${bHex}`.toUpperCase()
              }
              return null
            }
            
            // Process colors with higher weight for important elements
            const weight = selector.includes('hero') || selector.includes('banner') || selector.includes('brand') ? 3 : 1
            
            [bgColor, textColor, borderColor].forEach(color => {
              const hex = toHex(color)
              if (hex) {
                const r = parseInt(hex.substring(1, 3), 16)
                const g = parseInt(hex.substring(3, 5), 16)
                const b = parseInt(hex.substring(5, 7), 16)
                const brightness = (r + g + b) / 3
                const max = Math.max(r, g, b)
                const min = Math.min(r, g, b)
                const saturation = max === 0 ? 0 : (max - min) / max
                
                // Better filtering: exclude pure black/white, very light/dark grays, low saturation
                if (hex !== '#FFFFFF' && hex !== '#000000' && 
                    brightness > 40 && brightness < 220 && 
                    saturation > 15) {
                  colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + weight)
                }
              }
            })
          })
        } catch (e) {
          // Continue if selector fails
        }
      })
      
      // Also sample from all elements for completeness
      const allElements = document.querySelectorAll('*')
      const sampleSize = Math.min(500, allElements.length)
      const step = Math.max(1, Math.floor(allElements.length / sampleSize))
      
      for (let i = 0; i < allElements.length; i += step) {
        const el = allElements[i] as HTMLElement
        const computed = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        
        if (rect.width === 0 || rect.height === 0) continue
        
        const bgColor = computed.backgroundColor
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
        
        const hex = toHex(bgColor)
        if (hex && hex !== '#FFFFFF' && hex !== '#000000') {
          const r = parseInt(hex.substring(1, 3), 16)
          const g = parseInt(hex.substring(3, 5), 16)
          const b = parseInt(hex.substring(5, 7), 16)
          const brightness = (r + g + b) / 3
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          
          if (brightness > 40 && brightness < 220 && saturation > 15) {
            colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 0.5)
          }
        }
      }
      
      // Sort by frequency and return top colors
      return Array.from(colorFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .slice(0, 12) // Get more colors for better selection
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

  // Only use extracted colors - don't add fake fallbacks
  // If no colors found, it means the extraction failed and we should indicate that
  if (extractedColors.length === 0) {
    console.warn('No colors extracted from website - extraction may have failed')
    // Don't add fake colors - let the frontend handle empty state
  }

  const primaryColors = extractedColors.slice(0, 2)
  const secondaryColors = extractedColors.slice(2, 4)

  // Extract fonts with better accuracy
  const fonts: string[] = []
  const fontSet = new Set<string>()
  const fontFrequency = new Map<string, number>()

  // Extract from CSS (inline styles and style tags)
  const fontRegex = /font-family:\s*([^;]+)/gi
  const fontMatches = html.match(fontRegex) || []

  fontMatches.forEach(match => {
    const fontMatch = match.match(/font-family:\s*(.+)/i)
    if (fontMatch) {
      const fontFamilies = fontMatch[1].split(',').map(f => f.trim().replace(/['"]/g, ''))
      fontFamilies.forEach(font => {
        // Filter out generic fonts
        if (font && !font.match(/^(sans-serif|serif|monospace|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Arial|Helvetica|Times|Courier)$/i)) {
          const cleanFont = font.split(' ')[0] // Take first word (font name)
          if (cleanFont && cleanFont.length > 2) {
            fontSet.add(cleanFont)
            fontFrequency.set(cleanFont, (fontFrequency.get(cleanFont) || 0) + 1)
          }
        }
      })
    }
  })

  // Extract Google Fonts
  const googleFontRegex = /fonts\.googleapis\.com\/css\?family=([^&"']+)/gi
  let googleFontMatch
  while ((googleFontMatch = googleFontRegex.exec(html)) !== null) {
    const fontParam = googleFontMatch[1]
    const fonts = fontParam.split('|')
    fonts.forEach(font => {
      const fontName = font.split(':')[0].replace(/\+/g, ' ').trim()
      if (fontName) {
        fontSet.add(fontName)
        fontFrequency.set(fontName, (fontFrequency.get(fontName) || 0) + 5) // Higher weight for Google Fonts
      }
    })
  }

  // Extract Adobe Fonts
  const adobeFontRegex = /use\.typekit\.net|fonts\.adobe\.com[^"']*family=([^&"']+)/gi
  let adobeMatch
  while ((adobeMatch = adobeFontRegex.exec(html)) !== null) {
    const fontName = adobeMatch[1]?.split('&')[0]?.replace(/\+/g, ' ').trim()
    if (fontName) {
      fontSet.add(fontName)
      fontFrequency.set(fontName, (fontFrequency.get(fontName) || 0) + 5)
    }
  }

  // Sort by frequency and get top fonts
  const extractedFonts = Array.from(fontFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([font]) => font)
    .slice(0, 3)

  const primaryFont = extractedFonts[0] || null
  const secondaryFont = extractedFonts[1] || null

  // Extract logo with better detection
  let logoUrl: string | null = null
  
  // Try multiple logo detection methods
  const logoPatterns = [
    // Pattern 1: img with logo/brand in class/id/alt/src
    /<img[^>]*(?:class|id|alt|src)=["'][^"']*(?:logo|brand)[^"']*["'][^>]*src=["']([^"']+)["']/i,
    // Pattern 2: img in header/nav with logo-related attributes
    /<(?:header|nav)[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*(?:logo|brand|alt=["'][^"']*(?:logo|brand)[^"']*["'])/i,
    // Pattern 3: svg logo
    /<(?:svg|img)[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*(?:src|href|xlink:href)=["']([^"']+)["']/i,
    // Pattern 4: link rel="icon" or apple-touch-icon (favicon as logo)
    /<link[^>]*(?:rel=["'](?:icon|apple-touch-icon|shortcut icon)["']|href=["']([^"']*logo[^"']*)["'])/i,
  ]
  
  for (const pattern of logoPatterns) {
    const match = html.match(pattern)
    if (match) {
      logoUrl = match[1] || match[0]?.match(/src=["']([^"']+)["']/)?.[1] || match[0]?.match(/href=["']([^"']+)["']/)?.[1]
      if (logoUrl) {
        // Normalize URL
        if (!logoUrl.startsWith('http')) {
          logoUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`
        }
        // Validate it's likely an image
        if (logoUrl.match(/\.(png|jpg|jpeg|svg|gif|webp)/i) || logoUrl.includes('logo') || logoUrl.includes('brand')) {
          break
        }
      }
    }
  }
  
  // Fallback: try common logo paths
  if (!logoUrl) {
    const commonPaths = ['/logo.png', '/logo.svg', '/assets/logo.png', '/images/logo.png', '/img/logo.png', '/static/logo.png']
    for (const path of commonPaths) {
      try {
        const testUrl = `${baseUrl}${path}`
        const testResponse = await fetch(testUrl, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
        if (testResponse.ok && testResponse.headers.get('content-type')?.startsWith('image/')) {
          logoUrl = testUrl
          break
        }
      } catch (e) {
        // Continue
      }
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

  // Generate all brand assets (optimized for speed)
async function generateAllBrandAssets(brandSystem: any) {
  const assets: any[] = []

  // Limit asset generation to prevent timeouts - generate only essential assets
  // 1. Logo alternatives (limit to 1)
  const logoPrompts = [
    `Create a modern logo alternative for ${brandSystem.sourceUrl} using colors ${brandSystem.primaryColors.join(', ')}`,
  ]

  for (const prompt of logoPrompts.slice(0, 1)) {
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

  // 2. Social media templates (limit to 1)
  const socialPrompts = [
    `Create a social media banner template for ${brandSystem.sourceUrl} using brand colors ${brandSystem.primaryColors.join(', ')} and ${brandSystem.style} style`,
  ]

  for (const prompt of socialPrompts.slice(0, 1)) {
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

    // Set timeout for the entire operation (50 seconds max for Vercel)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - brand extraction took too long')), 50000)
    })

    // Step 1: Extract complete brand system (with timeout)
    const brandSystemPromise = extractCompleteBrandSystem(url)
    const brandSystem = await Promise.race([brandSystemPromise, timeoutPromise]) as Awaited<ReturnType<typeof extractCompleteBrandSystem>>

    // Step 2: Generate brand assets (optional, non-blocking - return what we have if timeout)
    let assets: any[] = []
    try {
      const assetsPromise = generateAllBrandAssets(brandSystem)
      const assetsTimeout = new Promise((resolve) => {
        setTimeout(() => resolve([]), 40000) // 40 second timeout for assets
      })
      assets = await Promise.race([assetsPromise, assetsTimeout]) as any[]
    } catch (assetError: any) {
      console.warn('Asset generation failed or timed out:', assetError.message)
      // Continue without assets - brand system is more important
    }

    const completeSystem = {
      ...brandSystem,
      assets,
      generatedAt: new Date().toISOString(),
      aiPowered: true,
      autonomous: true,
      note: assets.length === 0 ? 'Brand system extracted successfully. Some assets may still be generating.' : undefined,
    }

    return NextResponse.json({ success: true, data: completeSystem })
  } catch (error: any) {
    console.error('Complete brand system generation error:', error)
    
    // Ensure error response is always JSON
    const errorMessage = error.message || 'Failed to generate complete brand system'
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('Timeout')
    
    return NextResponse.json(
      { 
        error: isTimeout 
          ? 'Brand extraction timed out. The website may be too complex or slow. Please try a simpler website or try again.'
          : errorMessage,
        code: isTimeout ? 'TIMEOUT' : 'EXTRACTION_ERROR'
      },
      { status: isTimeout ? 504 : 500 }
    )
  }
}

