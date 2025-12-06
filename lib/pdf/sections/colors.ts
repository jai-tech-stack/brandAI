import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'

/**
 * Add colors section to PDF
 */
export async function addColorsSection(
  doc: PDFDocument,
  brandSystem: BrandSystem,
  startY: number
): Promise<number> {
  const pages = doc.getPages()
  const page = pages[0]
  const { width, height } = page.getSize()

  let y = startY
  const margin = 50
  const pageWidth = width - margin * 2

  // Title
  page.drawText('Brand Colors', {
    x: margin,
    y: height - y,
    size: 24,
    color: rgb(0, 0, 0),
  })
  y += 40

  // Primary Colors
  page.drawText('Primary Colors', {
    x: margin,
    y: height - y,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  })
  y += 25

  const colorBoxSize = 60
  const colorsPerRow = 3
  let xOffset = margin

  brandSystem.colors.primary.forEach((color, index) => {
    if (index > 0 && index % colorsPerRow === 0) {
      xOffset = margin
      y += colorBoxSize + 30
    }

    const rgbColor = hexToRgb(color)
    if (rgbColor) {
      page.drawRectangle({
        x: xOffset,
        y: height - y - colorBoxSize,
        width: colorBoxSize,
        height: colorBoxSize,
        color: rgb(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      })
    }

    page.drawText(color, {
      x: xOffset,
      y: height - y - colorBoxSize - 20,
      size: 10,
      color: rgb(0.4, 0.4, 0.4),
    })

    xOffset += colorBoxSize + 30
  })

  y += colorBoxSize + 50

  // Secondary Colors
  if (brandSystem.colors.secondary.length > 0) {
    page.drawText('Secondary Colors', {
      x: margin,
      y: height - y,
      size: 16,
      color: rgb(0.2, 0.2, 0.2),
    })
    y += 25

    xOffset = margin
    brandSystem.colors.secondary.forEach((color, index) => {
      if (index > 0 && index % colorsPerRow === 0) {
        xOffset = margin
        y += colorBoxSize + 30
      }

      const rgbColor = hexToRgb(color)
      if (rgbColor) {
        page.drawRectangle({
          x: xOffset,
          y: height - y - colorBoxSize,
          width: colorBoxSize,
          height: colorBoxSize,
          color: rgb(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255),
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1,
        })
      }

      page.drawText(color, {
        x: xOffset,
        y: height - y - colorBoxSize - 20,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      })

      xOffset += colorBoxSize + 30
    })

    y += colorBoxSize + 50
  }

  return y
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

