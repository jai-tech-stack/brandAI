import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'

/**
 * Add typography section to PDF
 */
export async function addTypographySection(
  doc: PDFDocument,
  brandSystem: BrandSystem,
  startY: number
): Promise<number> {
  const pages = doc.getPages()
  const page = pages[0]
  const { width, height } = page.getSize()

  let y = startY
  const margin = 50

  // Title
  page.drawText('Typography', {
    x: margin,
    y: height - y,
    size: 24,
    color: rgb(0, 0, 0),
  })
  y += 40

  // Primary Font
  page.drawText('Primary Font', {
    x: margin,
    y: height - y,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  })
  y += 25

  page.drawText(brandSystem.typography.primary.name, {
    x: margin,
    y: height - y,
    size: 32,
    color: rgb(0, 0, 0),
  })
  y += 40

  page.drawText(`Weights: ${brandSystem.typography.primary.weights.join(', ')}`, {
    x: margin,
    y: height - y,
    size: 12,
    color: rgb(0.4, 0.4, 0.4),
  })
  y += 30

  // Secondary Font
  if (brandSystem.typography.secondary.name) {
    page.drawText('Secondary Font', {
      x: margin,
      y: height - y,
      size: 16,
      color: rgb(0.2, 0.2, 0.2),
    })
    y += 25

    page.drawText(brandSystem.typography.secondary.name, {
      x: margin,
      y: height - y,
      size: 24,
      color: rgb(0, 0, 0),
    })
    y += 40
  }

  return y
}

