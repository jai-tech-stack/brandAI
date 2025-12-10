import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'
import { addColorsSection } from './sections/colors'
import { addTypographySection } from './sections/typography'
import { addLogosSection } from './sections/logos'
import { addVoiceSection } from './sections/voice'

export async function buildCompleteBrandKitPDF(brandSystem: any, brandName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()

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
    try {
      const logoResponse = await fetch(brandSystem.logo)
      const logoBytes = await logoResponse.arrayBuffer()
      const logoImage = await doc.embedPng(Buffer.from(logoBytes))
      
      coverPage.drawImage(logoImage, {
        x: 50,
        y: height - 400,
        width: 200,
        height: 200,
      })
    } catch (error) {
      console.warn('Failed to embed logo:', error)
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

  // Assets Pages
  if (brandSystem.assets && brandSystem.assets.length > 0) {
    for (const asset of brandSystem.assets) {
      try {
        const assetPage = doc.addPage([612, 792])
        const assetResponse = await fetch(asset.imageUrl)
        if (!assetResponse.ok) throw new Error('Failed to fetch asset')
        const assetBytes = await assetResponse.arrayBuffer()
        const assetImage = await doc.embedPng(Buffer.from(assetBytes))
        
        assetPage.drawText(asset.name, {
          x: 50,
          y: height - 100,
          size: 24,
        })

        assetPage.drawImage(assetImage, {
          x: 50,
          y: height - 600,
          width: 500,
          height: 400,
        })
      } catch (error) {
        console.warn('Failed to embed asset:', error)
      }
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