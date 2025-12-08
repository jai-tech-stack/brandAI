import { NextRequest, NextResponse } from 'next/server'

// Mark route as fully dynamic to prevent Vercel build errors
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export async function POST(request: NextRequest) {
  // Prevent static analysis during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json(
      { error: 'This route is not available during build' },
      { status: 503 }
    )
  }

  try {
    // Dynamic imports to prevent build-time execution
    const { z } = await import('zod')
    const { buildBrandKitPDF } = await import('@/lib/pdf/buildPDF')
    
    const exportKitSchema = z.object({
      brandSystem: z.any(),
      brandName: z.string(),
    })

    const body = await request.json()
    const { brandSystem, brandName } = exportKitSchema.parse(body)

    // Build PDF
    const pdfBytes = await buildBrandKitPDF(brandSystem, brandName)

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
  } catch (error: unknown) {
    console.error('PDF export error:', error)

    // Dynamic import for error handling
    const { z } = await import('zod')
    
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

