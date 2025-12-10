import type { TemplateConfig, TemplateResult } from './templateTypes'

export async function generateInstagramStoryTemplate(config: TemplateConfig): Promise<TemplateResult> {
  // Instagram Story: 1080x1920 (vertical, 9:16 aspect ratio)
  const { width, height, backgroundColor, primaryColor, text, logoUrl } = config

  const templateData = {
    type: 'instagramStory',
    width: 1080,
    height: 1920,
    backgroundColor: backgroundColor || '#FFFFFF',
    primaryColor: primaryColor || '#000000',
    text: text || 'Your Brand Message',
    logoUrl,
  }

  const templateUrl = `/api/templates/generate?type=instagramStory&data=${encodeURIComponent(JSON.stringify(templateData))}`

  return {
    url: templateUrl,
    type: 'instagramStory',
    width: 1080,
    height: 1920,
  }
}

