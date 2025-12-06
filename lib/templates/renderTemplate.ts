import { chromium, Browser } from 'playwright'
import { TemplateConfig, TemplateResult, TEMPLATE_SIZES } from './templateTypes'

/**
 * Render HTML template to PNG using Playwright
 */
export async function renderTemplate(
  html: string,
  config: TemplateConfig,
  type: keyof typeof TEMPLATE_SIZES
): Promise<Buffer> {
  const size = TEMPLATE_SIZES[type]
  let browser: Browser | null = null

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: {
        width: size.width,
        height: size.height,
      },
    })

    const page = await context.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })

    // Wait for fonts and images to load
    await page.waitForTimeout(2000)

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    })

    await browser.close()

    return screenshot as Buffer
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    throw error
  }
}

/**
 * Generate HTML for template
 */
export function generateTemplateHTML(config: TemplateConfig, type: keyof typeof TEMPLATE_SIZES): string {
  const size = TEMPLATE_SIZES[type]
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: ${size.width}px;
      height: ${size.height}px;
      background: ${config.backgroundColor || '#FFFFFF'};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      position: relative;
    }
    .logo {
      max-width: 200px;
      max-height: 200px;
      margin-bottom: 40px;
    }
    .text {
      font-size: ${type === 'instagram' ? '48px' : '36px'};
      font-weight: 700;
      color: ${config.primaryColor || '#000000'};
      text-align: center;
      line-height: 1.2;
      margin-bottom: 20px;
    }
    .subtext {
      font-size: ${type === 'instagram' ? '24px' : '18px'};
      color: ${config.secondaryColor || '#666666'};
      text-align: center;
    }
    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.1;
      z-index: 0;
    }
    .content {
      position: relative;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    ${config.imageUrl ? `<img src="${config.imageUrl}" class="background-image" alt="">` : ''}
    <div class="content">
      ${config.logoUrl ? `<img src="${config.logoUrl}" class="logo" alt="Logo">` : ''}
      ${config.text ? `<div class="text">${config.text}</div>` : ''}
      ${config.text ? `<div class="subtext">Your brand message here</div>` : ''}
    </div>
  </div>
</body>
</html>
  `.trim()
}

