import { BrandText } from '../analyzer/extractorTypes'
import { BrandSystem } from './generatorTypes'

/**
 * Generate brand voice and messaging using AI (or fallback to rule-based)
 */
export async function generateVoice(
  text: BrandText,
  brandStyle?: string
): Promise<BrandSystem['voice']> {
  // If OpenAI is available, use AI
  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateVoiceWithAI(text, brandStyle)
    } catch (error) {
      console.warn('AI voice generation failed, using fallback:', error)
    }
  }

  // Fallback to rule-based generation
  return generateVoiceFallback(text, brandStyle)
}

async function generateVoiceWithAI(
  text: BrandText,
  brandStyle?: string
): Promise<BrandSystem['voice']> {
  const headings = [
    ...text.headings.h1,
    ...text.headings.h2,
    ...text.headings.h3,
  ].join(', ')

  const content = text.paragraphs.slice(0, 3).join(' ')

  const prompt = `Analyze this brand content and generate brand voice and messaging:

Headings: ${headings}
Content: ${content}
Brand Style: ${brandStyle || 'Professional'}

Provide:
1. Brand tone (2-3 words)
2. Tagline (short, memorable)
3. Elevator pitch (1-2 sentences)
4. Value propositions (3-5 short points)
5. Social media captions (5 engaging captions)
6. About paragraph (2-3 sentences)

Format as JSON:
{
  "tone": "...",
  "tagline": "...",
  "elevatorPitch": "...",
  "valueProps": ["...", "..."],
  "socialCaptions": ["...", "..."],
  "aboutParagraph": "..."
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a brand voice expert. Generate compelling brand messaging that matches the brand style.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  })

  if (response.ok) {
    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (content) {
      try {
        let jsonContent = content.trim()
        if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        }
        const parsed = JSON.parse(jsonContent)
        return {
          tone: parsed.tone || 'Professional',
          tagline: parsed.tagline || 'Innovation meets excellence',
          elevatorPitch: parsed.elevatorPitch || 'We deliver exceptional value',
          valueProps: parsed.valueProps || ['Quality', 'Innovation', 'Excellence'],
          socialCaptions: parsed.socialCaptions || [],
          aboutParagraph: parsed.aboutParagraph || 'We are committed to excellence.',
        }
      } catch (e) {
        console.warn('Failed to parse AI response:', e)
      }
    }
  }

  throw new Error('AI generation failed')
}

function generateVoiceFallback(
  text: BrandText,
  brandStyle?: string
): BrandSystem['voice'] {
  const firstHeading = text.headings.h1[0] || text.headings.h2[0] || 'Brand'
  const firstParagraph = text.paragraphs[0] || 'We deliver exceptional value.'

  return {
    tone: brandStyle?.split(',')[0] || 'Professional',
    tagline: firstHeading.length > 50 ? firstHeading.substring(0, 50) : firstHeading,
    elevatorPitch: firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph,
    valueProps: text.keywords.slice(0, 5).map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    socialCaptions: [
      `Discover ${firstHeading}`,
      `Join us on our journey`,
      `Experience the difference`,
      `Innovation starts here`,
      `Your success is our mission`,
    ],
    aboutParagraph: firstParagraph,
  }
}

