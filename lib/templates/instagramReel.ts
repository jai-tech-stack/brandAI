import type { TemplateConfig, TemplateResult } from './templateTypes'

export async function generateInstagramReelTemplate(config: TemplateConfig): Promise<TemplateResult> {
  // Instagram Reel: 1080x1920 (vertical, 9:16 aspect ratio)
  const { width, height, backgroundColor, primaryColor, text, logoUrl } = config

  const templateData = {
    type: 'instagramReel',
    width: 1080,
    height: 1920,
    backgroundColor: backgroundColor || '#000000',
    primaryColor: primaryColor || '#FFFFFF',
    text: text || 'Your Brand Message',
    logoUrl,
  }

  const templateUrl = `/api/templates/generate?type=instagramReel&data=${encodeURIComponent(JSON.stringify(templateData))}`

  return {
    url: templateUrl,
    type: 'instagramReel',
    width: 1080,
    height: 1920,
  }
}

