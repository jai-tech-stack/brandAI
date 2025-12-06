// Type definitions for social templates

export interface TemplateConfig {
  width: number
  height: number
  backgroundColor?: string
  primaryColor?: string
  secondaryColor?: string
  text?: string
  logoUrl?: string
  imageUrl?: string
}

export interface TemplateResult {
  url: string
  type: 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'heroBanner'
  width: number
  height: number
}

export const TEMPLATE_SIZES = {
  instagram: { width: 1080, height: 1080 },
  linkedin: { width: 1584, height: 396 },
  twitter: { width: 1500, height: 500 },
  youtube: { width: 1280, height: 720 },
  heroBanner: { width: 1920, height: 600 },
} as const

