import { WebsiteAnalysis } from '../analyzer/extractorTypes'
import { generateColors } from '../generators/generateColors'
import { generateTypography } from '../generators/generateTypography'
import { generateVoice } from '../generators/generateVoice'
import { generateLogos } from '../generators/generateLogos'
import { generateMoodboard } from '../generators/generateMoodboard'
import { BrandSystem } from '../generators/generatorTypes'

type AgentStatus = 'completed' | 'fallback' | 'failed'

export interface AgentStepTrace {
  agent: string
  status: AgentStatus
  durationMs: number
  fallbackUsed: boolean
  error?: string
}

export interface AgenticPipelineResult {
  brandSystem: BrandSystem
  process: {
    completedAt: string
    totalDurationMs: number
    steps: AgentStepTrace[]
  }
}

function getBrandNameFromAnalysis(analysis: WebsiteAnalysis): string {
  return (
    analysis.text.title?.split('|')[0].trim() ||
    analysis.text.headings.h1[0] ||
    analysis.metadata.title?.split('|')[0].trim() ||
    new URL(analysis.url).hostname.replace('www.', '').split('.')[0]
  )
}

async function runAgentStep<T>(
  agent: string,
  fn: () => Promise<T> | T,
  fallbackFn?: () => Promise<T> | T
): Promise<{ output: T; trace: AgentStepTrace }> {
  const startedAt = Date.now()

  try {
    const output = await fn()
    return {
      output,
      trace: {
        agent,
        status: 'completed',
        durationMs: Date.now() - startedAt,
        fallbackUsed: false,
      },
    }
  } catch (error: unknown) {
    if (!fallbackFn) {
      return {
        output: undefined as T,
        trace: {
          agent,
          status: 'failed',
          durationMs: Date.now() - startedAt,
          fallbackUsed: false,
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }

    const fallbackStartedAt = Date.now()
    const output = await fallbackFn()
    return {
      output,
      trace: {
        agent,
        status: 'fallback',
        durationMs: Date.now() - fallbackStartedAt,
        fallbackUsed: true,
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export async function generateBrandSystemAgentic(
  analysis: WebsiteAnalysis
): Promise<AgenticPipelineResult> {
  const pipelineStartedAt = Date.now()
  const steps: AgentStepTrace[] = []

  const brandName = getBrandNameFromAnalysis(analysis)

  const colorAgent = await runAgentStep('ColorAgent', () => generateColors(analysis.colors))
  steps.push(colorAgent.trace)

  const typographyAgent = await runAgentStep('TypographyAgent', () =>
    generateTypography(analysis.fonts)
  )
  steps.push(typographyAgent.trace)

  const voiceAgent = await runAgentStep('VoiceAgent', () =>
    generateVoice(analysis.text, analysis.metadata.title)
  )
  steps.push(voiceAgent.trace)

  const visualAgent = await runAgentStep(
    'VisualIdentityAgent',
    async () => {
      const [logos, moodboard] = await Promise.all([
        generateLogos(brandName, analysis.colors, analysis.text, analysis.metadata.title),
        generateMoodboard(analysis.colors, analysis.text, analysis.metadata.title),
      ])
      return { logos, moodboard }
    },
    async () => ({
      logos: {
        icon: [],
        horizontal: [],
        badge: [],
        symbol: [],
      },
      moodboard: [],
    })
  )
  steps.push(visualAgent.trace)

  const qualityAgent = await runAgentStep('QualityGateAgent', () => {
    const ensuredLogos = {
      icon: visualAgent.output.logos.icon ?? [],
      horizontal: visualAgent.output.logos.horizontal ?? [],
      badge: visualAgent.output.logos.badge ?? [],
      symbol: visualAgent.output.logos.symbol ?? [],
    }

    const brandSystem: BrandSystem = {
      colors: colorAgent.output,
      typography: typographyAgent.output,
      voice: voiceAgent.output,
      logos: ensuredLogos,
      moodboard: visualAgent.output.moodboard ?? [],
      generatedAt: new Date().toISOString(),
    }

    return brandSystem
  })
  steps.push(qualityAgent.trace)

  return {
    brandSystem: qualityAgent.output,
    process: {
      completedAt: new Date().toISOString(),
      totalDurationMs: Date.now() - pipelineStartedAt,
      steps,
    },
  }
}
