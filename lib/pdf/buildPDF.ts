import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'
import { addColorsSection } from './sections/colors'
import { addTypographySection } from './sections/typography'
import { addLogosSection } from './sections/logos'
import { addVoiceSection } from './sections/voice'

export async function buildCompleteBrandKitPDF(brandSystem: any, brandName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()

  // Helper function to embed images (handles both PNG and JPG)
  const embedImage = async (imageUrl: string): Promise<any> => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
      
      const imageBytes = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') || ''
      
      // Try to determine image type from URL or content type
      if (imageUrl.toLowerCase().includes('.jpg') || imageUrl.toLowerCase().includes('.jpeg') || contentType.includes('jpeg')) {
        return await doc.embedJpg(Buffer.from(imageBytes))
      } else {
        // Default to PNG
        return await doc.embedPng(Buffer.from(imageBytes))
      }
    } catch (error) {
      console.warn('Failed to embed image:', imageUrl, error)
      return null
    }
  }

  // Cover Page
  const coverPage = doc.addPage([612, 792])
  const { width, height } = coverPage.getSize()

  coverPage.drawText(brandName, {
    x: 50,
    y: height - 200,
    size: 48,
    color: rgb(0, 0, 0),
  })

  // Add actual logo if available
  if (brandSystem.logo) {
    const logoImage = await embedImage(brandSystem.logo)
    if (logoImage) {
      const logoDims = logoImage.scale(0.3) // Scale to fit
      coverPage.drawImage(logoImage, {
        x: (width - logoDims.width) / 2,
        y: height - 400,
        width: Math.min(logoDims.width, 200),
        height: Math.min(logoDims.height, 200),
      })
    }
  }

  // Colors Page
  const colorsPage = doc.addPage([612, 792])
  colorsPage.drawText('Brand Colors', {
    x: 50,
    y: height - 100,
    size: 32,
  })

  // Draw actual color swatches
  let yPos = height - 150
  brandSystem.primaryColors?.forEach((color: string, idx: number) => {
    const rgbColor = hexToRgb(color)
    if (rgbColor) {
      colorsPage.drawRectangle({
        x: 50,
        y: yPos - 60,
        width: 100,
        height: 60,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      })
      colorsPage.drawText(color, {
        x: 160,
        y: yPos - 30,
        size: 14,
      })
      yPos -= 80
    }
  })

  // Assets Pages - Embed actual generated assets
  if (brandSystem.assets && brandSystem.assets.length > 0) {
    for (const asset of brandSystem.assets) {
      if (!asset.imageUrl) continue
      
      const assetImage = await embedImage(asset.imageUrl)
      if (!assetImage) continue
      
      const assetPage = doc.addPage([612, 792])
      const assetHeight = assetPage.getSize().height
      
      // Draw asset title
      assetPage.drawText(asset.name || asset.type || 'Brand Asset', {
        x: 50,
        y: assetHeight - 80,
        size: 24,
        color: rgb(0, 0, 0),
      })
      
      // Scale image to fit page
      const imageDims = assetImage.scale(0.8)
      const maxWidth = 500
      const maxHeight = 500
      const scale = Math.min(maxWidth / imageDims.width, maxHeight / imageDims.height, 1)
      
      assetPage.drawImage(assetImage, {
        x: (width - imageDims.width * scale) / 2,
        y: assetHeight - 200 - (imageDims.height * scale),
        width: imageDims.width * scale,
        height: imageDims.height * scale,
      })
    }
  }
  
  // Add Typography Page
  if (brandSystem.primaryFont || brandSystem.secondaryFont) {
    const typographyPage = doc.addPage([612, 792])
    const typoHeight = typographyPage.getSize().height
    
    typographyPage.drawText('Typography', {
      x: 50,
      y: typoHeight - 100,
      size: 32,
      color: rgb(0, 0, 0),
    })
    
    let yPos = typoHeight - 180
    if (brandSystem.primaryFont) {
      typographyPage.drawText('Primary Font', {
        x: 50,
        y: yPos,
        size: 18,
        color: rgb(0.2, 0.2, 0.2),
      })
      typographyPage.drawText(brandSystem.primaryFont, {
        x: 50,
        y: yPos - 30,
        size: 24,
        color: rgb(0, 0, 0),
      })
      yPos -= 100
    }
    
    if (brandSystem.secondaryFont) {
      typographyPage.drawText('Secondary Font', {
        x: 50,
        y: yPos,
        size: 18,
        color: rgb(0.2, 0.2, 0.2),
      })
      typographyPage.drawText(brandSystem.secondaryFont, {
        x: 50,
        y: yPos - 30,
        size: 24,
        color: rgb(0, 0, 0),
      })
    }
  }
  
  // Add Brand Voice/Personality Page
  if (brandSystem.brandPersonality || brandSystem.messaging) {
    const voicePage = doc.addPage([612, 792])
    const voiceHeight = voicePage.getSize().height
    
    voicePage.drawText('Brand Voice & Personality', {
      x: 50,
      y: voiceHeight - 100,
      size: 32,
      color: rgb(0, 0, 0),
    })
    
    let yPos = voiceHeight - 180
    if (brandSystem.brandPersonality) {
      voicePage.drawText('Personality', {
        x: 50,
        y: yPos,
        size: 18,
        color: rgb(0.2, 0.2, 0.2),
      })
      voicePage.drawText(brandSystem.brandPersonality, {
        x: 50,
        y: yPos - 30,
        size: 14,
        color: rgb(0, 0, 0),
      })
      yPos -= 100
    }
    
    if (brandSystem.messaging && brandSystem.messaging.length > 0) {
      voicePage.drawText('Key Messages', {
        x: 50,
        y: yPos,
        size: 18,
        color: rgb(0.2, 0.2, 0.2),
      })
      brandSystem.messaging.slice(0, 5).forEach((msg: string, idx: number) => {
        voicePage.drawText(`• ${msg}`, {
          x: 50,
          y: yPos - 30 - (idx * 25),
          size: 12,
          color: rgb(0, 0, 0),
        })
      })
    }
  }

  return await doc.save()
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : null
}