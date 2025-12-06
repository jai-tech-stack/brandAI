import { chromium, Browser, Page } from 'playwright'
import { WebsiteAnalysis, AnalyzerConfig } from './extractorTypes'
import { extractColors } from './extractColors'
import { extractFonts } from './extractFonts'
import { extractCopy } from './extractCopy'
import { extractImages } from './extractImages'
import sharp from 'sharp'

const DEFAULT_CONFIG: AnalyzerConfig = {
  timeout: 30000,
  viewport: {
    width: 1920,
    height: 1080,
  },
}

/**
 * Main analyzer function - analyzes a website and extracts brand elements
 */
export async function analyzeWebsite(
  url: string,
  config: AnalyzerConfig = {}
): Promise<WebsiteAnalysis> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  let browser: Browser | null = null

  try {
    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    const validUrl = new URL(normalizedUrl)
    const baseUrl = validUrl.origin

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    })

    const context = await browser.newContext({
      viewport: finalConfig.viewport,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    const page = await context.newPage()

    // Navigate to page
    await page.goto(validUrl.toString(), {
      waitUntil: 'networkidle',
      timeout: finalConfig.timeout,
    })

    // Wait for content to load
    if (finalConfig.waitForSelector) {
      await page.waitForSelector(finalConfig.waitForSelector, { timeout: 10000 }).catch(() => {})
    } else {
      await page.waitForTimeout(2000) // Wait for dynamic content
    }

    // Get HTML
    const html = await page.content()

    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: 'png',
    })

    // Extract elements
    const colors = await extractColors(html, screenshotBuffer as Buffer)
    const fonts = extractFonts(html)
    const text = extractCopy(html)
    const images = extractImages(html, baseUrl)

    // Upload screenshot to storage (will be handled by API route)
    // For now, we'll return the buffer and let the API handle storage

    // Extract metadata
    const title = await page.title().catch(() => undefined)
    const metaDescription = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute('content'))
      .catch(() => undefined)
    const ogImage = await page
      .$eval('meta[property="og:image"]', (el) => el.getAttribute('content'))
      .catch(() => undefined)

    await browser.close()

    return {
      url: validUrl.toString(),
      colors,
      fonts,
      text: {
        ...text,
        title: title || text.title,
        metaDescription: metaDescription || text.metaDescription,
      },
      images,
      screenshotUrl: '', // Will be set by API route after upload
      analyzedAt: new Date().toISOString(),
      metadata: {
        title: title || undefined,
        description: metaDescription || undefined,
        ogImage: ogImage || undefined,
      },
    }
  } catch (error) {
    if (browser) {
      await browser.close()
    }
    throw error
  }
}

