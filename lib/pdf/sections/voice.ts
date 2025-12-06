import { PDFDocument, rgb } from 'pdf-lib'
import { BrandSystem } from '@/lib/generators/generatorTypes'

/**
 * Add voice and messaging section to PDF
 */
export async function addVoiceSection(
  doc: PDFDocument,
  brandSystem: BrandSystem,
  startY: number
): Promise<number> {
  const pages = doc.getPages()
  const page = pages[0]
  const { width, height } = page.getSize()

  let y = startY
  const margin = 50
  const maxWidth = width - margin * 2

  // Title
  page.drawText('Brand Voice & Messaging', {
    x: margin,
    y: height - y,
    size: 24,
    color: rgb(0, 0, 0),
  })
  y += 40

  // Tone
  page.drawText('Brand Tone', {
    x: margin,
    y: height - y,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  })
  y += 25

  page.drawText(brandSystem.voice.tone, {
    x: margin,
    y: height - y,
    size: 14,
    color: rgb(0, 0, 0),
  })
  y += 35

  // Tagline
  page.drawText('Tagline', {
    x: margin,
    y: height - y,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  })
  y += 25

  page.drawText(brandSystem.voice.tagline, {
    x: margin,
    y: height - y,
    size: 14,
    color: rgb(0, 0, 0),
  })
  y += 35

  // Elevator Pitch
  page.drawText('Elevator Pitch', {
    x: margin,
    y: height - y,
    size: 16,
    color: rgb(0.2, 0.2, 0.2),
  })
  y += 25

  const pitchLines = wrapText(brandSystem.voice.elevatorPitch, maxWidth, 12)
  pitchLines.forEach((line) => {
    page.drawText(line, {
      x: margin,
      y: height - y,
      size: 12,
      color: rgb(0.3, 0.3, 0.3),
    })
    y += 15
  })
  y += 20

  // Value Props
  if (brandSystem.voice.valueProps.length > 0) {
    page.drawText('Value Propositions', {
      x: margin,
      y: height - y,
      size: 16,
      color: rgb(0.2, 0.2, 0.2),
    })
    y += 25

    brandSystem.voice.valueProps.forEach((prop) => {
      page.drawText(`• ${prop}`, {
        x: margin,
        y: height - y,
        size: 12,
        color: rgb(0.3, 0.3, 0.3),
      })
      y += 18
    })
    y += 10
  }

  return y
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    // Approximate width (this is simplified - in production, use actual text measurement)
    const estimatedWidth = testLine.length * (fontSize * 0.6)

    if (estimatedWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

