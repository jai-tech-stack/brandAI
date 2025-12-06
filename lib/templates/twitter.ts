import { TemplateConfig, TemplateResult } from './templateTypes'
import { generateTemplateHTML, renderTemplate } from './renderTemplate'

/**
 * Generate Twitter header template (1500x500)
 */
export async function generateTwitterTemplate(
  config: TemplateConfig
): Promise<TemplateResult> {
  const html = generateTemplateHTML(config, 'twitter')
  const buffer = await renderTemplate(html, config, 'twitter')

  return {
    url: '', // Will be set after upload
    type: 'twitter',
    width: 1500,
    height: 500,
  }
}

