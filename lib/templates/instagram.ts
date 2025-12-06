import { TemplateConfig, TemplateResult } from './templateTypes'
import { generateTemplateHTML, renderTemplate } from './renderTemplate'

/**
 * Generate Instagram post template (1080x1080)
 */
export async function generateInstagramTemplate(
  config: TemplateConfig
): Promise<TemplateResult> {
  const html = generateTemplateHTML(config, 'instagram')
  const buffer = await renderTemplate(html, config, 'instagram')

  // Upload to storage (will be handled by API route)
  // For now, return placeholder URL
  return {
    url: '', // Will be set after upload
    type: 'instagram',
    width: 1080,
    height: 1080,
  }
}

