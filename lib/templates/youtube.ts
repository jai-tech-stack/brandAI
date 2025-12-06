import { TemplateConfig, TemplateResult } from './templateTypes'
import { generateTemplateHTML, renderTemplate } from './renderTemplate'

/**
 * Generate YouTube thumbnail template (1280x720)
 */
export async function generateYouTubeTemplate(
  config: TemplateConfig
): Promise<TemplateResult> {
  const html = generateTemplateHTML(config, 'youtube')
  const buffer = await renderTemplate(html, config, 'youtube')

  return {
    url: '', // Will be set after upload
    type: 'youtube',
    width: 1280,
    height: 720,
  }
}

