/**
 * Generate 3 intelligent starter assets based on brand system
 * These are automatically generated when a brand session is created
 */

import { generateImageWithAI, enhancePromptWithAI } from '@/lib/aiService'

interface BrandSystem {
  primaryColors: string[]
  secondaryColors: string[]
  primaryFont?: string
  secondaryFont?: string
  style?: string
  brandPersonality?: string
  brandTone?: string
  messaging?: string[]
  sourceUrl?: string
  brandName?: string
}

interface StarterAsset {
  id: string
  type: 'social' | 'banner' | 'card'
  prompt: string
  enhancedPrompt: string
  imageUrl: string
  name: string
  description: string
}

/**
 * Generate 3 intelligent starter assets based on brand analysis
 * Smarter than competitor: chooses assets based on brand type and style
 */
export async function generateStarterAssets(brandSystem: BrandSystem): Promise<StarterAsset[]> {
  const brandName = brandSystem.brandName || brandSystem.sourceUrl?.split('//')[1]?.split('/')[0]?.replace('www.', '') || 'Brand'
  const brandStyle = brandSystem.style || brandSystem.brandPersonality || 'modern'
  const primaryMessage = brandSystem.messaging?.[0] || 'Professional and innovative'
  
  // Ensure we have required colors
  if (!brandSystem.primaryColors || brandSystem.primaryColors.length === 0) {
    console.warn('No primary colors found, skipping starter asset generation')
    return []
  }
  
  // Intelligent asset selection based on brand type
  const assetTypes = selectAssetTypes(brandStyle, brandSystem)
  
  const assets: StarterAsset[] = []
  
  // Generate assets in parallel for speed
  const assetPromises = assetTypes.map(async (assetType, index) => {
    try {
      const prompt = createIntelligentPrompt(assetType, brandSystem, brandName)
      const brandKit = {
        name: brandName,
        colors: [...(brandSystem.primaryColors || []), ...(brandSystem.secondaryColors || [])],
        typography: [brandSystem.primaryFont, brandSystem.secondaryFont].filter(Boolean) as string[],
        style: brandStyle,
      }
      
      const enhancedPrompt = await enhancePromptWithAI(prompt, brandKit)
      
      const aiResult = await generateImageWithAI({
        prompt: enhancedPrompt,
        brandColors: brandKit.colors,
        style: brandStyle,
        size: getAssetSize(assetType),
      })
      
      return {
        id: `starter-${Date.now()}-${index}`,
        type: assetType.type,
        prompt,
        enhancedPrompt,
        imageUrl: aiResult.imageUrl,
        name: assetType.name,
        description: assetType.description,
      }
    } catch (error) {
      console.error(`Failed to generate starter asset ${index}:`, error)
      return null
    }
  })
  
  const results = await Promise.all(assetPromises)
  return results.filter((asset): asset is StarterAsset => asset !== null)
}

/**
 * Intelligently select asset types based on brand style
 */
function selectAssetTypes(brandStyle: string, brandSystem: BrandSystem): Array<{ type: 'social' | 'banner' | 'card', name: string, description: string }> {
  const style = brandStyle.toLowerCase()
  
  // For tech/startup brands: social post, hero banner, business card
  if (style.includes('tech') || style.includes('startup') || style.includes('modern')) {
    return [
      { type: 'social', name: 'Social Media Post', description: 'Instagram-ready post showcasing your brand' },
      { type: 'banner', name: 'Hero Banner', description: 'Website hero section banner' },
      { type: 'card', name: 'Business Card', description: 'Professional business card design' },
    ]
  }
  
  // For creative/design brands: social story, portfolio banner, creative card
  if (style.includes('creative') || style.includes('design') || style.includes('art')) {
    return [
      { type: 'social', name: 'Creative Social Post', description: 'Eye-catching social media content' },
      { type: 'banner', name: 'Portfolio Banner', description: 'Showcase banner for your work' },
      { type: 'card', name: 'Creative Business Card', description: 'Unique business card design' },
    ]
  }
  
  // For professional/corporate: LinkedIn post, corporate banner, executive card
  if (style.includes('professional') || style.includes('corporate') || style.includes('business')) {
    return [
      { type: 'social', name: 'LinkedIn Post', description: 'Professional LinkedIn content' },
      { type: 'banner', name: 'Corporate Banner', description: 'Corporate website banner' },
      { type: 'card', name: 'Executive Card', description: 'Professional business card' },
    ]
  }
  
  // Default: versatile set
  return [
    { type: 'social', name: 'Social Media Post', description: 'Ready-to-use social content' },
    { type: 'banner', name: 'Website Banner', description: 'Hero banner for your website' },
    { type: 'card', name: 'Business Card', description: 'Professional business card' },
  ]
}

/**
 * Create intelligent prompts based on asset type and brand
 */
function createIntelligentPrompt(
  assetType: { type: 'social' | 'banner' | 'card', name: string },
  brandSystem: BrandSystem,
  brandName: string
): string {
  const primaryMessage = brandSystem.messaging?.[0] || 'Professional and innovative'
  const brandTone = brandSystem.brandTone || brandSystem.brandPersonality || 'modern'
  
  switch (assetType.type) {
    case 'social':
      return `Create a professional social media post for ${brandName}. Style: ${brandTone}. Message: ${primaryMessage}. Use brand colors and typography. Clean, modern design suitable for Instagram and LinkedIn.`
    
    case 'banner':
      return `Design a hero banner for ${brandName}'s website. Style: ${brandTone}. Message: ${primaryMessage}. Use brand colors prominently. Professional, eye-catching design that represents the brand identity.`
    
    case 'card':
      return `Create a professional business card for ${brandName}. Style: ${brandTone}. Use brand colors and typography. Clean, modern design with company name and tagline: ${primaryMessage}.`
    
    default:
      return `Create a professional brand asset for ${brandName} in ${brandTone} style.`
  }
}

/**
 * Get appropriate size for asset type
 */
function getAssetSize(type: 'social' | 'banner' | 'card'): string {
  switch (type) {
    case 'social':
      return '1024x1024' // Square for social
    case 'banner':
      return '1920x600' // Wide banner
    case 'card':
      return '1050x600' // Business card ratio
    default:
      return '1024x1024'
  }
}

