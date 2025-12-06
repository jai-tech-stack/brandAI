import { WebsiteAnalysis } from '../analyzer/extractorTypes'
import { BrandSystem } from './generatorTypes'
import { generateColors } from './generateColors'
import { generateTypography } from './generateTypography'
import { generateVoice } from './generateVoice'
import { generateLogos } from './generateLogos'
import { generateMoodboard } from './generateMoodboard'

/**
 * Generate complete brand system from website analysis
 */
export async function generateBrandSystem(
  analysis: WebsiteAnalysis
): Promise<BrandSystem> {
  // Extract brand name from URL or title
  const brandName =
    analysis.text.title?.split('|')[0].trim() ||
    analysis.text.headings.h1[0] ||
    new URL(analysis.url).hostname.replace('www.', '').split('.')[0]

  // Generate color system
  const colors = generateColors(analysis.colors)

  // Generate typography system
  const typography = generateTypography(analysis.fonts)

  // Generate brand voice
  const voice = await generateVoice(analysis.text, analysis.metadata.title)

  // Generate logos
  const logos = await generateLogos(
    brandName,
    analysis.colors,
    analysis.text,
    analysis.metadata.title
  )

  // Generate moodboard
  const moodboard = await generateMoodboard(
    analysis.colors,
    analysis.text,
    analysis.metadata.title
  )

  return {
    colors,
    typography,
    logos,
    voice,
    moodboard,
    generatedAt: new Date().toISOString(),
  }
}

