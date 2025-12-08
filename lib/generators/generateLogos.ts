import { generateImageWithAI } from '../aiService'
import { BrandText, ColorPalette } from '../analyzer/extractorTypes'
import { BrandSystem } from './generatorTypes'

// Potrace and Sharp removed - were causing canvas dependency issues
// All image processing is handled by AI services (DALL-E, etc.)

/**
 * Generate logo variations using DALL-E 3
 */
export async function generateLogos(
  brandName: string,
  colors: ColorPalette,
  text: BrandText,
  style?: string
): Promise<BrandSystem['logos']> {
  const logos: BrandSystem['logos'] = {
    icon: [],
    horizontal: [],
    badge: [],
    symbol: [],
  }

  const primaryColor = colors.primary[0] || '#000000'
  const tagline = text.headings.h1[0] || brandName

  // Generate icon logo
  try {
    const iconPrompt = `Create a modern icon logo for "${brandName}". Style: ${style || 'minimal'}. Use color ${primaryColor}. Simple, recognizable icon symbol only, no text.`
    const iconResult = await generateImageWithAI({
      prompt: iconPrompt,
      brandColors: colors.primary,
      style: style || 'Modern',
      size: '1024x1024',
    })
    logos.icon.push(iconResult.imageUrl)
  } catch (error: unknown) {
    console.warn('Icon logo generation failed:', error)
  }

  // Generate horizontal logo
  try {
    const horizontalPrompt = `Create a horizontal logo for "${brandName}" with tagline "${tagline}". Style: ${style || 'modern'}. Use colors ${colors.primary.join(', ')}. Horizontal layout with text and icon.`
    const horizontalResult = await generateImageWithAI({
      prompt: horizontalPrompt,
      brandColors: colors.primary,
      style: style || 'Modern',
      size: '1792x1024',
    })
    logos.horizontal.push(horizontalResult.imageUrl)
  } catch (error: unknown) {
    console.warn('Horizontal logo generation failed:', error)
  }

  // Generate badge logo
  try {
    const badgePrompt = `Create a badge-style logo for "${brandName}". Style: ${style || 'classic'}. Use colors ${colors.primary.join(', ')}. Circular or shield shape with text inside.`
    const badgeResult = await generateImageWithAI({
      prompt: badgePrompt,
      brandColors: colors.primary,
      style: style || 'Classic',
      size: '1024x1024',
    })
    logos.badge.push(badgeResult.imageUrl)
  } catch (error: unknown) {
    console.warn('Badge logo generation failed:', error)
  }

  // Generate symbol-only logo
  try {
    const symbolPrompt = `Create a symbol-only logo mark for "${brandName}". Style: ${style || 'minimal'}. Use color ${primaryColor}. Abstract symbol, no text, highly recognizable.`
    const symbolResult = await generateImageWithAI({
      prompt: symbolPrompt,
      brandColors: colors.primary,
      style: style || 'Minimal',
      size: '1024x1024',
    })
    logos.symbol.push(symbolResult.imageUrl)
  } catch (error: unknown) {
    console.warn('Symbol logo generation failed:', error)
  }

  return logos
}

/**
 * Convert PNG logo to SVG (removed - potrace caused canvas dependency issues)
 * Logos are generated as PNG by default
 */
export async function vectorizeLogo(pngBuffer: Buffer): Promise<string> {
  // SVG conversion removed to avoid canvas dependency
  throw new Error('SVG conversion not available - use PNG logos instead')
}

