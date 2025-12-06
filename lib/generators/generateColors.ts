import { ColorPalette } from '../analyzer/extractorTypes'
import { BrandSystem } from './generatorTypes'

/**
 * Generate enhanced color system with WCAG contrast suggestions
 */
export function generateColors(extractedColors: ColorPalette): BrandSystem['colors'] {
  const colors: BrandSystem['colors'] = {
    primary: extractedColors.primary.slice(0, 3),
    secondary: extractedColors.secondary.slice(0, 3),
    accent: extractedColors.accent.slice(0, 2),
    neutral: extractedColors.neutral.slice(0, 4),
    wcagContrast: {},
  }

  // Ensure we have defaults
  if (colors.primary.length === 0) colors.primary = ['#000000']
  if (colors.secondary.length === 0) colors.secondary = ['#666666']
  if (colors.accent.length === 0) colors.accent = ['#0066FF']
  if (colors.neutral.length === 0) colors.neutral = ['#000000', '#FFFFFF', '#808080', '#F5F5F5']

  // Calculate WCAG contrast ratios
  const allColors = [
    ...colors.primary,
    ...colors.secondary,
    ...colors.accent,
    ...colors.neutral,
  ]

  allColors.forEach((color) => {
    colors.wcagContrast[color] = {
      aa: checkWCAGContrast(color, '#FFFFFF', 4.5),
      aaa: checkWCAGContrast(color, '#FFFFFF', 7),
    }
  })

  return colors
}

function checkWCAGContrast(color1: string, color2: string, ratio: number): boolean {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  if (!rgb1 || !rgb2) return false

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05) >= ratio
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
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

