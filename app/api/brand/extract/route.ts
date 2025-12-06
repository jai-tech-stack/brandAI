import { NextRequest, NextResponse } from 'next/server'
import { analyzeBrandWithAI } from '@/lib/aiService'

// Helper function to convert any color format to hex
function colorToHex(color: string): string | null {
  color = color.trim()
  
  // Already hex
  if (color.startsWith('#')) {
    if (color.length === 4) {
      // #RGB -> #RRGGBB
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    }
    return color.length === 7 ? color : null
  }
  
  // RGB/RGBA
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`.toUpperCase()
  }
  
  // Named colors
  const namedColors: { [key: string]: string } = {
    'white': '#FFFFFF', 'black': '#000000', 'red': '#FF0000',
    'blue': '#0000FF', 'green': '#008000', 'yellow': '#FFFF00',
    'cyan': '#00FFFF', 'magenta': '#FF00FF', 'gray': '#808080',
    'grey': '#808080', 'orange': '#FFA500', 'pink': '#FFC0CB',
    'purple': '#800080', 'brown': '#A52A2A', 'navy': '#000080',
  }
  if (namedColors[color.toLowerCase()]) {
    return namedColors[color.toLowerCase()]
  }
  
  return null
}

// Categorize colors into primary and secondary
function categorizeColors(colors: string[]): { primary: string[], secondary: string[] } {
  if (colors.length === 0) {
    return { primary: ['#000000', '#FFFFFF'], secondary: ['#666666'] }
  }
  
  // Filter out pure black/white for primary if we have other colors
  const nonNeutral = colors.filter(c => c !== '#000000' && c !== '#000' && c !== '#FFFFFF' && c !== '#FFF')
  const hasBlack = colors.some(c => c === '#000000' || c === '#000')
  const hasWhite = colors.some(c => c === '#FFFFFF' || c === '#FFF')
  
  if (nonNeutral.length >= 2) {
    return {
      primary: nonNeutral.slice(0, 2),
      secondary: nonNeutral.slice(2, 4).concat(hasBlack ? ['#000000'] : [], hasWhite ? ['#FFFFFF'] : []).slice(0, 2)
    }
  }
  
  return {
    primary: colors.slice(0, 2),
    secondary: colors.slice(2, 4)
  }
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

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    let validUrl: URL
    try {
      validUrl = new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid website URL.' },
        { status: 400 }
      )
    }

    try {
      // Autonomous AI agent: Fetch the website HTML
      const response = await fetch(validUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow',
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch website. Status: ${response.status}` },
          { status: response.status }
        )
      }

      const html = await response.text()
      const baseUrl = validUrl.origin

      // Autonomous AI agent: Extract CSS files
      const cssFiles: string[] = []
      const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi
      let cssMatch
      while ((cssMatch = cssLinkRegex.exec(html)) !== null) {
        let cssUrl = cssMatch[1]
        if (!cssUrl.startsWith('http')) {
          cssUrl = cssUrl.startsWith('/') ? `${baseUrl}${cssUrl}` : `${baseUrl}/${cssUrl}`
        }
        cssFiles.push(cssUrl)
      }

      // Extract inline styles
      const inlineStyles: string[] = []
      const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
      let styleMatch
      while ((styleMatch = styleTagRegex.exec(html)) !== null) {
        inlineStyles.push(styleMatch[1])
      }

      // Autonomous AI agent: Fetch and parse CSS files
      let allCss = inlineStyles.join('\n')
      for (const cssUrl of cssFiles.slice(0, 5)) {
        try {
          const cssResponse = await fetch(cssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(5000),
          })
          if (cssResponse.ok) {
            const cssText = await cssResponse.text()
            allCss += '\n' + cssText
          }
        } catch (e) {
          // Continue if CSS file fails
        }
      }

      // Autonomous AI agent: Extract colors with intelligent analysis
      const colorMap = new Map<string, number>()
      
      // Extract from CSS variables
      const cssVarRegex = /--[\w-]+:\s*([^;]+)/gi
      let varMatch
      while ((varMatch = cssVarRegex.exec(allCss + html)) !== null) {
        const value = varMatch[1].trim()
        const hex = colorToHex(value)
        if (hex) {
          colorMap.set(hex, (colorMap.get(hex) || 0) + 2)
        }
      }

      // Extract from all color properties
      const colorPropsRegex = /(?:color|background-color|background|border-color|border-top-color|border-bottom-color|border-left-color|border-right-color|outline-color|text-decoration-color|fill|stroke):\s*([^;]+)/gi
      let propMatch
      while ((propMatch = colorPropsRegex.exec(allCss + html)) !== null) {
        const colorValue = propMatch[1].trim().split(/\s+/)[0]
        const hex = colorToHex(colorValue)
        if (hex) {
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
        }
      }

      // Extract from style attributes
      const styleAttrRegex = /style=["']([^"']+)["']/gi
      while ((styleMatch = styleAttrRegex.exec(html)) !== null) {
        const styleContent = styleMatch[1]
        const styleColorMatch = styleContent.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi)
        if (styleColorMatch) {
          styleColorMatch.forEach(match => {
            const colorValue = match.split(':')[1]?.trim()
            const hex = colorToHex(colorValue)
            if (hex) {
              colorMap.set(hex, (colorMap.get(hex) || 0) + 1.5)
            }
          })
        }
      }

      // Sort colors by frequency
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .filter(color => {
          const hex = color.replace('#', '')
          if (hex.length < 6) return true
          const r = parseInt(hex.substring(0, 2), 16)
          const g = parseInt(hex.substring(2, 4), 16)
          const b = parseInt(hex.substring(4, 6), 16)
          const brightness = (r + g + b) / 3
          return brightness > 20 && brightness < 240
        })

      const finalColors: string[] = []
      const hasBlack = sortedColors.find(c => c === '#000000' || c === '#000')
      const hasWhite = sortedColors.find(c => c === '#FFFFFF' || c === '#FFF')
      
      if (hasBlack) finalColors.push(hasBlack)
      if (hasWhite) finalColors.push(hasWhite)
      
      sortedColors.forEach(color => {
        if (finalColors.length < 4 && color !== '#000000' && color !== '#000' && color !== '#FFFFFF' && color !== '#FFF') {
          finalColors.push(color)
        }
      })

      // Autonomous AI agent: Extract fonts
      const fontMap = new Map<string, number>()
      
      const googleFontRegex = /fonts\.googleapis\.com\/css\?family=([^&"']+)/gi
      let fontMatch: RegExpExecArray | null
      while ((fontMatch = googleFontRegex.exec(html + allCss)) !== null) {
        const fonts = fontMatch[1].split('|')
        fonts.forEach(font => {
          const fontName = font.split(':')[0].replace(/\+/g, ' ').trim()
          if (fontName && fontName.length < 50) {
            fontMap.set(fontName, (fontMap.get(fontName) || 0) + 3)
          }
        })
      }

      const fontFamilyRegex = /font-family:\s*([^;]+)/gi
      while ((fontMatch = fontFamilyRegex.exec(allCss + html)) !== null) {
        const fontStack = fontMatch[1]
        const fonts = fontStack.split(',').map(f => f.trim().replace(/['"]/g, ''))
        fonts.forEach((font, index) => {
          if (font && !font.match(/^(sans-serif|serif|monospace|system-ui|ui-sans-serif|ui-serif|ui-monospace|ui-rounded)$/i)) {
            const priority = index === 0 ? 2 : 1
            fontMap.set(font, (fontMap.get(font) || 0) + priority)
          }
        })
      }

      const sortedFonts = Array.from(fontMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([font]) => font)
        .slice(0, 2)

      // Autonomous AI agent: Extract logo
      let logoUrl: string | null = null
      
      const logoImgRegex = /<img[^>]*(?:logo|brand)[^>]*src=["']([^"']+)["']/i
      const logoImgMatch = html.match(logoImgRegex)
      if (logoImgMatch) {
        logoUrl = logoImgMatch[1]
        if (!logoUrl.startsWith('http')) {
          logoUrl = logoUrl.startsWith('/') ? `${baseUrl}${logoUrl}` : `${baseUrl}/${logoUrl}`
        }
      }

      if (!logoUrl) {
        const commonPaths = ['/logo.png', '/logo.svg', '/logo.jpg', '/assets/logo.png', '/images/logo.png']
        for (const path of commonPaths) {
          try {
            const testUrl = `${baseUrl}${path}`
            const testResponse = await fetch(testUrl, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
            if (testResponse.ok) {
              logoUrl = testUrl
              break
            }
          } catch (e) {
            // Continue
          }
        }
      }

      // Ensure we have data
      if (finalColors.length === 0) {
        finalColors.push('#000000', '#FFFFFF')
      }
      if (sortedFonts.length === 0) {
        sortedFonts.push('System Font', 'Sans-serif')
      }

      // Autonomous AI agent: AI-powered brand analysis (with fallback)
      let aiAnalysis
      let aiPowered = false
      try {
        aiAnalysis = await analyzeBrandWithAI(html, finalColors, sortedFonts)
        aiPowered = true
      } catch (aiError: any) {
        console.warn('AI analysis failed, using fallback:', aiError.message)
        // Fallback to rule-based analysis
        const htmlLower = html.toLowerCase()
        let style = 'Modern, Clean, Professional'
        if (htmlLower.includes('minimal') || htmlLower.includes('clean')) {
          style = 'Minimal, Clean, Modern'
        } else if (htmlLower.includes('bold') || htmlLower.includes('vibrant')) {
          style = 'Bold, Vibrant, Contemporary'
        } else if (htmlLower.includes('elegant') || htmlLower.includes('luxury')) {
          style = 'Elegant, Sophisticated, Refined'
        }
        
        aiAnalysis = {
          style,
          brandPersonality: 'Professional',
          recommendations: ['Maintain consistent color usage', 'Use brand fonts across all assets'],
        }
      }

      // Categorize colors
      const colorCategories = categorizeColors(finalColors)
      
      // Get typography pairings
      const primaryFont = sortedFonts[0] || 'System Font'
      const secondaryFont = sortedFonts[1] || 'Sans-serif'

      const brandData = {
        logo: logoUrl,
        colors: finalColors.slice(0, 4),
        primaryColors: colorCategories.primary,
        secondaryColors: colorCategories.secondary,
        typography: sortedFonts,
        primaryFont,
        secondaryFont,
        typographyPairings: [primaryFont, secondaryFont],
        style: aiAnalysis.style,
        brandPersonality: aiAnalysis.brandPersonality,
        brandTone: aiAnalysis.brandTone || aiAnalysis.brandPersonality,
        messaging: aiAnalysis.messaging || [],
        recommendations: aiAnalysis.recommendations,
        extractedAt: new Date().toISOString(),
        sourceUrl: validUrl.toString(),
        aiPowered,
        autonomous: true,
        extractionMethod: aiPowered 
          ? 'Autonomous AI agent - Intelligent brand analysis'
          : 'Autonomous agent - Rule-based brand analysis',
      }

      return NextResponse.json({ success: true, data: brandData })
    } catch (fetchError: any) {
      console.error('Brand extraction fetch error:', {
        message: fetchError.message,
        stack: fetchError.stack,
        name: fetchError.name,
      })
      return NextResponse.json(
        { 
          error: `Failed to extract brand data: ${fetchError.message || 'Unknown error'}. Please ensure the website is accessible and try again.`,
          details: process.env.NODE_ENV === 'development' ? fetchError.stack : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Brand extraction error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Failed to extract brand data. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
