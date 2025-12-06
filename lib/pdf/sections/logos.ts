import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'

/**
 * Add logos section to PDF
 */
export async function addLogosSection(
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
  page.drawText('Logo Variations', {
    x: margin,
    y: height - y,
    size: 24,
    color: rgb(0, 0, 0),
  })
  y += 40

  // Note: Logo images would need to be embedded
  // For now, we'll just list the logo types
  const logoTypes = [
    { name: 'Icon Logo', urls: brandSystem.logos.icon },
    { name: 'Horizontal Logo', urls: brandSystem.logos.horizontal },
    { name: 'Badge Logo', urls: brandSystem.logos.badge },
    { name: 'Symbol Logo', urls: brandSystem.logos.symbol },
  ]

  logoTypes.forEach((logoType) => {
    if (logoType.urls.length > 0) {
      page.drawText(logoType.name, {
        x: margin,
        y: height - y,
        size: 14,
        color: rgb(0.2, 0.2, 0.2),
      })
      y += 20

      logoType.urls.forEach((url) => {
        page.drawText(`• ${url}`, {
          x: margin + 20,
          y: height - y,
          size: 10,
          color: rgb(0.4, 0.4, 0.4),
        })
        y += 15
      })
      y += 10
    }
  })

  return y
}

