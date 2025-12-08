// Autonomous AI Service for BloomboxAI
// Supports multiple AI providers for true autonomous operation

interface AIImageGenerationOptions {
  prompt: string
  brandColors?: string[]
  style?: string
  size?: '1024x1024' | '1024x1792' | '1792x1024'
}

interface AIImageResult {
  imageUrl: string
  provider: string
  model: string
}

// AI-powered image generation using multiple providers
export async function generateImageWithAI(options: AIImageGenerationOptions): Promise<AIImageResult> {
  const { prompt, brandColors, style, size = '1024x1024' } = options

  // Build enhanced prompt with brand constraints
  let enhancedPrompt = prompt
  
  if (brandColors && brandColors.length > 0) {
    const colorList = brandColors.slice(0, 3).join(', ')
    enhancedPrompt += ` Use these exact brand colors: ${colorList}.`
  }
  
  if (style) {
    enhancedPrompt += ` Design style: ${style}.`
  }
  
  enhancedPrompt += ' Professional quality, on-brand design, perfect brand consistency, high resolution, modern design.'

  // Try OpenAI DALL-E 3 first (most reliable)
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          size: size,
          quality: 'standard',
          n: 1,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data[0] && data.data[0].url) {
          return {
            imageUrl: data.data[0].url,
            provider: 'OpenAI',
            model: 'dall-e-3',
          }
        }
      }
    } catch (error: unknown) {
      console.error('OpenAI DALL-E error:', error)
    }
  }

  // Fallback to Stability AI
  if (process.env.STABILITY_API_KEY) {
    try {
      const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          output_format: 'png',
          aspect_ratio: size === '1024x1024' ? '1:1' : size === '1024x1792' ? '9:16' : '16:9',
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        // In production, upload blob to storage and return URL
        // For now, create object URL
        const imageUrl = URL.createObjectURL(blob)
        return {
          imageUrl,
          provider: 'Stability AI',
          model: 'stable-image-core',
        }
      }
    } catch (error: unknown) {
      console.error('Stability AI error:', error)
    }
  }

  // Fallback to Replicate (supports multiple models)
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'ac732df83cea7fff18b8472768c88ada041dee21bd8a0a8c9ee69fa4b9a6046f', // Flux model
          input: {
            prompt: enhancedPrompt,
            aspect_ratio: size === '1024x1024' ? '1:1' : size === '1024x1792' ? '9:16' : '16:9',
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Poll for completion
        let prediction = data
        while (prediction.status === 'starting' || prediction.status === 'processing') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          })
          prediction = await statusResponse.json()
        }
        
        if (prediction.output && prediction.output[0]) {
          return {
            imageUrl: prediction.output[0],
            provider: 'Replicate',
            model: 'flux',
          }
        }
      }
    } catch (error: unknown) {
      console.error('Replicate error:', error)
    }
  }

  // If no AI service available, throw error (don't return mock)
  throw new Error('No AI image generation service configured. Please set OPENAI_API_KEY, STABILITY_API_KEY, or REPLICATE_API_TOKEN in environment variables.')
}

// AI-powered brand analysis with enhanced messaging and deep context extraction
export async function analyzeBrandWithAI(
  html: string, 
  colors: string[], 
  fonts: string[],
  styleVariation?: string
): Promise<{
  style: string
  brandPersonality: string
  brandTone?: string
  messaging?: string[]
  recommendations: string[]
  emotions?: string[]
  values?: string[]
  targetAudience?: string
}> {
  // Use OpenAI for brand analysis if available
  if (process.env.OPENAI_API_KEY) {
    try {
      // Extract more meaningful content from HTML
      const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : ''
      
      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
      const description = metaDescMatch ? metaDescMatch[1] : ''
      
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)
      const h1s = h1Matches ? h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim()).slice(0, 5) : []
      
      const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)
      const h2s = h2Matches ? h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim()).slice(0, 5) : []
      
      // Extract more context: buttons, CTAs, key phrases
      const buttonMatches = html.match(/<button[^>]*>([\s\S]*?)<\/button>/gi)
      const buttons = buttonMatches ? buttonMatches.map(b => b.replace(/<[^>]+>/g, '').trim()).slice(0, 5) : []
      
      const linkMatches = html.match(/<a[^>]*class=["'][^"']*(?:cta|button|primary|action)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)
      const ctas = linkMatches ? linkMatches.map(l => l.replace(/<[^>]+>/g, '').trim()).slice(0, 5) : []
      
      // Get more context (up to 5000 chars of meaningful content)
      const meaningfulContent = [
        title, 
        description, 
        ...h1s, 
        ...h2s,
        ...buttons,
        ...ctas,
        textContent.substring(0, 4000)
      ].filter(Boolean).join(' | ')
      
      const styleInstruction = styleVariation 
        ? `\n\nSTYLE VARIATION REQUEST: Apply "${styleVariation}" style interpretation while maintaining brand authenticity.`
        : ''
      
      const analysisPrompt = `You are a professional brand identity expert. Analyze this brand accurately based on the actual website data:

BRAND CONTEXT:
- Website Title: ${title || 'Not available'}
- Meta Description: ${description || 'Not available'}
- Main Headings: ${h1s.join(', ') || 'Not available'}
- Subheadings: ${h2s.join(', ') || 'Not available'}
- CTAs/Buttons: ${[...buttons, ...ctas].join(', ') || 'Not available'}
- Website Content Sample: ${meaningfulContent.substring(0, 3500)}
- Extracted Colors: ${colors.length > 0 ? colors.join(', ') : 'Limited color data available'}
- Typography: ${fonts.length > 0 ? fonts.join(', ') : 'Standard fonts detected'}${styleInstruction}

ANALYSIS REQUIREMENTS:
Analyze the ACTUAL brand identity from the provided data. Be specific and accurate based on what you see, not generic.

Provide:
1. Brand style: 3-4 specific words describing the ACTUAL visual aesthetic you observe (e.g., "Modern Minimalist", "Bold Tech", "Elegant Luxury")
2. Brand personality: 2-3 words describing the ACTUAL brand character based on content and design
3. Brand tone: 2-3 words for messaging tone that matches the brand (professional, friendly, bold, etc.)
4. Messaging suggestions: 2-3 specific brand messaging recommendations based on actual content
5. Design recommendations: 2-3 specific design recommendations based on actual brand elements
6. Emotions: 3-5 emotions the brand evokes (e.g., "trust", "excitement", "calm", "confidence")
7. Values: 3-5 core brand values inferred from content (e.g., "innovation", "authenticity", "quality")
8. Target Audience: Brief description of primary audience based on content and design

IMPORTANT: Base your analysis on the ACTUAL website content and design, not generic assumptions. If data is limited, acknowledge that in your recommendations.

Format as JSON only: { 
  "style": "...", 
  "brandPersonality": "...", 
  "brandTone": "...",
  "messaging": ["...", "..."],
  "recommendations": ["...", "..."],
  "emotions": ["...", "..."],
  "values": ["...", "..."],
  "targetAudience": "..."
}`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a brand identity expert. Analyze brands and provide concise, professional insights.',
            },
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
          temperature: 0.3, // Lower temperature for more accurate, consistent results
          max_tokens: 500, // More tokens for detailed analysis
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content
        if (content) {
          try {
            // Try to parse JSON from the response
            let jsonContent = content.trim()
            // Remove markdown code blocks if present
            if (jsonContent.startsWith('```')) {
              jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            }
            const analysis = JSON.parse(jsonContent)
            return {
              style: analysis.style || 'Modern, Clean, Professional',
              brandPersonality: analysis.brandPersonality || 'Professional',
              brandTone: analysis.brandTone || analysis.brandPersonality || 'Professional',
              messaging: analysis.messaging || analysis.recommendations || ['Maintain consistent brand voice', 'Use clear and concise messaging'],
              recommendations: analysis.recommendations || ['Maintain consistent color usage', 'Use brand fonts across all assets'],
              emotions: analysis.emotions || [],
              values: analysis.values || [],
              targetAudience: analysis.targetAudience || 'General audience',
            }
          } catch (e) {
            console.warn('Failed to parse AI analysis JSON:', e)
            // Try to extract style from text if JSON parsing fails
            const styleMatch = content.match(/style["\s:]+([^",\n]+)/i)
            const personalityMatch = content.match(/personality["\s:]+([^",\n]+)/i)
            if (styleMatch || personalityMatch) {
              return {
                style: styleMatch?.[1]?.trim() || 'Modern, Clean, Professional',
                brandPersonality: personalityMatch?.[1]?.trim() || 'Professional',
                recommendations: ['Maintain consistent color usage', 'Use brand fonts across all assets'],
              }
            }
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.warn('OpenAI API error:', response.status, errorData)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('AI brand analysis error:', errorMessage)
      // Re-throw to let caller handle fallback
      throw err
    }
  }

  // Fallback to rule-based analysis
  return {
    style: styleVariation ? `${styleVariation} Professional` : 'Modern, Clean, Professional',
    brandPersonality: 'Professional',
    brandTone: 'Professional',
    messaging: ['Maintain consistent brand voice', 'Use clear and concise messaging'],
    recommendations: ['Maintain consistent color usage', 'Use brand fonts across all assets'],
    emotions: ['trust', 'professionalism'],
    values: ['quality', 'consistency'],
    targetAudience: 'General audience',
  }
}

// Autonomous prompt enhancement with AI
export async function enhancePromptWithAI(userPrompt: string, brandKit: any): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const enhancementPrompt = `Enhance this design prompt for brand asset generation:

User Prompt: "${userPrompt}"

Brand Context:
- Colors: ${brandKit.colors?.join(', ') || 'Not specified'}
- Typography: ${brandKit.typography?.join(', ') || 'Not specified'}
- Style: ${brandKit.style || 'Not specified'}

Create an enhanced prompt that:
1. Maintains the user's intent
2. Incorporates brand colors, fonts, and style
3. Ensures perfect brand consistency
4. Is optimized for AI image generation

Return only the enhanced prompt, no explanations.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at creating prompts for AI image generation that maintain brand consistency.',
            },
            {
              role: 'user',
              content: enhancementPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const enhanced = data.choices[0]?.message?.content?.trim()
        if (enhanced) {
          return enhanced
        }
      }
    } catch (error: unknown) {
      console.error('AI prompt enhancement error:', error)
    }
  }

  // Fallback to rule-based enhancement
  let enhanced = userPrompt
  if (brandKit.colors?.length > 0) {
    enhanced += ` Use brand colors: ${brandKit.colors.slice(0, 3).join(', ')}.`
  }
  if (brandKit.style) {
    enhanced += ` Style: ${brandKit.style}.`
  }
  enhanced += ' Ensure perfect brand consistency and professional quality.'
  return enhanced
}

