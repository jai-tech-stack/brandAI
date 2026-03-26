import { WebsiteAnalysis } from '../analyzer/extractorTypes'

export interface StrategistInput {
  analysis: WebsiteAnalysis
  businessContext?: {
    offer?: string
    goals?: string[]
    targetMarket?: string
    differentiators?: string[]
    constraints?: string[]
  }
}

export interface StrategistDeliverable {
  brandCore: {
    brandName: string
    oneLiner: string
    mission: string
    vision: string
  }
  audience: {
    primaryPersona: {
      name: string
      profile: string
      pains: string[]
      desiredOutcomes: string[]
    }
    secondaryPersona: {
      name: string
      profile: string
      pains: string[]
      desiredOutcomes: string[]
    }
  }
  positioning: {
    statement: string
    category: string
    frameOfReference: string
    uniqueValue: string
    reasonToBelieve: string[]
  }
  messaging: {
    pillars: Array<{
      title: string
      message: string
      proofPoints: string[]
    }>
    taglineOptions: string[]
    elevatorPitch: string
  }
  goToMarket: {
    channelPriorities: string[]
    contentAngles: string[]
    offerHooks: string[]
    ninetyDayPlan: string[]
  }
}

type AgentStatus = 'completed' | 'fallback' | 'failed'

export interface FlowStepTrace {
  id: string
  name: string
  status: AgentStatus
  durationMs: number
  fallbackUsed: boolean
  error?: string
}

export interface StrategistFlowResult {
  deliverable: StrategistDeliverable
  process: {
    flow: {
      nodes: Array<{ id: string; label: string }>
      edges: Array<{ from: string; to: string }>
    }
    steps: FlowStepTrace[]
    completedAt: string
    totalDurationMs: number
  }
}

function extractBrandName(analysis: WebsiteAnalysis): string {
  return (
    analysis.text.title?.split('|')[0].trim() ||
    analysis.text.headings.h1[0] ||
    analysis.metadata.title?.split('|')[0].trim() ||
    new URL(analysis.url).hostname.replace('www.', '').split('.')[0]
  )
}

function deriveOneLiner(analysis: WebsiteAnalysis): string {
  const source = analysis.text.metaDescription || analysis.text.paragraphs[0] || ''
  if (!source) return 'Build a brand customers remember and trust.'
  return source.length > 160 ? `${source.slice(0, 157)}...` : source
}

function deriveKeywords(analysis: WebsiteAnalysis): string[] {
  return analysis.text.keywords.filter(Boolean).slice(0, 8)
}

function parseJsonResponse<T>(content: string): T | null {
  try {
    let jsonContent = content.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }
    return JSON.parse(jsonContent) as T
  } catch {
    return null
  }
}

async function askOpenAIJson<T>(prompt: string): Promise<T | null> {
  if (!process.env.OPENAI_API_KEY) return null

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        temperature: 0.3,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content:
              'You are an elite brand strategist. Return strict JSON only with no markdown wrappers.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) return null
    return parseJsonResponse<T>(content)
  } catch {
    return null
  }
}

async function runStep<T>(
  id: string,
  name: string,
  action: () => Promise<T> | T,
  fallback: () => Promise<T> | T
): Promise<{ output: T; trace: FlowStepTrace }> {
  const startedAt = Date.now()
  try {
    const output = await action()
    return {
      output,
      trace: {
        id,
        name,
        status: 'completed',
        durationMs: Date.now() - startedAt,
        fallbackUsed: false,
      },
    }
  } catch (error: unknown) {
    const output = await fallback()
    return {
      output,
      trace: {
        id,
        name,
        status: 'fallback',
        durationMs: Date.now() - startedAt,
        fallbackUsed: true,
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export async function runBrandStrategistFlow(input: StrategistInput): Promise<StrategistFlowResult> {
  const flowStartedAt = Date.now()
  const steps: FlowStepTrace[] = []
  const { analysis, businessContext } = input

  const intake = await runStep(
    'intake-agent',
    'Intake Agent',
    () => {
      const brandName = extractBrandName(analysis)
      const oneLiner = deriveOneLiner(analysis)
      const keywords = deriveKeywords(analysis)
      return {
        brandName,
        oneLiner,
        keywords,
        offer: businessContext?.offer || 'Brand strategy and design services',
        goals: businessContext?.goals || ['Increase awareness', 'Improve conversion'],
      }
    },
    () => ({
      brandName: 'Brand',
      oneLiner: 'Build a stronger market position.',
      keywords: ['branding', 'strategy'],
      offer: 'Brand strategy services',
      goals: ['Increase awareness'],
    })
  )
  steps.push(intake.trace)

  const audience = await runStep(
    'audience-agent',
    'Audience Agent',
    async () => {
      const result = await askOpenAIJson<StrategistDeliverable['audience']>(`Using this context, produce audience personas JSON.
Brand: ${intake.output.brandName}
One-liner: ${intake.output.oneLiner}
Keywords: ${intake.output.keywords.join(', ')}
Market: ${businessContext?.targetMarket || 'General digital-first market'}
Return JSON:
{
  "primaryPersona": { "name": "...", "profile": "...", "pains": ["..."], "desiredOutcomes": ["..."] },
  "secondaryPersona": { "name": "...", "profile": "...", "pains": ["..."], "desiredOutcomes": ["..."] }
}`)
      if (!result) throw new Error('AI audience generation unavailable')
      return result
    },
    () => ({
      primaryPersona: {
        name: 'Growth-Minded Founder',
        profile: 'Leads a small team and needs clear market differentiation.',
        pains: ['Unclear brand position', 'Inconsistent messaging'],
        desiredOutcomes: ['Stronger trust', 'Higher conversion from traffic'],
      },
      secondaryPersona: {
        name: 'Marketing Manager',
        profile: 'Owns content and campaigns with limited design resources.',
        pains: ['Slow creative cycles', 'Weak campaign performance'],
        desiredOutcomes: ['Reusable messaging framework', 'Better campaign ROI'],
      },
    })
  )
  steps.push(audience.trace)

  const positioning = await runStep(
    'positioning-agent',
    'Positioning Agent',
    async () => {
      const result = await askOpenAIJson<StrategistDeliverable['positioning']>(`Create a positioning framework in JSON.
Brand: ${intake.output.brandName}
Offer: ${intake.output.offer}
Goals: ${intake.output.goals.join(', ')}
Differentiators: ${(businessContext?.differentiators || intake.output.keywords).join(', ')}
Return JSON:
{
  "statement": "...",
  "category": "...",
  "frameOfReference": "...",
  "uniqueValue": "...",
  "reasonToBelieve": ["...", "...", "..."]
}`)
      if (!result) throw new Error('AI positioning generation unavailable')
      return result
    },
    () => ({
      statement:
        `For growth-focused teams, ${intake.output.brandName} is the brand strategy partner that turns vague messaging into clear market positioning.`,
      category: 'Brand Strategy SaaS',
      frameOfReference: 'Digital-first brand operating system',
      uniqueValue: 'Combines strategic clarity with execution-ready messaging assets.',
      reasonToBelieve: [
        'Built from real brand inputs',
        'Agentic workflow with consistent outputs',
        'Reusable messaging across channels',
      ],
    })
  )
  steps.push(positioning.trace)

  const messaging = await runStep(
    'messaging-agent',
    'Messaging Agent',
    async () => {
      const result = await askOpenAIJson<StrategistDeliverable['messaging']>(`Build messaging architecture JSON.
Positioning Statement: ${positioning.output.statement}
Primary Persona: ${audience.output.primaryPersona.profile}
Return JSON:
{
  "pillars": [
    { "title": "...", "message": "...", "proofPoints": ["...", "..."] },
    { "title": "...", "message": "...", "proofPoints": ["...", "..."] },
    { "title": "...", "message": "...", "proofPoints": ["...", "..."] }
  ],
  "taglineOptions": ["...", "...", "..."],
  "elevatorPitch": "..."
}`)
      if (!result) throw new Error('AI messaging generation unavailable')
      return result
    },
    () => ({
      pillars: [
        {
          title: 'Clarity',
          message: 'Turn complex offers into simple, persuasive narratives.',
          proofPoints: ['Clear positioning statements', 'Audience-aligned messaging'],
        },
        {
          title: 'Consistency',
          message: 'Keep brand voice unified across every channel.',
          proofPoints: ['Messaging pillars', 'Voice guidance'],
        },
        {
          title: 'Conversion',
          message: 'Translate brand strategy into business outcomes.',
          proofPoints: ['Offer hooks', 'Campaign-ready copy angles'],
        },
      ],
      taglineOptions: [
        'Positioned to Win',
        'Brand Clarity That Converts',
        'From Strategy to Signal',
      ],
      elevatorPitch:
        `${intake.output.brandName} helps teams define sharp positioning, build consistent messaging, and activate brand strategy that drives growth.`,
    })
  )
  steps.push(messaging.trace)

  const execution = await runStep(
    'execution-agent',
    'Execution Agent',
    async () => {
      const result = await askOpenAIJson<StrategistDeliverable['goToMarket']>(`Create a 90-day GTM action plan JSON.
Offer: ${intake.output.offer}
Goals: ${intake.output.goals.join(', ')}
Persona Pains: ${audience.output.primaryPersona.pains.join(', ')}
Return JSON:
{
  "channelPriorities": ["...", "...", "..."],
  "contentAngles": ["...", "...", "..."],
  "offerHooks": ["...", "...", "..."],
  "ninetyDayPlan": ["Week 1-2: ...", "Week 3-4: ...", "Week 5-8: ...", "Week 9-12: ..."]
}`)
      if (!result) throw new Error('AI GTM generation unavailable')
      return result
    },
    () => ({
      channelPriorities: ['LinkedIn', 'Website SEO', 'Email'],
      contentAngles: [
        'Before/after brand transformation',
        'Positioning teardown content',
        'Proof-led case studies',
      ],
      offerHooks: ['Free brand clarity audit', 'Messaging sprint', 'Positioning workshop'],
      ninetyDayPlan: [
        'Week 1-2: Finalize positioning and messaging architecture',
        'Week 3-4: Publish core website copy and lead magnet',
        'Week 5-8: Launch channel-specific campaigns and case studies',
        'Week 9-12: Optimize based on conversion and engagement data',
      ],
    })
  )
  steps.push(execution.trace)

  const deliverable: StrategistDeliverable = {
    brandCore: {
      brandName: intake.output.brandName,
      oneLiner: intake.output.oneLiner,
      mission: `Help ${audience.output.primaryPersona.name.toLowerCase()} teams build memorable brands that grow.`,
      vision: 'Become the most trusted strategic brand operating system for modern teams.',
    },
    audience: audience.output,
    positioning: positioning.output,
    messaging: messaging.output,
    goToMarket: execution.output,
  }

  return {
    deliverable,
    process: {
      flow: {
        nodes: [
          { id: 'intake-agent', label: 'Intake Agent' },
          { id: 'audience-agent', label: 'Audience Agent' },
          { id: 'positioning-agent', label: 'Positioning Agent' },
          { id: 'messaging-agent', label: 'Messaging Agent' },
          { id: 'execution-agent', label: 'Execution Agent' },
        ],
        edges: [
          { from: 'intake-agent', to: 'audience-agent' },
          { from: 'intake-agent', to: 'positioning-agent' },
          { from: 'audience-agent', to: 'messaging-agent' },
          { from: 'positioning-agent', to: 'messaging-agent' },
          { from: 'messaging-agent', to: 'execution-agent' },
        ],
      },
      steps,
      completedAt: new Date().toISOString(),
      totalDurationMs: Date.now() - flowStartedAt,
    },
  }
}
