// app/api/analytics/route.ts
// Analytics API endpoint

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

interface AnalyticsData {
  overview: {
    totalProjects: number
    totalGenerations: number
    totalDownloads: number
    totalViews: number
    avgGenerationTime: number
  }
  topColors: Array<{ color: string; usage: number }>
  topFonts: Array<{ font: string; usage: number }>
  generationTrend: Array<{ date: string; count: number }>
  exportFormats: Array<{ format: string; count: number }>
  stylePreferences: Array<{ style: string; count: number }>
  timeToGenerate: Array<{ range: string; count: number }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    if (!supabase) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (range === '7d') startDate.setDate(now.getDate() - 7)
    else if (range === '30d') startDate.setDate(now.getDate() - 30)
    else if (range === '90d') startDate.setDate(now.getDate() - 90)
    else startDate.setFullYear(2020) // All time

    // Get projects for analytics
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    // Get exports/views from a separate table if it exists, or calculate from projects
    // For now, we'll use mock data for exports/views as they might be tracked separately
    const totalDownloads = 0 // TODO: Track downloads separately
    const totalViews = 0 // TODO: Track views separately

    // Process analytics data
    const analytics = processAnalytics(projects || [], totalDownloads, totalViews)

    return NextResponse.json({ success: true, data: analytics })
  } catch (error: unknown) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

function processAnalytics(
  projects: any[],
  totalDownloads: number,
  totalViews: number
): AnalyticsData {
  const colorMap = new Map<string, number>()
  const fontMap = new Map<string, number>()
  const formatMap = new Map<string, number>()
  const styleMap = new Map<string, number>()
  const dateMap = new Map<string, number>()
  const timeMap = new Map<string, number>()

  let totalGenerations = 0
  let totalTime = 0

  projects.forEach(project => {
    totalGenerations++
    
    // Count colors
    if (project.brand_system?.primaryColors) {
      project.brand_system.primaryColors.forEach((color: string) => {
        colorMap.set(color, (colorMap.get(color) || 0) + 1)
      })
    }
    if (project.brand_system?.secondaryColors) {
      project.brand_system.secondaryColors.forEach((color: string) => {
        colorMap.set(color, (colorMap.get(color) || 0) + 1)
      })
    }
    
    // Count fonts
    if (project.brand_system?.primaryFont) {
      fontMap.set(project.brand_system.primaryFont, (fontMap.get(project.brand_system.primaryFont) || 0) + 1)
    }
    if (project.brand_system?.secondaryFont) {
      fontMap.set(project.brand_system.secondaryFont, (fontMap.get(project.brand_system.secondaryFont) || 0) + 1)
    }
    
    // Count style
    if (project.brand_system?.style) {
      styleMap.set(project.brand_system.style, (styleMap.get(project.brand_system.style) || 0) + 1)
    }
    
    // Count by date
    const date = new Date(project.created_at).toISOString().split('T')[0]
    dateMap.set(date, (dateMap.get(date) || 0) + 1)

    // Estimate generation time (if we had this data, we'd use it)
    // For now, estimate based on project complexity
    const estimatedTime = 30 // seconds
    totalTime += estimatedTime

    // Categorize time ranges
    if (estimatedTime < 30) {
      timeMap.set('< 30s', (timeMap.get('< 30s') || 0) + 1)
    } else if (estimatedTime < 60) {
      timeMap.set('30-60s', (timeMap.get('30-60s') || 0) + 1)
    } else {
      timeMap.set('> 60s', (timeMap.get('> 60s') || 0) + 1)
    }
  })

  // Get export formats (mock data for now - should track separately)
  const exportFormats = [
    { format: 'PDF', count: Math.floor(totalGenerations * 0.6) },
    { format: 'Figma', count: Math.floor(totalGenerations * 0.4) },
  ].filter(f => f.count > 0)

  return {
    overview: {
      totalProjects: projects.length,
      totalGenerations,
      totalDownloads,
      totalViews,
      avgGenerationTime: totalGenerations > 0 ? totalTime / totalGenerations : 0,
    },
    topColors: Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([color, usage]) => ({ color, usage })),
    topFonts: Array.from(fontMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([font, usage]) => ({ font, usage })),
    generationTrend: Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count })),
    exportFormats,
    stylePreferences: Array.from(styleMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([style, count]) => ({ style, count })),
    timeToGenerate: Array.from(timeMap.entries())
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => {
        // Sort by range order
        const order = ['< 30s', '30-60s', '> 60s']
        return order.indexOf(a.range) - order.indexOf(b.range)
      }),
  }
}

