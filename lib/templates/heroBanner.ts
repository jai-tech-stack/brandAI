import { TemplateConfig, TemplateResult } from './templateTypes'
import { generateTemplateHTML, renderTemplate } from './renderTemplate'

/**
 * Generate website hero banner template (1920x600)
 */
export async function generateHeroBannerTemplate(
  config: TemplateConfig
): Promise<TemplateResult> {
  const html = generateTemplateHTML(config, 'heroBanner')
  const buffer = await renderTemplate(html, config, 'heroBanner')

  return {
    url: '', // Will be set after upload
    type: 'heroBanner',
    width: 1920,
    height: 600,
  }
}

