'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, Palette, Type, Image as ImageIcon, Download, Sparkles, Layers, FileText, Instagram, Presentation, ArrowRight, Lock, Crown, RefreshCw, Zap, Heart, Target, Users, Eye, Monitor } from 'lucide-react'
import { supabaseClient } from '@/lib/auth/supabaseAuth'
import Link from 'next/link'
import BrandEditor from '@/components/BrandEditor'

interface BrandSystem {
  logo?: string
  primaryColors: string[]
  secondaryColors: string[]
  allColors: string[]
  primaryFont: string
  secondaryFont: string
  typographyPairings: string[]
  style: string
  brandPersonality: string
  brandTone: string
  messaging: string[]
  emotions?: string[]
  values?: string[]
  targetAudience?: string
  assets: Array<{
    type: string
    name: string
    imageUrl: string
  }>
  starterAssets?: Array<{
    type: string
    name: string
    imageUrl: string
  }>
  blueprint?: {
    meta: {
      mode: 'url' | 'social' | 'logo'
      tier: 'free' | 'pro' | 'enterprise'
      generatedAt: string
    }
    pillars: Array<{
      key: string
      title: string
      items: Array<{
        id: string
        title: string
        availability: 'available' | 'locked'
        status: 'ready' | 'draft' | 'needs_input' | 'locked'
        confidence: {
          score: number
          level: 'high' | 'medium' | 'low'
          rationale: string
        }
        needsReview: boolean
      }>
    }>
  }
}

interface CompleteBrandSystemProps {
  initialBrandSystem?: BrandSystem | null
}

export default function CompleteBrandSystem({ initialBrandSystem }: CompleteBrandSystemProps = {}) {
  const router = useRouter()
  const [url, setUrl] = useState(() => {
    // Initialize URL from sessionStorage if available
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('brandUrl') || ''
    }
    return ''
  })
  const [loading, setLoading] = useState(false)
  const [brandSystem, setBrandSystem] = useState<BrandSystem | null>(() => {
    // Initialize from prop or sessionStorage
    if (initialBrandSystem) return initialBrandSystem
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('brandSystem')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.warn('Failed to parse stored brand system')
        }
      }
    }
    return null
  })
  const [error, setError] = useState('')
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [usageCount, setUsageCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [anonymousUsageCount, setAnonymousUsageCount] = useState(0)
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [regenerating, setRegenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [assetPrompt, setAssetPrompt] = useState('')
  const [generatingAsset, setGeneratingAsset] = useState(false)
  const [generatedAssets, setGeneratedAssets] = useState<any[]>([])

  const normalizeFlowiseBrandResult = (payload: any): BrandSystem => {
    const flowBrandSystem = payload?.brandSystem || {}
    const strategy = payload?.strategy || {}
    const blueprint = payload?.blueprint

    const primaryColors = flowBrandSystem?.primaryColors || flowBrandSystem?.colors?.primary || []
    const secondaryColors = flowBrandSystem?.secondaryColors || flowBrandSystem?.colors?.secondary || []
    const allColors = flowBrandSystem?.allColors || [
      ...(flowBrandSystem?.colors?.primary || []),
      ...(flowBrandSystem?.colors?.secondary || []),
      ...(flowBrandSystem?.colors?.accent || []),
      ...(flowBrandSystem?.colors?.neutral || []),
    ]

    const primaryFont =
      flowBrandSystem?.primaryFont || flowBrandSystem?.typography?.primary?.name || 'Inter'
    const secondaryFont =
      flowBrandSystem?.secondaryFont || flowBrandSystem?.typography?.secondary?.name || 'Poppins'

    const messaging =
      flowBrandSystem?.messaging ||
      strategy?.messaging?.pillars?.map((p: any) => p?.message).filter(Boolean) ||
      flowBrandSystem?.voice?.valueProps ||
      []

    return {
      ...flowBrandSystem,
      primaryColors,
      secondaryColors,
      allColors,
      primaryFont,
      secondaryFont,
      typographyPairings: flowBrandSystem?.typographyPairings || [primaryFont, secondaryFont],
      style: flowBrandSystem?.style || strategy?.positioning?.category || 'Modern',
      brandPersonality:
        flowBrandSystem?.brandPersonality || strategy?.brandCore?.oneLiner || 'Professional',
      brandTone: flowBrandSystem?.brandTone || flowBrandSystem?.voice?.tone || 'Professional',
      messaging,
      starterAssets: flowBrandSystem?.starterAssets || flowBrandSystem?.assets || [],
      blueprint,
    }
  }
  
  // Export functions
  const handleExportPDF = async () => {
    if (!brandSystem) return
    setExporting(true)
    try {
      const brandName = url.split('//')[1]?.split('/')[0]?.replace('www.', '') || 'Brand'
      const response = await fetch('/api/export-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandSystem: {
            colors: {
              primary: brandSystem.primaryColors,
              secondary: brandSystem.secondaryColors,
              accent: brandSystem.secondaryColors,
              neutral: ['#FFFFFF', '#000000', '#F5F5F5'],
            },
            typography: {
              primary: { name: brandSystem.primaryFont, weights: [400, 600, 700] },
              secondary: { name: brandSystem.secondaryFont, weights: [400, 600] },
            },
            voice: {
              tone: brandSystem.brandTone,
              tagline: brandSystem.messaging[0] || '',
              elevatorPitch: brandSystem.messaging.join(' '),
              valueProps: brandSystem.messaging,
              socialCaptions: brandSystem.messaging,
              aboutParagraph: brandSystem.messaging.join(' '),
            },
            logos: { icon: [], horizontal: [], badge: [], symbol: [] },
            moodboard: [],
          },
          brandName,
        }),
      })
      if (response.ok) {
        const result = await response.json()
        const link = document.createElement('a')
        link.href = result.data.pdfUrl
        link.download = `${brandName}-brand-kit.pdf`
        link.click()
      }
    } catch (error: unknown) {
      console.error('PDF export failed:', error)
      setError('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }
  
  const handleExportFigma = () => {
    if (!brandSystem) return
    // Generate Figma plugin URL or instructions
    const figmaData = {
      colors: {
        primary: brandSystem.primaryColors,
        secondary: brandSystem.secondaryColors,
      },
      fonts: {
        primary: brandSystem.primaryFont,
        secondary: brandSystem.secondaryFont,
      },
    }
    const json = JSON.stringify(figmaData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'figma-brand-tokens.json'
    link.click()
    URL.revokeObjectURL(url)
    // Show instructions
    alert('Figma tokens exported! Import this JSON file into Figma using a plugin like "Figma Tokens" or "Design Tokens".')
  }
  
  const STYLE_VARIATIONS = [
    { value: '', label: 'Auto (Original)', description: 'Extract authentic brand style' },
    { value: 'Modern Minimalist', label: 'Modern Minimalist', description: 'Clean, simple, contemporary' },
    { value: 'Bold & Energetic', label: 'Bold & Energetic', description: 'Vibrant, dynamic, attention-grabbing' },
    { value: 'Elegant Luxury', label: 'Elegant Luxury', description: 'Sophisticated, premium, refined' },
    { value: 'Playful & Creative', label: 'Playful & Creative', description: 'Fun, innovative, expressive' },
    { value: 'Professional Corporate', label: 'Professional Corporate', description: 'Trustworthy, formal, established' },
    { value: 'Tech & Futuristic', label: 'Tech & Futuristic', description: 'Cutting-edge, digital, forward-thinking' },
    { value: 'Warm & Friendly', label: 'Warm & Friendly', description: 'Approachable, inviting, human' },
  ]

  // Check user subscription and usage
  useEffect(() => {
    const checkUserStatus = async () => {
      // Check anonymous usage from localStorage
      const storedAnonymousUsage = localStorage.getItem('bloombox_anonymous_usage')
      if (storedAnonymousUsage) {
        setAnonymousUsageCount(parseInt(storedAnonymousUsage, 10) || 0)
      }

      if (!supabaseClient) return

      try {
        const { data: { session } } = await supabaseClient.auth.getSession()
        if (session) {
          setIsAuthenticated(true)
          // Clear anonymous usage when user logs in
          localStorage.removeItem('bloombox_anonymous_usage')
          setAnonymousUsageCount(0)
          
          // Fetch user tier and usage from API
          const response = await fetch('/api/subscription/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id, action: 'maxBrandSystems' }),
          })
          if (response.ok) {
            const data = await response.json()
            setUserTier(data.tier || 'free')
            setUsageCount(data.currentUsage || 0)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error: unknown) {
        console.error('Error checking user status:', error)
      }
    }

    checkUserStatus()
  }, [])

  const handleGenerate = async (styleOverride?: string) => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    // Check feature access for non-logged-in users (1 free generation)
    // Also check server-side rate limiting
    if (!styleOverride && !isAuthenticated) {
      const ANONYMOUS_LIMIT = 1
      
      // Check server-side rate limit
      try {
        const rateLimitResponse = await fetch('/api/rate-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check' }),
        })
        
        if (rateLimitResponse.ok) {
          const rateLimitData = await rateLimitResponse.json()
          if (!rateLimitData.allowed) {
            setError(`You've reached your free limit of ${ANONYMOUS_LIMIT} brand system. Sign up for free to get 3 more, or upgrade to Pro for unlimited generations!`)
            setLoading(false)
            return
          }
        }
      } catch (rateLimitError) {
        console.warn('Rate limit check failed:', rateLimitError)
        // Continue with client-side check as fallback
      }
      
      // Client-side check as backup
      if (anonymousUsageCount >= ANONYMOUS_LIMIT) {
        setError(`You've reached your free limit of ${ANONYMOUS_LIMIT} brand system. Sign up for free to get 3 more, or upgrade to Pro for unlimited generations!`)
        setLoading(false)
        return
      }
    }

    // Check feature access for free tier logged-in users (3 free generations)
    if (!styleOverride && isAuthenticated && userTier === 'free' && usageCount >= 3) {
      setError('You\'ve reached your free limit of 3 brand systems. Upgrade to Pro for unlimited brand systems!')
      return
    }

    if (styleOverride) {
      setRegenerating(true)
    } else {
      setLoading(true)
    }
    setError('')
    if (!styleOverride) {
      setBrandSystem(null)
    }

    try {
      // Check subscription before generating (only on first generation)
      if (!styleOverride && isAuthenticated && supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession()
          if (session?.user?.id) {
            const checkResponse = await fetch('/api/subscription/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                userId: session.user.id,
                action: 'maxBrandSystems',
                currentUsage: usageCount 
              }),
            })
            
            if (checkResponse.ok) {
              const checkData = await checkResponse.json()
              if (!checkData.allowed) {
                setError(checkData.reason || 'Upgrade required')
                setLoading(false)
                return
              }
            }
          }
        } catch (checkError) {
          console.warn('Subscription check failed:', checkError)
          // Continue anyway for backward compatibility
        }
      }
      // Get user ID if authenticated
      let userId: string | undefined
      if (isAuthenticated && supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession()
          userId = session?.user?.id
        } catch (err) {
          console.warn('Failed to get user session:', err)
        }
      }

      const response = await fetch('/api/flowise/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mode: 'url',
          url: trimmedUrl,
          tier: userTier,
          userId,
          saveToProject: Boolean(userId),
          includeProcess: false,
          businessContext: {
            goals: ['Build a complete brand system', 'Create usable brand guidelines'],
          },
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Server error: ${text.substring(0, 100)}`)
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate brand system')
      }

      const normalized = normalizeFlowiseBrandResult(result.data)
      setBrandSystem(normalized)
      
      // Update usage count for non-logged-in users
      if (!isAuthenticated && !styleOverride) {
        const newCount = anonymousUsageCount + 1
        setAnonymousUsageCount(newCount)
        localStorage.setItem('bloombox_anonymous_usage', newCount.toString())
      }
      
      // Update usage count for free tier logged-in users
      if (isAuthenticated && userTier === 'free' && !styleOverride) {
        setUsageCount(prev => prev + 1)
      }
      
      // Store in sessionStorage for navigation (optional)
      sessionStorage.setItem('brandSystem', JSON.stringify(normalized))
      
      // Scroll to results (results display on same page)
      setTimeout(() => {
        const resultsElement = document.getElementById('brand-results')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (err: unknown) {
      // Handle different error types
      const error = err instanceof Error ? err : new Error('Unknown error')
      let errorMessage = 'Failed to generate complete brand system. Please try again.'
      setRegenerating(false)
      
      if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
        errorMessage = 'The request timed out. The website may be too complex or slow. Please try a simpler website or try again.'
      } else if (error.message?.includes('JSON') || error.message?.includes('parse')) {
        errorMessage = 'Server error occurred. Please try again or contact support.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAsset = async () => {
    if (!assetPrompt.trim() || !displayBrandSystem) {
      return
    }

    setGeneratingAsset(true)
    setError('')

    try {
      // Get project ID if available (from initialBrandSystem or brandSystem)
      let brandId: string | undefined
      if (displayBrandSystem && (displayBrandSystem as any).projectId) {
        brandId = (displayBrandSystem as any).projectId
      } else if (typeof window !== 'undefined') {
        // Try to get from sessionStorage
        const stored = sessionStorage.getItem('brandSystem')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.projectId) {
              brandId = parsed.projectId
            }
          } catch (e) {
            // Ignore
          }
        }
      }

      // Get user ID if authenticated
      let userId: string | undefined
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession()
          userId = session?.user?.id
        } catch (err) {
          console.warn('Failed to get user session:', err)
        }
      }

      const response = await fetch('/api/assets/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: assetPrompt.trim(),
          brandId: brandId || 'session', // Use 'session' as fallback
          userId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate asset')
      }

      const result = await response.json()
      
      // Add to generated assets list
      setGeneratedAssets([result.data, ...generatedAssets])
      setAssetPrompt('')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate asset'
      setError(errorMessage)
    } finally {
      setGeneratingAsset(false)
    }
  }

  // If no brand system yet, don't show anything (Hero handles input)
  if (!brandSystem && !initialBrandSystem) {
    return null
  }

  // Use initial brand system if provided, otherwise use state
  const displayBrandSystem = initialBrandSystem || brandSystem
  const brandTitle = url.split('//')[1]?.split('/')[0]?.replace('www.', '') || 'Brand'

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {displayBrandSystem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Brand Intelligence Suite</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">{brandTitle}</h2>
              <p className="text-sm text-gray-600 mt-2">
                Strategy + identity system generated with confidence scoring and tier-aware coverage.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs border border-indigo-200 bg-indigo-50 text-indigo-700">
                Tier: {displayBrandSystem.blueprint?.meta?.tier || userTier}
              </span>
              <span className="px-3 py-1 rounded-full text-xs border border-purple-200 bg-purple-50 text-purple-700">
                Mode: {displayBrandSystem.blueprint?.meta?.mode || 'url'}
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors disabled:opacity-60"
            >
              {exporting ? 'Exporting PDF...' : 'Export Brand Book'}
            </button>
            <button
              onClick={handleExportFigma}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Export Figma Tokens
            </button>
          </div>
        </motion.div>
      )}

      {displayBrandSystem?.starterAssets && displayBrandSystem.starterAssets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">Starter Assets</h3>
            <span className="text-sm text-gray-500">{displayBrandSystem.starterAssets.length} generated</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayBrandSystem.starterAssets.map((asset: any, index: number) => (
              <motion.div
                key={asset.id || index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name || 'Starter asset'}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800">{asset.name || 'Asset'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {displayBrandSystem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color System</h3>
            <div className="space-y-4">
              {[...(displayBrandSystem.primaryColors || []), ...(displayBrandSystem.secondaryColors || [])]
                .slice(0, 8)
                .map((color: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                    <span className="text-sm font-mono text-gray-700">{color}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Primary</p>
                <p className="text-2xl font-semibold text-gray-900" style={{ fontFamily: displayBrandSystem.primaryFont }}>
                  {displayBrandSystem.primaryFont}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Secondary</p>
                <p className="text-xl text-gray-900" style={{ fontFamily: displayBrandSystem.secondaryFont }}>
                  {displayBrandSystem.secondaryFont}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {displayBrandSystem && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900">Brand Blueprint</h3>
          <p className="text-sm text-gray-500">Availability, confidence, and review state for every branding deliverable.</p>

          {displayBrandSystem.blueprint?.pillars?.length ? (
            <div className="space-y-6">
              {displayBrandSystem.blueprint.pillars.map((pillar) => (
                <div key={pillar.key} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
                    <h4 className="text-base font-semibold text-gray-800">{pillar.title}</h4>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pillar.items.map((item) => {
                      const pct = Math.max(0, Math.min(100, item.confidence.score))
                      return (
                        <div key={item.id} className="rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full ${
                                item.availability === 'available'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {item.availability}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {item.status.replace('_', ' ')}
                            </span>
                            {item.needsReview && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                needs review
                              </span>
                            )}
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
                            <div
                              className={`h-full ${
                                item.confidence.level === 'high'
                                  ? 'bg-green-500'
                                  : item.confidence.level === 'medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600">Confidence {pct}% • {item.confidence.rationale}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-sm text-gray-600 bg-white">
              Blueprint data is not available for this brand yet. Run generation again to get full strategy and guideline coverage.
            </div>
          )}
        </motion.div>
      )}

      {displayBrandSystem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Generate More Assets</h3>
          <p className="text-sm text-gray-500 mb-5">Describe any creative and generate it instantly in your brand style.</p>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
              type="text"
              value={assetPrompt}
              onChange={(e) => setAssetPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !generatingAsset && handleGenerateAsset()}
              placeholder="e.g., launch campaign carousel, event booth backdrop, app onboarding banner"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={generatingAsset}
            />
            <button
              onClick={handleGenerateAsset}
              disabled={generatingAsset || !assetPrompt.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generatingAsset ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Asset'
              )}
            </button>
          </div>

          {generatedAssets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedAssets.map((asset, index) => (
                <motion.div
                  key={asset.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.prompt || 'Generated asset'}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{asset.prompt || 'Asset'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

