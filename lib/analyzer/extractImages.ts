import { BrandImages } from './extractorTypes'

/**
 * Extract logo and hero images from website
 */
export function extractImages(html: string, baseUrl: string): BrandImages {
  const images: BrandImages = {
    logos: [],
    hero: [],
  }

  // Extract logo images using regex
  const imgRegex = /<img[^>]+>/gi
  let imgMatch
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgTag = imgMatch[0]
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i)
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i)
    const classMatch = imgTag.match(/class=["']([^"']+)["']/i)
    const idMatch = imgTag.match(/id=["']([^"']+)["']/i)

    const src = srcMatch ? srcMatch[1] : ''
    const alt = altMatch ? altMatch[1] : ''
    const className = classMatch ? classMatch[1] : ''
    const id = idMatch ? idMatch[1] : ''

    // Check if it's a logo
    const isLogo =
      /logo|brand|icon/i.test(src) ||
      /logo|brand|icon/i.test(alt) ||
      /logo|brand|icon/i.test(className) ||
      /logo|brand|icon/i.test(id)

    if (isLogo && src) {
      const fullUrl = resolveUrl(src, baseUrl)
      images.logos.push({
        url: fullUrl,
        alt: alt || undefined,
        type: /icon/i.test(src) ? 'icon' : /logo/i.test(src) ? 'logo' : 'brand',
      })
    }

    // Check if it's a hero image
    const isHero =
      /hero|banner|header|cover|main/i.test(src) ||
      /hero|banner|header|cover|main/i.test(alt) ||
      /hero|banner|header|cover|main/i.test(className)

    if (isHero && src && !isLogo) {
      const fullUrl = resolveUrl(src, baseUrl)
      images.hero.push({
        url: fullUrl,
        alt: alt || undefined,
      })
    }
  }

  // Also check for background images
  const bgImageRegex = /style=["']([^"']*background-image[^"']*)["']/gi
  let bgMatch
  while ((bgMatch = bgImageRegex.exec(html)) !== null) {
    const style = bgMatch[1]
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i)
    if (match) {
      const src = match[1]
      const fullUrl = resolveUrl(src, baseUrl)
      const tagMatch = html.substring(Math.max(0, bgMatch.index - 200), bgMatch.index + 200)
      const classMatch = tagMatch.match(/class=["']([^"']+)["']/i)
      const className = classMatch ? classMatch[1] : ''
      
      if (/hero|banner|header|cover|main/i.test(className)) {
        images.hero.push({
          url: fullUrl,
          alt: undefined,
        })
      }
    }
  }

  // Remove duplicates
  images.logos = images.logos.filter(
    (logo, index, self) => index === self.findIndex((l) => l.url === logo.url)
  )
  images.hero = images.hero.filter(
    (hero, index, self) => index === self.findIndex((h) => h.url === hero.url)
  )

  return images
}

function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  if (url.startsWith('//')) {
    return `https:${url}`
  }
  if (url.startsWith('/')) {
    const base = new URL(baseUrl)
    return `${base.origin}${url}`
  }
  const base = new URL(baseUrl)
  return `${base.origin}/${url}`
}

