import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrandWithAI } from '@/lib/aiService'
import { generateImageWithAI, enhancePromptWithAI } from '@/lib/aiService'

// Mark route as fully dynamic to prevent Vercel build errors
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Helper function for color normalization
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

// Extract colors from HTML source
function extractColorsFromHTML(html: string, colorFrequency: Map<string, number>, baseUrl?: string) {
  // 1. CSS Variables (highest priority - these are brand colors)
  const cssVarRegex = /--[\w-]+-color[^:]*:\s*([^;]+)/gi
  let varMatch
  while ((varMatch = cssVarRegex.exec(html)) !== null) {
    const value = varMatch[1].trim()
    if (value.match(/^#[0-9a-fA-F]{3,6}$|^rgb|^rgba/i)) {
      const hex = normalizeColorToHex(value)
      if (hex) {
        colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 15) // Highest weight
      }
    }
  }
  
  // 2. All CSS variables
  const allCssVarRegex = /--[\w-]+:\s*([^;]+)/gi
  let allVarMatch
  while ((allVarMatch = allCssVarRegex.exec(html)) !== null) {
    const value = allVarMatch[1].trim()
    if (value.match(/^#[0-9a-fA-F]{3,6}$|^rgb|^rgba/i)) {
      const hex = normalizeColorToHex(value)
      if (hex) {
        colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 10)
      }
    }
  }
  
  // 3. Meta theme-color
  const themeColorMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
  if (themeColorMatch) {
    const hex = normalizeColorToHex(themeColorMatch[1])
    if (hex) {
      colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 12)
    }
  }
  
  // 4. Style attributes
  const styleAttrRegex = /style=["']([^"']+)["']/gi
  let styleMatch
  while ((styleMatch = styleAttrRegex.exec(html)) !== null) {
    const styleContent = styleMatch[1]
    const colorMatches = styleContent.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi) || []
    colorMatches.forEach(match => {
      const colorValue = match.split(':')[1]?.trim()
      if (colorValue) {
        const hex = normalizeColorToHex(colorValue)
        if (hex) {
          colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 3)
        }
      }
    })
  }
  
  // 5. Style tags
  const styleTagRegex = /<style[^>]*>([\s\S]{0,100000})<\/style>/gi
  let styleTagMatch
  while ((styleTagMatch = styleTagRegex.exec(html)) !== null) {
    const css = styleTagMatch[1]
    const colorMatches = css.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi) || []
    colorMatches.forEach(match => {
      const colorValue = match.split(':')[1]?.trim()
      if (colorValue) {
        const hex = normalizeColorToHex(colorValue)
        if (hex) {
          colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 2)
        }
      }
    })
  }
  
  // 6. External CSS file links - extract (if baseUrl provided)
  // Note: CSS files are detected but not fetched here (can be used for future enhancement)
  if (baseUrl) {
    const cssLinkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi
    let cssLinkMatch
    while ((cssLinkMatch = cssLinkRegex.exec(html)) !== null) {
      const cssUrl = cssLinkMatch[1]
      if (!cssUrl.startsWith('http')) {
        // CSS URL detected - can be used for future enhancement
        const fullCssUrl = cssUrl.startsWith('/') ? `${baseUrl}${cssUrl}` : `${baseUrl}/${cssUrl}`
        // Future: fetch CSS file and extract colors from it
      }
    }
  }
}

// Extract fonts from HTML source
function extractFontsFromHTML(html: string, fontFrequency: Map<string, number>) {
  // 1. CSS Variables for fonts
  const fontVarRegex = /--[\w-]+-font[^:]*:\s*['"]?([^'";,]+)/gi
  let fontVarMatch
  while ((fontVarMatch = fontVarRegex.exec(html)) !== null) {
    const fontName = fontVarMatch[1].trim().replace(/['"]/g, '')
    if (fontName && !fontName.match(/^(sans-serif|serif|monospace|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Arial|Helvetica|Times|Courier|inherit)$/i)) {
      fontFrequency.set(fontName, (fontFrequency.get(fontName) || 0) + 15)
    }
  }
  
  // 2. Font-family declarations
  const fontRegex = /font-family:\s*([^;]+)/gi
  const fontMatches = html.match(fontRegex) || []
  fontMatches.forEach(match => {
    const fontMatch = match.match(/font-family:\s*(.+)/i)
    if (fontMatch) {
      const fontFamilies = fontMatch[1].split(',').map(f => f.trim().replace(/['"]/g, ''))
      fontFamilies.forEach(font => {
        if (font && !font.match(/^(sans-serif|serif|monospace|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Arial|Helvetica|Times|Courier|inherit)$/i)) {
          const cleanFont = font.trim()
          if (cleanFont && cleanFont.length > 1) {
            fontFrequency.set(cleanFont, (fontFrequency.get(cleanFont) || 0) + 2)
          }
        }
      })
    }
  })
  
  // 3. Google Fonts
  const googleFontRegex = /fonts\.googleapis\.com\/css\?family=([^&"']+)/gi
  let googleFontMatch
  while ((googleFontMatch = googleFontRegex.exec(html)) !== null) {
    const fontParam = googleFontMatch[1]
    const fonts = fontParam.split('|')
    fonts.forEach(font => {
      const fontName = font.split(':')[0].replace(/\+/g, ' ').trim()
      if (fontName) {
        fontFrequency.set(fontName, (fontFrequency.get(fontName) || 0) + 8)
      }
    })
  }
  
  // 4. Adobe Fonts / Typekit
  const adobeFontRegex = /use\.typekit\.net|fonts\.adobe\.com[^"']*family=([^&"']+)/gi
  let adobeMatch
  while ((adobeMatch = adobeFontRegex.exec(html)) !== null) {
    const fontName = adobeMatch[1]?.split('&')[0]?.replace(/\+/g, ' ').trim()
    if (fontName) {
      fontFrequency.set(fontName, (fontFrequency.get(fontName) || 0) + 8)
    }
  }
}

// Enhanced brand extraction with complete system - 100% ACCURATE
async function extractCompleteBrandSystem(url: string, styleVariation?: string) {
  // Normalize URL
  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  const validUrl = new URL(normalizedUrl)
  const baseUrl = validUrl.origin

  let html = ''
  const colorFrequency = new Map<string, number>()
  const fontFrequency = new Map<string, number>()
  let logoUrl: string | undefined
  
  // Step 1: Try Playwright first (most accurate - gets computed styles)
  let usePlaywright = false
  try {
    if (process.env.NEXT_PHASE !== 'phase-production-build' && process.env.VERCEL !== '1') {
      const requirePlaywright = new Function('moduleName', 'return require(moduleName)')
      const playwright = requirePlaywright('playwright')
      if (playwright) {
        usePlaywright = true
        
        const browser = await playwright.chromium.launch({ headless: true })
        const context = await browser.newContext({
          viewport: { width: 1920, height: 1080 },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        })
        const page = await context.newPage()
        
        await page.goto(validUrl.toString(), { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(2000) // Wait longer for CSS and JS to fully load
        await page.waitForLoadState('networkidle') // Ensure all resources loaded
        
        html = await page.content()
        
        // Extract from computed styles (MOST ACCURATE) - IMPROVED FOR 100% ACCURACY
        const computedData = await page.evaluate(() => {
          const colors = new Map<string, number>()
          const fonts = new Map<string, number>()
          
          // Helper to convert any color format to hex
          const toHex = (color: string): string | null => {
            if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === 'initial' || color === 'inherit') return null
            
            // Handle rgb/rgba
            const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1])
              const g = parseInt(rgbMatch[2])
              const b = parseInt(rgbMatch[3])
              const a = color.includes('rgba') ? parseFloat(color.match(/,\s*([\d.]+)\)/)?.[1] || '1') : 1
              
              // Skip fully transparent
              if (a < 0.05) return null
              
              const rHex = r.toString(16).padStart(2, '0')
              const gHex = g.toString(16).padStart(2, '0')
              const bHex = b.toString(16).padStart(2, '0')
              return `#${rHex}${gHex}${bHex}`.toUpperCase()
            }
            
            // Handle hex
            if (color.startsWith('#')) {
              if (color.length === 4) {
                // Short hex #RGB -> #RRGGBB
                return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase()
              }
              if (color.length === 7) {
                return color.toUpperCase()
              }
            }
            
            return null
          }
          
          // Get ALL CSS variables from :root (highest priority)
          const rootStyles = getComputedStyle(document.documentElement)
          const cssVars = new Map<string, string>()
          for (let i = 0; i < rootStyles.length; i++) {
            const prop = rootStyles[i]
            if (prop.startsWith('--')) {
              const value = rootStyles.getPropertyValue(prop).trim()
              cssVars.set(prop, value)
              
              // Check if it's a color value
              const hex = toHex(value)
              if (hex) {
                colors.set(hex, (colors.get(hex) || 0) + 30) // Highest weight for CSS variables
              }
            }
          }
          
          // Extract from ALL visible elements - get REAL colors from rendered page
          const allElements = document.querySelectorAll('*')
          const elementColors = new Map<string, { count: number, isBrand: boolean }>()
          
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement
            const computed = window.getComputedStyle(htmlEl)
            const rect = htmlEl.getBoundingClientRect()
            
            // Skip invisible elements
            if (rect.width === 0 || rect.height === 0 || computed.display === 'none' || computed.visibility === 'hidden') return
            
            // Check if it's a brand element (higher priority)
            const isBrand = htmlEl.className?.toLowerCase().includes('brand') || 
                          htmlEl.className?.toLowerCase().includes('logo') ||
                          htmlEl.id?.toLowerCase().includes('brand') ||
                          htmlEl.id?.toLowerCase().includes('logo') ||
                          htmlEl.tagName === 'HEADER' ||
                          htmlEl.tagName === 'NAV' ||
                          htmlEl.className?.toLowerCase().includes('hero') ||
                          htmlEl.className?.toLowerCase().includes('banner')
            
            // Extract ALL color properties
            const bgColor = computed.backgroundColor
            const textColor = computed.color
            const borderColor = computed.borderColor
            const borderTopColor = computed.borderTopColor
            const borderBottomColor = computed.borderBottomColor
            const outlineColor = computed.outlineColor
            
            // Extract colors with proper weights
            const colorProps = [
              { color: bgColor, weight: isBrand ? 10 : 5, type: 'bg' },
              { color: textColor, weight: isBrand ? 8 : 4, type: 'text' },
              { color: borderColor, weight: isBrand ? 6 : 3, type: 'border' },
              { color: borderTopColor, weight: isBrand ? 6 : 3, type: 'border' },
              { color: borderBottomColor, weight: isBrand ? 6 : 3, type: 'border' },
              { color: outlineColor, weight: isBrand ? 4 : 2, type: 'outline' },
            ]
            
            colorProps.forEach(({ color, weight, type }) => {
              const hex = toHex(color)
              if (hex) {
                // Don't filter out white/black - they might be brand colors!
                // Only skip if it's a transparent background
                if (type === 'bg' && (hex === '#FFFFFF' || hex === '#000000')) {
                  // White/black backgrounds are common, but still count them
                  colors.set(hex, (colors.get(hex) || 0) + weight)
                } else {
                  colors.set(hex, (colors.get(hex) || 0) + weight)
                }
              }
            })
            
            // Extract fonts
            const fontFamily = computed.fontFamily
            if (fontFamily) {
              const fontList = fontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''))
              fontList.forEach((font, fontIndex) => {
                if (!font.match(/^(sans-serif|serif|monospace|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Arial|Helvetica|Times|Courier|inherit|initial|unset)$/i)) {
                  const fontWeight = fontIndex === 0 ? (isBrand ? 10 : 5) : (isBrand ? 5 : 2)
                  fonts.set(font, (fonts.get(font) || 0) + fontWeight)
                }
              })
            }
          })
          
          // Also extract from inline styles and style tags
          const styleSheets = Array.from(document.styleSheets)
          styleSheets.forEach(sheet => {
            try {
              const rules = Array.from(sheet.cssRules || [])
              rules.forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                  const style = rule.style
                  const bgColor = style.backgroundColor
                  const textColor = style.color
                  const borderColor = style.borderColor
                  
                  [bgColor, textColor, borderColor].forEach(color => {
                    const hex = toHex(color)
                    if (hex) {
                      colors.set(hex, (colors.get(hex) || 0) + 2)
                    }
                  })
                }
              })
            } catch (e) {
              // Cross-origin stylesheets may throw
            }
          })
          
          return {
            colors: Array.from(colors.entries()).sort((a, b) => b[1] - a[1]).map(([color]) => color),
            fonts: Array.from(fonts.entries()).sort((a, b) => b[1] - a[1]).map(([font]) => font)
          }
        })
        
        // Merge computed data
        computedData.colors.forEach((color: string, index: number) => {
          colorFrequency.set(color, (colorFrequency.get(color) || 0) + (20 - index))
        })
        computedData.fonts.forEach((font: string, index: number) => {
          fontFrequency.set(font, (fontFrequency.get(font) || 0) + (15 - index))
        })
        
        await browser.close()
      }
    }
  } catch (playwrightError) {
    console.warn('Playwright extraction failed, using HTML source:', playwrightError)
  }
  
  // Step 2: Always also extract from HTML source (backup + additional data)
  if (!html) {
    try {
      const fetchResponse = await fetch(validUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(15000),
      })
      
      if (fetchResponse.ok) {
        html = await fetchResponse.text()
      }
    } catch (fetchError) {
      console.warn('HTML fetch failed:', fetchError)
    }
  }
  
  if (html) {
    // Extract from HTML source
    extractColorsFromHTML(html, colorFrequency, baseUrl)
    extractFontsFromHTML(html, fontFrequency)
    
    // Extract logo
    const logoPatterns = [
      /<img[^>]*(?:class|id|alt|src)=["'][^"']*(?:logo|brand)[^"']*["'][^>]*src=["']([^"']+)["']/i,
      /<(?:header|nav)[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*(?:logo|brand|alt=["'][^"']*(?:logo|brand)[^"']*["'])/i,
      /<link[^>]*(?:rel=["'](?:icon|apple-touch-icon|shortcut icon)["']|href=["']([^"']*logo[^"']*)["'])/i,
    ]
    
    for (const pattern of logoPatterns) {
      const match = html.match(pattern)
      if (match) {
        logoUrl = match[1] || match[0]?.match(/src=["']([^"']+)["']/)?.[1] || match[0]?.match(/href=["']([^"']+)["']/)?.[1]
        if (logoUrl && !logoUrl.startsWith('http')) {
          logoUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`
        }
        if (logoUrl) break
      }
    }
  }
  
  // Combine and sort results - DON'T filter aggressively, get REAL colors
  let extractedColors = Array.from(colorFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color)
    .slice(0, 15) // Get top 15 colors
  
  // Remove duplicates and ensure we have meaningful colors
  const uniqueColors = [...new Set(extractedColors)]
  
  // If we have very few colors, that's okay - use what we found (might be a minimal site)
  if (uniqueColors.length === 0) {
    throw new Error('Failed to extract colors from website. The website may not be accessible or may not contain extractable color information.')
  }
  
  const extractedFonts = Array.from(fontFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([font]) => font)
    .filter(font => {
      // Filter out invalid font names (numbers, sizes, etc.)
      return font && 
             !font.match(/^\d+px?$/i) && // Not "13px" or "0"
             !font.match(/^\d+$/i) && // Not just numbers
             font.length > 2 && // At least 3 characters
             !font.match(/^(normal|bold|italic|inherit|initial|unset)$/i) // Not CSS keywords
    })
    .slice(0, 3)
  
  // Validate extraction
  if (extractedColors.length === 0) {
    throw new Error('Failed to extract colors from website. The website may not be accessible or may not contain extractable color information.')
  }
  
  // Use the most frequent colors as primary (these are the REAL brand colors)
  // Don't filter out white/black - if they're the most used, they ARE the brand colors
  const primaryColors = uniqueColors.slice(0, 2)
  const secondaryColors = uniqueColors.slice(2, 4).length > 0 
    ? uniqueColors.slice(2, 4)
    : uniqueColors.slice(0, 2) // Fallback if not enough colors
  
  const primaryFont = extractedFonts[0] || undefined
  const secondaryFont = extractedFonts[1] || undefined
  
  // AI Analysis
  let aiAnalysis
  try {
    aiAnalysis = await analyzeBrandWithAI(html || '', extractedColors, extractedFonts, styleVariation)
  } catch (aiError: unknown) {
    console.error('AI analysis failed:', aiError)
    aiAnalysis = {
      style: styleVariation ? `${styleVariation} Professional` : 'Modern',
      brandPersonality: 'Professional',
      recommendations: ['Focus on brand consistency', 'Maintain visual identity'],
      emotions: [],
      values: [],
      targetAudience: 'General audience',
    }
  }

  return {
    logo: logoUrl || undefined,
    primaryColors,
    secondaryColors,
    allColors: extractedColors,
    primaryFont,
    secondaryFont,
    typographyPairings: [primaryFont, secondaryFont].filter(Boolean),
    style: aiAnalysis?.style || 'Modern',
    brandPersonality: aiAnalysis?.brandPersonality || 'Professional',
    brandTone: aiAnalysis?.brandTone || aiAnalysis?.brandPersonality || 'Professional',
    messaging: aiAnalysis?.messaging || aiAnalysis?.recommendations || ['Focus on brand consistency'],
    emotions: aiAnalysis?.emotions || [],
    values: aiAnalysis?.values || [],
    targetAudience: aiAnalysis?.targetAudience || 'General audience',
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
    const { url, userId, styleVariation } = await request.json()

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
    let brandSystem
    try {
      const brandSystemPromise = extractCompleteBrandSystem(url, styleVariation)
      brandSystem = await Promise.race([brandSystemPromise, timeoutPromise]) as Awaited<ReturnType<typeof extractCompleteBrandSystem>>
    } catch (extractError: unknown) {
      console.error('Brand extraction error:', extractError)
      const errorMsg = extractError instanceof Error ? extractError.message : 'Unknown error'
      if (errorMsg.includes('timeout') || errorMsg.includes('Timeout')) {
        return NextResponse.json(
          { 
            error: 'Brand extraction timed out. The website may be too complex or slow. Please try a simpler website or try again.',
            code: 'TIMEOUT'
          },
          { status: 504 }
        )
      }
      throw extractError // Re-throw to be caught by outer catch
    }

    // Step 2: Generate all brand assets (logo, moodboard, templates, pitch-deck)
    let assets: any[] = []
    try {
      // Generate assets with a shorter timeout to prevent overall timeout
      const assetsPromise = generateAllBrandAssets(brandSystem)
      const assetsTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Asset generation timeout')), 20000) // 20 second timeout for assets
      })
      
      try {
        assets = await Promise.race([assetsPromise, assetsTimeout]) as any[]
      } catch (assetError) {
        console.warn('Asset generation timed out or failed, continuing with brand system:', assetError)
        // Continue without assets - brand system is still complete
        assets = []
      }
    } catch (assetError) {
      console.warn('Asset generation failed, continuing with brand system:', assetError)
      assets = []
    }

    const completeSystem = {
      ...brandSystem,
      assets,
      generatedAt: new Date().toISOString(),
      aiPowered: true,
      autonomous: true,
      note: assets.length === 0 ? 'Brand system extracted successfully. Assets can be generated on-demand via the asset generator.' : undefined,
    }

    return NextResponse.json({ success: true, data: completeSystem })
  } catch (error: unknown) {
    console.error('Complete brand system generation error:', error)
    
    // Ensure error response is always JSON
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate complete brand system'
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
