import { TemplateConfig, TemplateResult } from './templateTypes'
import { generateTemplateHTML, renderTemplate } from './renderTemplate'

/**
 * Generate LinkedIn banner template (1584x396)
 */
export async function generateLinkedInTemplate(
  config: TemplateConfig
): Promise<TemplateResult> {
  const html = generateTemplateHTML(config, 'linkedin')
  const buffer = await renderTemplate(html, config, 'linkedin')

  return {
    url: '', // Will be set after upload
    type: 'linkedin',
    width: 1584,
    height: 396,
  }
}

