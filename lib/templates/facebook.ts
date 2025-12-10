import type { TemplateConfig, TemplateResult } from './templateTypes'

export async function generateFacebookTemplate(config: TemplateConfig): Promise<TemplateResult> {
  // Facebook: 1200x630 (horizontal, 1.91:1 aspect ratio)
  const { width, height, backgroundColor, primaryColor, text, logoUrl } = config

  const templateData = {
    type: 'facebook',
    width: 1200,
    height: 630,
    backgroundColor: backgroundColor || '#FFFFFF',
    primaryColor: primaryColor || '#000000',
    text: text || 'Your Brand Message',
    logoUrl,
  }

  const templateUrl = `/api/templates/generate?type=facebook&data=${encodeURIComponent(JSON.stringify(templateData))}`

  return {
    url: templateUrl,
    type: 'facebook',
    width: 1200,
    height: 630,
  }
}

