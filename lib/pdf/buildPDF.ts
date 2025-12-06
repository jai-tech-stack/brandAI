import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'
import { addColorsSection } from './sections/colors'
import { addTypographySection } from './sections/typography'
import { addLogosSection } from './sections/logos'
import { addVoiceSection } from './sections/voice'

/**
 * Build complete brand kit PDF
 */
export async function buildBrandKitPDF(
  brandSystem: BrandSystem,
  brandName: string
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()

  // Add cover page
  const coverPage = doc.addPage([612, 792]) // US Letter size
  const { width, height } = coverPage.getSize()

  // Cover title
  coverPage.drawText(brandName, {
    x: 50,
    y: height - 200,
    size: 48,
    color: rgb(0, 0, 0),
  })

  coverPage.drawText('Brand Kit', {
    x: 50,
    y: height - 280,
    size: 32,
    color: rgb(0.3, 0.3, 0.3),
  })

  coverPage.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 320,
    size: 12,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Add content pages
  let currentY = 50

  // Colors section
  currentY = await addColorsSection(doc, brandSystem, currentY)

  // If we're running out of space, add a new page
  if (currentY > height - 100) {
    doc.addPage([612, 792])
    currentY = 50
  }

  // Typography section
  currentY = await addTypographySection(doc, brandSystem, currentY)

  if (currentY > height - 100) {
    doc.addPage([612, 792])
    currentY = 50
  }

  // Logos section
  currentY = await addLogosSection(doc, brandSystem, currentY)

  if (currentY > height - 100) {
    doc.addPage([612, 792])
    currentY = 50
  }

  // Voice section
  await addVoiceSection(doc, brandSystem, currentY)

  // Generate PDF bytes
  const pdfBytes = await doc.save()

  return pdfBytes
}

