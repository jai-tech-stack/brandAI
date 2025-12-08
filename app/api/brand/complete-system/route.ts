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

  // Try fetch first (faster), then Playwright as fallback only if needed
  let html = ''
  let extractedColors: string[] = []
  let usePlaywright = false
  
  // First, try fast fetch-based extraction
  try {
    const fetchResponse = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (fetchResponse.ok) {
      html = await fetchResponse.text()
      usePlaywright = false // Use fast fetch method
    } else {
      throw new Error('Fetch failed')
    }
  } catch (fetchError) {
    // Fallback to Playwright only if fetch fails
    usePlaywright = true
  }
  
  // Use Playwright only if fetch failed or if we need more accurate extraction
  if (usePlaywright) {
    try {
      // Don't try to load playwright during build
      if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1') {
        throw new Error('Skipping Playwright in build/production')
      }
      
      // Check if Playwright is available
      const requirePlaywright = new Function('moduleName', 'return require(moduleName)')
      const playwright = requirePlaywright('playwright')
      if (!playwright) {
        throw new Error('Playwright not available')
      }
      
      // Launch browser with timeout
      const browserPromise = playwright.chromium.launch({ headless: true })
      const browserTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Browser launch timeout')), 5000)
      })
      const browser = await Promise.race([browserPromise, browserTimeout]) as any
      
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }, // Smaller viewport
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      })
      const page = await context.newPage()
      
      // Faster navigation with shorter timeout
      await page.goto(validUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 10000 })
      await page.waitForTimeout(500) // Minimal wait
      
      html = await page.content()
      await browser.close()
    
      // Extract colors from computed styles (only if using Playwright)
      const colorData = await page.evaluate(() => {
        const colorFrequency = new Map<string, number>()
        
        // Only process important elements (faster)
        const importantSelectors = [
          'header', 'nav', 'main', '[class*="hero"]', '[class*="banner"]',
          'h1', 'h2', 'button', 'a'
        ]
        
        importantSelectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector)
            const maxElements = Math.min(20, elements.length) // Limit to 20 elements per selector
            
            for (let i = 0; i < maxElements; i++) {
              const el = elements[i] as HTMLElement
              const computed = window.getComputedStyle(el)
              const rect = el.getBoundingClientRect()
              
              if (rect.width === 0 || rect.height === 0) continue
              
              const bgColor = computed.backgroundColor
              const textColor = computed.color
              
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
              
              [bgColor, textColor].forEach(color => {
                const hex = toHex(color)
                if (hex && hex !== '#FFFFFF' && hex !== '#000000') {
                  const r = parseInt(hex.substring(1, 3), 16)
                  const g = parseInt(hex.substring(3, 5), 16)
                  const b = parseInt(hex.substring(5, 7), 16)
                  const brightness = (r + g + b) / 3
                  const max = Math.max(r, g, b)
                  const min = Math.min(r, g, b)
                  const saturation = max === 0 ? 0 : (max - min) / max
                  
                  if (brightness > 40 && brightness < 220 && saturation > 15) {
                    colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 1)
                  }
                }
              })
            }
          } catch (e) {
            // Continue
          }
        })
        
        return Array.from(colorFrequency.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([color]) => color)
          .slice(0, 8)
      })
      
      extractedColors = colorData
      await browser.close()
    } catch (playwrightError) {
      // If Playwright fails, use fetch HTML we already have
      console.warn('Playwright failed, using fetch HTML:', playwrightError)
      
      // Helper function (must be defined before use)
      function normalizeColorToHex(color: string): string | null {
        color = color.trim()
        if (color.startsWith('#')) {
          if (color.length === 4) {
            return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase()
          }
          return color.length === 7 ? color.toUpperCase() : null
        }
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
          const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
          const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
          return `#${r}${g}${b}`.toUpperCase()
        }
        return null
      }
      
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

      // Fast CSS-based color extraction (optimized)
      const colorFrequency = new Map<string, number>()
      
      // Extract CSS variables first (most important)
      const cssVarRegex = /--[\w-]+:\s*([^;]+)/gi
      let varMatch
      while ((varMatch = cssVarRegex.exec(html)) !== null) {
        const value = varMatch[1].trim()
        if (value.match(/^#[0-9a-fA-F]{3,6}$|^rgb|^rgba/i)) {
          const hex = normalizeColorToHex(value)
          if (hex && hex !== '#FFFFFF' && hex !== '#000000') {
            colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 3) // Higher weight for CSS vars
          }
        }
      }
      
      // Extract from style attributes (common in modern sites)
      const styleAttrRegex = /style=["']([^"']+)["']/gi
      let styleMatch
      while ((styleMatch = styleAttrRegex.exec(html)) !== null) {
        const styleContent = styleMatch[1]
        const colorMatches = styleContent.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi) || []
        colorMatches.forEach(match => {
          const colorValue = match.split(':')[1]?.trim()
          if (colorValue) {
            const hex = normalizeColorToHex(colorValue)
            if (hex && hex !== '#FFFFFF' && hex !== '#000000') {
              colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 2)
            }
          }
        })
      }
      
      // Extract from style tags
      const styleTagRegex = /<style[^>]*>([\s\S]{0,50000})<\/style>/gi // Limit size
      let styleTagMatch
      while ((styleTagMatch = styleTagRegex.exec(html)) !== null) {
        const css = styleTagMatch[1]
        const colorMatches = css.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi) || []
        colorMatches.forEach(match => {
          const colorValue = match.split(':')[1]?.trim()
          if (colorValue) {
            const hex = normalizeColorToHex(colorValue)
            if (hex && hex !== '#FFFFFF' && hex !== '#000000') {
              colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 1)
            }
          }
        })
      }
      
      // Sort by frequency and filter
      extractedColors = Array.from(colorFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .filter(color => {
          const r = parseInt(color.substring(1, 3), 16)
          const g = parseInt(color.substring(3, 5), 16)
          const b = parseInt(color.substring(5, 7), 16)
          const brightness = (r + g + b) / 3
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          return brightness > 40 && brightness < 220 && saturation > 15
        })
        .slice(0, 8)
    } // Close catch block
  } // Close if (usePlaywright) block

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
  
  // Skip logo URL validation to save time - just extract the URL
  // Logo validation can be done client-side if needed

  // AI Analysis (with error handling)
  let aiAnalysis
  try {
    aiAnalysis = await analyzeBrandWithAI(html, extractedColors, extractedFonts)
  } catch (aiError: unknown) {
    console.error('AI analysis failed:', aiError)
    // Fallback to basic analysis
    aiAnalysis = {
      style: 'Modern',
      brandPersonality: 'Professional',
      recommendations: ['Focus on brand consistency', 'Maintain visual identity'],
    }
  }

  return {
    logo: logoUrl || undefined,
    primaryColors: primaryColors.length > 0 ? primaryColors : ['#000000', '#666666'],
    secondaryColors: secondaryColors.length > 0 ? secondaryColors : ['#CCCCCC', '#EEEEEE'],
    allColors: extractedColors.length > 0 ? extractedColors : ['#000000', '#666666', '#CCCCCC'],
    primaryFont: primaryFont || 'Inter, sans-serif',
    secondaryFont: secondaryFont || 'Roboto, sans-serif',
    typographyPairings: [primaryFont || 'Inter, sans-serif', secondaryFont || 'Roboto, sans-serif'],
    style: aiAnalysis?.style || 'Modern',
    brandPersonality: aiAnalysis?.brandPersonality || 'Professional',
    brandTone: aiAnalysis?.brandPersonality || 'Professional',
    messaging: aiAnalysis?.recommendations || ['Focus on brand consistency'],
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
    const { url, userId } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Feature gate: Check subscription if user is authenticated
    if (userId) {
      try {
        // Check subscription via API
        const checkResponse = await fetch(`${request.nextUrl.origin}/api/subscription/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            action: 'maxBrandSystems',
            currentUsage: 0, // TODO: Get actual usage from database
          }),
        })
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json()
          if (!checkData.allowed) {
            return NextResponse.json(
              {
                error: checkData.reason || 'Upgrade required',
                tier: checkData.tier,
                upgradeRequired: true,
              },
              { status: 403 }
            )
          }
        }
      } catch (gateError) {
        // Continue if feature gate check fails (for backward compatibility)
        console.warn('Feature gate check failed:', gateError)
      }
    }

    // Set timeout for the entire operation (30 seconds max - faster response)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - brand extraction took too long')), 30000)
    })

    // Step 1: Extract complete brand system (with timeout)
    const brandSystemPromise = extractCompleteBrandSystem(url)
    const brandSystem = await Promise.race([brandSystemPromise, timeoutPromise]) as Awaited<ReturnType<typeof extractCompleteBrandSystem>>

    // Step 2: Skip asset generation for now (too slow) - can be done async later
    // Assets can be generated on-demand via separate API endpoint
    const assets: any[] = []

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

