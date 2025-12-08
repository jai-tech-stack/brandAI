import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Mark route as dynamic to prevent static analysis during build
export const dynamic = 'force-dynamic'

const analyzeSchema = z.object({
  url: z.string().url(),
})

// Initialize Supabase (will be configured via env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = analyzeSchema.parse(body)

    // Dynamically import to prevent build-time execution
    const { analyzeWebsite } = await import('@/lib/analyzer/analyzeWebsite')
    
    // Analyze website
    const analysis = await analyzeWebsite(url)

    // Upload screenshot to Supabase Storage if configured
    let screenshotUrl = ''
    if (supabase && analysis.screenshotUrl === '') {
      try {
        // Note: Screenshot upload will be handled separately
        // For now, we'll store the analysis without screenshot
        screenshotUrl = '' // Placeholder
      } catch (error: unknown) {
        console.warn('Failed to upload screenshot:', error)
      }
    }

    // Save analysis to database if Supabase is configured
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            url: analysis.url,
            analysis: analysis,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          console.warn('Failed to save analysis to database:', error)
        } else {
          return NextResponse.json({
            success: true,
            data: {
              ...analysis,
              screenshotUrl,
              projectId: data.id,
            },
          })
        }
      } catch (error: unknown) {
        console.warn('Database save failed:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        screenshotUrl,
      },
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze website' },
      { status: 500 }
    )
  }
}

