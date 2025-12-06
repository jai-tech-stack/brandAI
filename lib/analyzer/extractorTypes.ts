// Type definitions for website analyzer

export interface ColorPalette {
  primary: string[]
  secondary: string[]
  accent: string[]
  neutral: string[]
}

export interface Typography {
  primary: string
  secondary: string
  weights: number[]
  fallbacks: string[]
}

export interface BrandText {
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  paragraphs: string[]
  keywords: string[]
  metaDescription?: string
  title?: string
}

export interface BrandImages {
  logos: Array<{
    url: string
    alt?: string
    type: 'logo' | 'brand' | 'icon'
  }>
  hero: Array<{
    url: string
    alt?: string
  }>
}

export interface WebsiteAnalysis {
  url: string
  colors: ColorPalette
  fonts: Typography
  text: BrandText
  images: BrandImages
  screenshotUrl: string
  analyzedAt: string
  metadata: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface AnalyzerConfig {
  timeout?: number
  viewport?: {
    width: number
    height: number
  }
  waitForSelector?: string
}

