import { BrandText } from './extractorTypes'

/**
 * Extract text content and keywords from website
 */
export function extractCopy(html: string): BrandText {
  const text: BrandText = {
    headings: {
      h1: [],
      h2: [],
      h3: [],
    },
    paragraphs: [],
    keywords: [],
  }

  // Extract headings using regex
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi
  let h1Match
  while ((h1Match = h1Regex.exec(html)) !== null) {
    const content = h1Match[1].replace(/<[^>]+>/g, '').trim()
    if (content && content.length > 0) {
      text.headings.h1.push(content)
    }
  }

  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi
  let h2Match
  while ((h2Match = h2Regex.exec(html)) !== null) {
    const content = h2Match[1].replace(/<[^>]+>/g, '').trim()
    if (content && content.length > 0) {
      text.headings.h2.push(content)
    }
  }

  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi
  let h3Match
  while ((h3Match = h3Regex.exec(html)) !== null) {
    const content = h3Match[1].replace(/<[^>]+>/g, '').trim()
    if (content && content.length > 0) {
      text.headings.h3.push(content)
    }
  }

  // Extract paragraphs
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
  let pMatch
  while ((pMatch = pRegex.exec(html)) !== null) {
    const content = pMatch[1].replace(/<[^>]+>/g, '').trim()
    if (content && content.length > 50 && content.length < 500) {
      text.paragraphs.push(content)
    }
  }

  // Extract meta description
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  if (metaDescMatch) {
    text.metaDescription = metaDescMatch[1]
  }

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) {
    text.title = titleMatch[1].trim()
  }

  // Extract keywords (simple extraction - can be enhanced with AI)
  const keywords = extractKeywords(html, text)
  text.keywords = keywords

  return text
}

function extractKeywords(html: string, text: BrandText): string[] {
  const keywords: string[] = []

  // From meta keywords
  const metaKeywords = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i)
  if (metaKeywords) {
    keywords.push(...metaKeywords[1].split(',').map((k) => k.trim()))
  }

  // From headings
  const allHeadings = [
    ...text.headings.h1,
    ...text.headings.h2,
    ...text.headings.h3,
  ]
  allHeadings.forEach((heading) => {
    const words = heading
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
    keywords.push(...words.slice(0, 3))
  })

  // From title
  if (text.title) {
    const titleWords = text.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
    keywords.push(...titleWords)
  }

  // Remove duplicates and common words
  const commonWords = [
    'the',
    'and',
    'for',
    'with',
    'from',
    'this',
    'that',
    'your',
    'our',
    'about',
  ]
  const uniqueKeywords = Array.from(
    new Set(keywords.filter((k) => !commonWords.includes(k.toLowerCase())))
  )

  return uniqueKeywords.slice(0, 10)
}

