import { Typography } from '../analyzer/extractorTypes'
import { BrandSystem } from './generatorTypes'

/**
 * Generate enhanced typography system with Google Fonts suggestions
 */
export function generateTypography(extractedFonts: Typography): BrandSystem['typography'] {
  const typography: BrandSystem['typography'] = {
    primary: {
      name: extractedFonts.primary || 'Inter',
      weights: extractedFonts.weights,
      googleFontsUrl: getGoogleFontsUrl(extractedFonts.primary, extractedFonts.weights),
    },
    secondary: {
      name: extractedFonts.secondary || 'Roboto',
      weights: extractedFonts.weights,
      googleFontsUrl: getGoogleFontsUrl(extractedFonts.secondary, extractedFonts.weights),
    },
    combinations: [],
  }

  // Generate font combinations
  typography.combinations = [
    {
      primary: typography.primary.name,
      secondary: typography.secondary.name,
      style: 'Modern',
    },
    {
      primary: 'Inter',
      secondary: 'Playfair Display',
      style: 'Classic',
    },
    {
      primary: 'Poppins',
      secondary: 'Open Sans',
      style: 'Minimal',
    },
  ]

  return typography
}

function getGoogleFontsUrl(fontName: string, weights: number[]): string | undefined {
  // Check if font is available on Google Fonts
  const googleFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
    'Source Sans Pro',
    'Raleway',
  ]

  const normalizedFont = fontName.split(',')[0].trim()
  if (googleFonts.some((gf) => normalizedFont.toLowerCase().includes(gf.toLowerCase()))) {
    const fontFamily = normalizedFont.replace(/\s+/g, '+')
    const weightParam = weights.length > 0 ? `:wght@${weights.join(';')}` : ''
    return `https://fonts.googleapis.com/css2?family=${fontFamily}${weightParam}&display=swap`
  }

  return undefined
}

