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
  type: 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'heroBanner' | 'tiktok' | 'instagramStory' | 'instagramReel' | 'pinterest' | 'facebook'
  width: number
  height: number
}

export const TEMPLATE_SIZES = {
  instagram: { width: 1080, height: 1080 },
  linkedin: { width: 1584, height: 396 },
  twitter: { width: 1500, height: 500 },
  youtube: { width: 1280, height: 720 },
  heroBanner: { width: 1920, height: 600 },
  tiktok: { width: 1080, height: 1920 },
  instagramStory: { width: 1080, height: 1920 },
  instagramReel: { width: 1080, height: 1920 },
  pinterest: { width: 1000, height: 1500 },
  facebook: { width: 1200, height: 630 },
} as const

