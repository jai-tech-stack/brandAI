import type { TemplateConfig, TemplateResult } from './templateTypes'

export async function generatePinterestTemplate(config: TemplateConfig): Promise<TemplateResult> {
  // Pinterest: 1000x1500 (vertical, 2:3 aspect ratio)
  const { width, height, backgroundColor, primaryColor, text, logoUrl } = config

  const templateData = {
    type: 'pinterest',
    width: 1000,
    height: 1500,
    backgroundColor: backgroundColor || '#FFFFFF',
    primaryColor: primaryColor || '#000000',
    text: text || 'Your Brand Message',
    logoUrl,
  }

  const templateUrl = `/api/templates/generate?type=pinterest&data=${encodeURIComponent(JSON.stringify(templateData))}`

  return {
    url: templateUrl,
    type: 'pinterest',
    width: 1000,
    height: 1500,
  }
}

