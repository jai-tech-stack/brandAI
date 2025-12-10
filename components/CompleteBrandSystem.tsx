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

      const response = await fetch('/api/brand/complete-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: trimmedUrl,
          userId: userId, // Pass userId to save to database
          styleVariation: styleOverride || selectedStyle || undefined
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

      setBrandSystem(result.data)
      
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
      sessionStorage.setItem('brandSystem', JSON.stringify(result.data))
      
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Starter Assets - Show first like trybloom.ai */}
      {displayBrandSystem?.starterAssets && displayBrandSystem.starterAssets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-6">Starter assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayBrandSystem.starterAssets.map((asset: any, index: number) => (
              <motion.div
                key={asset.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name || 'Starter asset'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{asset.name || 'Asset'}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Brand System Display - Minimal like trybloom.ai */}
      {displayBrandSystem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-6">Brand system</h2>
          
          {/* Colors */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {displayBrandSystem.primaryColors?.map((color: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">{color}</span>
                </div>
              ))}
              {displayBrandSystem.secondaryColors?.map((color: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Fonts</h3>
            <div className="space-y-2">
              {displayBrandSystem.primaryFont && (
                <div>
                  <span className="text-sm text-gray-600">Primary: </span>
                  <span className="text-sm font-medium" style={{ fontFamily: displayBrandSystem.primaryFont }}>
                    {displayBrandSystem.primaryFont}
                  </span>
                </div>
              )}
              {displayBrandSystem.secondaryFont && (
                <div>
                  <span className="text-sm text-gray-600">Secondary: </span>
                  <span className="text-sm font-medium" style={{ fontFamily: displayBrandSystem.secondaryFont }}>
                    {displayBrandSystem.secondaryFont}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Generate More Assets - Simple like trybloom.ai */}
      {displayBrandSystem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 pt-12"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-4">Generate more assets</h2>
          <p className="text-sm text-gray-500 mb-6">Describe what you need and we'll create it on-brand</p>
          
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={assetPrompt}
              onChange={(e) => setAssetPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !generatingAsset && handleGenerateAsset()}
              placeholder="e.g., social media post, email header, product mockup"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={generatingAsset}
            />
            <button 
              onClick={handleGenerateAsset}
              disabled={generatingAsset || !assetPrompt.trim()}
              className="px-6 py-3 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generatingAsset ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>

          {/* Generated Assets Display */}
          {generatedAssets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedAssets.map((asset, index) => (
                <motion.div
                  key={asset.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.prompt || 'Generated asset'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{asset.prompt || 'Asset'}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

