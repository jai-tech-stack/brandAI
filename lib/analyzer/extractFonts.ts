import { Typography } from './extractorTypes'

/**
 * Extract typography information from website
 */
export function extractFonts(html: string): Typography {

  const fonts: Typography = {
    primary: 'System Font',
    secondary: 'Sans-serif',
    weights: [400, 600, 700],
    fallbacks: ['sans-serif'],
  }

  // Extract Google Fonts
  const googleFonts: string[] = []
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi
  let linkMatch
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1]
    const match = href.match(/fonts\.googleapis\.com\/css\?family=([^&]+)/)
    if (match) {
      const fontFamilies = match[1].split('|').map((f) => f.split(':')[0].replace(/\+/g, ' '))
      googleFonts.push(...fontFamilies)
    }
  }

  // Extract font-family from CSS
  const fontFamilies: string[] = []
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let styleMatch
  while ((styleMatch = styleTagRegex.exec(html)) !== null) {
    const css = styleMatch[1]
    const matches = css.match(/font-family:\s*([^;]+)/gi)
    matches?.forEach((match) => {
      const fontMatch = match.match(/font-family:\s*(.+)/i)
      if (fontMatch) {
        const fonts = fontMatch[1]
          .split(',')
          .map((f) => f.trim().replace(/['"]/g, ''))
          .filter((f) => !f.match(/^(sans-serif|serif|monospace|system-ui)$/i))
        fontFamilies.push(...fonts)
      }
    })
  }

  // Extract from inline styles
  const inlineStyleRegex = /style=["']([^"']*font-family[^"']*)["']/gi
  let inlineMatch
  while ((inlineMatch = inlineStyleRegex.exec(html)) !== null) {
    const style = inlineMatch[1]
    const match = style.match(/font-family:\s*([^;]+)/i)
    if (match) {
      const fonts = match[1]
        .split(',')
        .map((f) => f.trim().replace(/['"]/g, ''))
        .filter((f) => !f.match(/^(sans-serif|serif|monospace|system-ui)$/i))
      fontFamilies.push(...fonts)
    }
  }

  // Combine and prioritize
  const allFonts = [...googleFonts, ...fontFamilies]
  const uniqueFonts = Array.from(new Set(allFonts)).filter(Boolean)

  if (uniqueFonts.length > 0) {
    fonts.primary = uniqueFonts[0]
  }
  if (uniqueFonts.length > 1) {
    fonts.secondary = uniqueFonts[1]
  }

  // Extract font weights
  const weights: number[] = []
  const styleTagRegex2 = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let styleMatch2
  while ((styleMatch2 = styleTagRegex2.exec(html)) !== null) {
    const css = styleMatch2[1]
    const weightMatches = css.match(/font-weight:\s*(\d+)/gi)
    weightMatches?.forEach((match) => {
      const weightMatch = match.match(/font-weight:\s*(\d+)/i)
      if (weightMatch) {
        const weight = parseInt(weightMatch[1])
        if (!weights.includes(weight)) weights.push(weight)
      }
    })
  }
  fonts.weights = weights.length > 0 ? weights.sort() : [400, 600, 700]

  // Set fallbacks
  fonts.fallbacks = ['sans-serif', 'system-ui', '-apple-system']

  return fonts
}

