import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { buildBrandKitPDF } from '@/lib/pdf/buildPDF'
import { BrandSystem } from '@/lib/generators/generatorTypes'

const exportKitSchema = z.object({
  brandSystem: z.any(),
  brandName: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brandSystem, brandName } = exportKitSchema.parse(body)

    // Build PDF
    const pdfBytes = await buildBrandKitPDF(brandSystem as BrandSystem, brandName)

    // Convert to base64 for response
    const base64 = Buffer.from(pdfBytes).toString('base64')

    // In production, upload to Supabase Storage and return signed URL
    // For now, return base64 data URL
    const dataUrl = `data:application/pdf;base64,${base64}`

    return NextResponse.json({
      success: true,
      data: {
        pdfUrl: dataUrl,
        downloadUrl: dataUrl,
      },
    })
  } catch (error: any) {
    console.error('PDF export error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to export brand kit' },
      { status: 500 }
    )
  }
}

