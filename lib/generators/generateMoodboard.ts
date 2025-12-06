import { generateImageWithAI } from '../aiService'
import { BrandText, ColorPalette } from '../analyzer/extractorTypes'

/**
 * Generate moodboard images based on brand keywords and style
 */
export async function generateMoodboard(
  colors: ColorPalette,
  text: BrandText,
  style?: string
): Promise<string[]> {
  const moodboardImages: string[] = []
  const keywords = text.keywords.slice(0, 5).join(', ')
  const primaryColors = colors.primary.join(', ')

  // Generate 6-10 moodboard images
  const prompts = [
    `Create a moodboard image showing ${style || 'modern'} aesthetic with colors ${primaryColors}. Keywords: ${keywords}. Visual style direction, textures, patterns.`,
    `Brand moodboard: ${style || 'professional'} style with ${primaryColors}. Show typography samples, color swatches, visual elements.`,
    `Art direction moodboard for brand with ${primaryColors}. Style: ${style || 'contemporary'}. Show photography style, composition, visual language.`,
    `Visual identity moodboard: ${keywords}. Colors: ${primaryColors}. Show brand personality through imagery, textures, and visual elements.`,
    `Brand aesthetic moodboard with ${primaryColors}. Style: ${style || 'minimal'}. Show design elements, patterns, and visual inspiration.`,
    `Creative direction moodboard: ${style || 'modern'} brand aesthetic. Colors ${primaryColors}. Show visual style, mood, and brand essence.`,
  ]

  for (const prompt of prompts.slice(0, 6)) {
    try {
      const result = await generateImageWithAI({
        prompt,
        brandColors: colors.primary,
        style: style || 'Modern',
        size: '1024x1024',
      })
      moodboardImages.push(result.imageUrl)
    } catch (error) {
      console.warn('Moodboard image generation failed:', error)
    }
  }

  return moodboardImages
}

