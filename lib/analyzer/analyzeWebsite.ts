import { WebsiteAnalysis, AnalyzerConfig } from './extractorTypes'
import { extractColors } from './extractColors'
import { extractFonts } from './extractFonts'
import { extractCopy } from './extractCopy'
import { extractImages } from './extractImages'

// Playwright imports (optional - will use fallback if not available)
// Using dynamic require to prevent webpack from trying to resolve it at build time
function loadPlaywright() {
  // Don't try to load playwright during build or if not in runtime
  if (process.env.NEXT_PHASE === 'phase-production-build' || 
      process.env.NEXT_RUNTIME === undefined ||
      typeof require === 'undefined') {
    return null
  }
  
  try {
    // Use Function constructor to prevent webpack from analyzing this require
    const requirePlaywright = new Function('moduleName', 'return require(moduleName)')
    return requirePlaywright('playwright')
  } catch (e) {
    return null
  }
}

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
  let browser: any = null

  // Check if Playwright is available (may not be on serverless)
  // Only load playwright at runtime, not during build
  const playwright = loadPlaywright()
  let playwrightAvailable = playwright !== null
  
  if (playwrightAvailable) {
    try {
      const testBrowser = await playwright.chromium.launch({ headless: true })
      await testBrowser.close()
    } catch {
      playwrightAvailable = false
    }
  }

  try {
    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    const validUrl = new URL(normalizedUrl)
    const baseUrl = validUrl.origin

    // Launch browser (if Playwright is available)
    if (!playwrightAvailable || !playwright) {
      // Fallback to fetch-based analysis
      return await analyzeWebsiteFallback(validUrl.toString(), finalConfig)
    }

    browser = await playwright.chromium.launch({
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
      .$eval('meta[name="description"]', (el: Element) => el.getAttribute('content'))
      .catch(() => undefined)
    const ogImage = await page
      .$eval('meta[property="og:image"]', (el: Element) => el.getAttribute('content'))
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
  } catch (error: unknown) {
    if (browser) {
      await browser.close()
    }
    throw error
  }
}

/**
 * Fallback analyzer using fetch (for serverless environments)
 */
async function analyzeWebsiteFallback(
  url: string,
  config: AnalyzerConfig
): Promise<WebsiteAnalysis> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`)
    }

    const html = await response.text()
    const baseUrl = new URL(url).origin

    // Extract elements using regex (no DOM parsing)
    const colors = await extractColors(html)
    const fonts = extractFonts(html)
    const text = extractCopy(html)
    const images = extractImages(html, baseUrl)

    // Extract metadata
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : undefined

    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    const metaDescription = metaDescMatch ? metaDescMatch[1] : undefined

    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
    const ogImage = ogImageMatch ? ogImageMatch[1] : undefined

    return {
      url,
      colors,
      fonts,
      text: {
        ...text,
        title,
        metaDescription,
      },
      images,
      screenshotUrl: '', // No screenshot in fallback mode
      analyzedAt: new Date().toISOString(),
      metadata: {
        title,
        description: metaDescription,
        ogImage,
      },
    }
  } catch (error: any) {
    throw new Error(`Fallback analysis failed: ${error.message}`)
  }
}

