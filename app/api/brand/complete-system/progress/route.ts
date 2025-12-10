// Real-time progress updates for brand generation
// Uses Server-Sent Events (SSE) for streaming progress

import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return new Response('Job ID required', { status: 400 })
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      const sendProgress = (step: string, progress: number, message: string) => {
        const data = JSON.stringify({ step, progress, message, timestamp: Date.now() })
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      try {
        // Simulate progress updates
        // In production, this would check a job queue or database for actual progress
        sendProgress('analyzing', 10, 'Analyzing website structure...')
        await new Promise(resolve => setTimeout(resolve, 1000))

        sendProgress('extracting', 30, 'Extracting colors and fonts...')
        await new Promise(resolve => setTimeout(resolve, 1500))

        sendProgress('analyzing', 50, 'Analyzing brand personality...')
        await new Promise(resolve => setTimeout(resolve, 1000))

        sendProgress('generating', 70, 'Generating brand assets...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        sendProgress('finalizing', 90, 'Finalizing brand system...')
        await new Promise(resolve => setTimeout(resolve, 500))

        sendProgress('complete', 100, 'Brand system ready!')
        
        controller.close()
      } catch (error) {
        const errorData = JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Progress stream failed',
          timestamp: Date.now()
        })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

