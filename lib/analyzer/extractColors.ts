import { ColorPalette } from './extractorTypes'

// ColorThief removed - was causing build issues on Vercel
// CSS extraction is sufficient and works in all environments

/**
 * Extract colors from website using multiple methods
 */
export async function extractColors(
  html: string,
  screenshotBuffer?: Buffer
): Promise<ColorPalette> {
  const colors: ColorPalette = {
    primary: [],
    secondary: [],
    accent: [],
    neutral: [],
  }

  // Method 1: Extract from CSS
  const cssColors = extractColorsFromCSS(html)
  
  // Method 2: Extract from screenshot if available
  let screenshotColors: string[] = []
  if (screenshotBuffer) {
    try {
      screenshotColors = await extractColorsFromImage(screenshotBuffer)
    } catch (error) {
      console.warn('Failed to extract colors from screenshot:', error)
    }
  }

  // Combine and categorize colors
  const allColors = [...cssColors, ...screenshotColors]
  const normalizedColors = allColors.map(normalizeColor).filter((color): color is string => color !== null)
  const uniqueColors = Array.from(new Set(normalizedColors))
  
  // Categorize colors
  categorizeColors(uniqueColors, colors)

  return colors
}

function extractColorsFromCSS(html: string): string[] {
  const colors: string[] = []
  
  // Extract from inline styles using regex (no DOM parsing needed)
  const inlineStyleRegex = /style=["']([^"']+)["']/gi
  let match
  while ((match = inlineStyleRegex.exec(html)) !== null) {
    const style = match[1]
    const colorMatches = style.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi)
    colorMatches?.forEach((colorMatch) => {
      const colorValue = colorMatch.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-z]+)/i)
      if (colorValue) {
        const color = normalizeColor(colorValue[1])
        if (color) colors.push(color)
      }
    })
  }

  // Extract from style tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let styleMatch
  while ((styleMatch = styleTagRegex.exec(html)) !== null) {
    const css = styleMatch[1]
    const cssMatches = css.match(/(?:color|background-color|background|border-color):\s*([^;]+)/gi)
    cssMatches?.forEach((cssMatch) => {
      const colorMatch = cssMatch.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|[a-z]+)/i)
      if (colorMatch) {
        const color = normalizeColor(colorMatch[1])
        if (color) colors.push(color)
      }
    })
  }

  return colors
}

async function extractColorsFromImage(buffer: Buffer): Promise<string[]> {
  // Image-based color extraction removed - CSS extraction is sufficient
  // This avoids native dependency issues on serverless platforms
  return []
}

function normalizeColor(color: string): string | null {
  color = color.trim().toLowerCase()

  // Hex colors
  if (color.startsWith('#')) {
    if (color.length === 4) {
      // #RGB -> #RRGGBB
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    }
    return color.length === 7 ? color.toUpperCase() : null
  }

  // RGB/RGBA
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    return rgbToHex(r, g, b)
  }

  // Named colors
  const namedColors: { [key: string]: string } = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF0000',
    blue: '#0000FF',
    green: '#008000',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    gray: '#808080',
    grey: '#808080',
  }
  if (namedColors[color]) {
    return namedColors[color]
  }

  return null
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()}`
}

function categorizeColors(colors: string[], palette: ColorPalette): void {
  // Filter out pure black/white for primary/secondary
  const nonNeutral = colors.filter(
    (c) => c !== '#000000' && c !== '#FFFFFF' && c !== '#000' && c !== '#FFF'
  )

  // Primary colors (first 3 non-neutral)
  palette.primary = nonNeutral.slice(0, 3)

  // Secondary colors (next 3)
  palette.secondary = nonNeutral.slice(3, 6)

  // Accent colors (vibrant colors)
  const vibrant = colors.filter((c) => {
    const rgb = hexToRgb(c)
    if (!rgb) return false
    const { r, g, b } = rgb
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max
    return saturation > 0.5 && max > 100
  })
  palette.accent = vibrant.slice(0, 2)

  // Neutral colors (grays, blacks, whites)
  const neutral = colors.filter(
    (c) => c === '#000000' || c === '#FFFFFF' || c === '#000' || c === '#FFF' || isGray(c)
  )
  palette.neutral = neutral.slice(0, 4)

  // Don't add fake defaults - if no colors found, return empty arrays
  // This allows the frontend to handle the "no colors extracted" state properly
  // Only add neutral defaults if we actually have some colors but no neutrals
  if (colors.length > 0 && palette.neutral.length === 0) {
    // Only add neutral if we have other colors (meaning extraction worked)
    palette.neutral = ['#000000', '#FFFFFF', '#808080']
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function isGray(color: string): boolean {
  const rgb = hexToRgb(color)
  if (!rgb) return false
  const { r, g, b } = rgb
  const diff = Math.max(r, g, b) - Math.min(r, g, b)
  return diff < 30
}

