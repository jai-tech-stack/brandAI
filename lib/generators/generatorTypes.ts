// Type definitions for brand system generator

export interface BrandSystem {
  colors: {
    primary: string[]
    secondary: string[]
    accent: string[]
    neutral: string[]
    wcagContrast: {
      [key: string]: {
        aa: boolean
        aaa: boolean
      }
    }
  }
  typography: {
    primary: {
      name: string
      weights: number[]
      googleFontsUrl?: string
    }
    secondary: {
      name: string
      weights: number[]
      googleFontsUrl?: string
    }
    combinations: Array<{
      primary: string
      secondary: string
      style: 'Modern' | 'Minimal' | 'Classic'
    }>
  }
  logos: {
    icon: string[]
    horizontal: string[]
    badge: string[]
    symbol: string[]
  }
  voice: {
    tone: string
    tagline: string
    elevatorPitch: string
    valueProps: string[]
    socialCaptions: string[]
    aboutParagraph: string
  }
  moodboard: string[]
  generatedAt: string
}

