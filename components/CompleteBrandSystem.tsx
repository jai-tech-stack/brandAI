'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, Palette, Type, Image as ImageIcon, Download, Sparkles, Layers, FileText, Instagram, Presentation, ArrowRight, Lock, Crown, RefreshCw, Zap, Heart, Target, Users, Eye, FileJson, Code, Monitor } from 'lucide-react'
import { supabaseClient } from '@/lib/auth/supabaseAuth'
import Link from 'next/link'

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

export default function CompleteBrandSystem() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [brandSystem, setBrandSystem] = useState<BrandSystem | null>(null)
  const [error, setError] = useState('')
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [usageCount, setUsageCount] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [regenerating, setRegenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [exporting, setExporting] = useState(false)
  
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
  
  const handleExportCSS = () => {
    if (!brandSystem) return
    const css = `:root {
  /* Primary Colors */
${brandSystem.primaryColors.map((c, i) => `  --color-primary-${i + 1}: ${c};`).join('\n')}
  
  /* Secondary Colors */
${brandSystem.secondaryColors.map((c, i) => `  --color-secondary-${i + 1}: ${c};`).join('\n')}
  
  /* Typography */
  --font-primary: '${brandSystem.primaryFont}', sans-serif;
  --font-secondary: '${brandSystem.secondaryFont}', sans-serif;
  
  /* Brand Style */
  --brand-style: ${brandSystem.style};
  --brand-tone: ${brandSystem.brandTone};
}`
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'brand-variables.css'
    link.click()
    URL.revokeObjectURL(url)
  }
  
  const handleExportJSON = () => {
    if (!brandSystem) return
    const json = JSON.stringify(brandSystem, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'brand-system.json'
    link.click()
    URL.revokeObjectURL(url)
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
      if (!supabaseClient) return

      try {
        const { data: { session } } = await supabaseClient.auth.getSession()
        if (session) {
          setIsAuthenticated(true)
          // Fetch user tier and usage from API
          const response = await fetch('/api/subscription/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id, action: 'maxBrandSystems' }),
          })
          if (response.ok) {
            const data = await response.json()
            setUserTier(data.tier || 'free')
          }
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

    // Check feature access for free tier (only on first generation)
    if (!styleOverride && userTier === 'free' && usageCount >= 1) {
      setError('You\'ve reached your free limit. Upgrade to Pro for unlimited brand systems!')
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
      const response = await fetch('/api/brand/complete-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: trimmedUrl,
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
      
      // Update usage count for free tier
      if (userTier === 'free') {
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
    } catch (err: any) {
      // Handle different error types
      let errorMessage = 'Failed to generate complete brand system. Please try again.'
      setRegenerating(false)
      
      if (err.message?.includes('timeout') || err.message?.includes('Timeout')) {
        errorMessage = 'The request timed out. The website may be too complex or slow. Please try a simpler website or try again.'
      } else if (err.message?.includes('JSON') || err.message?.includes('parse')) {
        errorMessage = 'Server error occurred. Please try again or contact support.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-8 md:p-12 lg:p-16 relative overflow-hidden group"
      >
        {/* Premium decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-purple-100/30 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Your Website URL
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="input-premium flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !url.trim()}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-premium hover:shadow-glow-lg transition-premium transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 whitespace-nowrap relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </span>
              </button>
            </div>
            {error && (
              <div className="mt-3 p-4 rounded-lg border-2 border-red-200 bg-red-50">
                <p className="text-sm text-red-600 font-medium mb-2">{error}</p>
                {error.includes('limit') || error.includes('Upgrade') ? (
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro for Unlimited Access
                  </Link>
                ) : null}
              </div>
            )}
            
            {/* Usage Indicator for Free Tier */}
            {userTier === 'free' && isAuthenticated && (
              <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Free Plan Usage</span>
                  <span className="text-sm font-bold text-primary-600">{usageCount}/1</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(usageCount / 1) * 100}%` }}
                  ></div>
                </div>
                {usageCount >= 1 && (
                  <Link
                    href="/#pricing"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro for Unlimited Generations
                  </Link>
                )}
              </div>
            )}
            
            {/* Style Selector (Optional) */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Style Variation (Optional)
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              >
                {STYLE_VARIATIONS.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label} {style.description ? `- ${style.description}` : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose a style to apply, or leave as "Auto" to extract the authentic brand style. You can regenerate with different styles after generation!
              </p>
            </div>
            
            <p className="mt-3 text-sm text-gray-500">
              💡 Tip: Enter any website URL—BloomboxAI will extract the complete brand identity automatically. 
              <span className="font-semibold text-purple-600"> Infinite regeneration with different styles is free!</span>
            </p>
          </div>
        </div>

        {brandSystem && (
          <motion.div
            id="brand-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Complete Brand System Generated ✨</h3>
              </div>
              
              {/* Regeneration Section */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={regenerating}
                >
                  {STYLE_VARIATIONS.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleGenerate(selectedStyle || undefined)}
                  disabled={regenerating || loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {regenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Infinite Regeneration Notice */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900 mb-1">✨ Infinite Regeneration</p>
                  <p className="text-sm text-purple-700">
                    Try different styles, refine your brand, and explore endless variations—all at no extra cost! 
                    Select a style above and click "Regenerate" to see your brand in a new light.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-600" />
                  Brand Primary Colors
                </h4>
                <div className="flex flex-wrap gap-3">
                  {brandSystem.primaryColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-md"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono text-gray-700 mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Brand Secondary Colors
                </h4>
                <div className="flex flex-wrap gap-3">
                  {brandSystem.secondaryColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-md"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono text-gray-700 mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Pairings */}
            <div className="p-6 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-600" />
                Typography Pairings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Primary Font</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: brandSystem.primaryFont }}>
                    {brandSystem.primaryFont}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Secondary Font</p>
                  <p className="text-xl" style={{ fontFamily: brandSystem.secondaryFont }}>
                    {brandSystem.secondaryFont}
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Tone & Messaging */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-3">Brand Tone</h4>
                <p className="text-lg text-blue-800">{brandSystem.brandTone}</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3">Messaging Suggestions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {brandSystem.messaging.map((msg, index) => (
                    <li key={index} className="text-purple-800">{msg}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced Brand Insights */}
            {(brandSystem.emotions?.length > 0 || brandSystem.values?.length > 0 || brandSystem.targetAudience) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandSystem.emotions && brandSystem.emotions.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <h4 className="font-bold text-pink-900">Brand Emotions</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {brandSystem.emotions.map((emotion, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {brandSystem.values && brandSystem.values.length > 0 && (
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-indigo-900">Core Values</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {brandSystem.values.map((value, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {brandSystem.targetAudience && (
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-emerald-900">Target Audience</h4>
                    </div>
                    <p className="text-emerald-800">{brandSystem.targetAudience}</p>
                  </div>
                )}
              </div>
            )}

            {/* Export Options */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="w-6 h-6 text-purple-600" />
                Export Brand System
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col items-center gap-2 text-sm font-semibold disabled:opacity-50"
                >
                  <FileText className="w-5 h-5 text-red-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExportCSS}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col items-center gap-2 text-sm font-semibold"
                >
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>CSS</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col items-center gap-2 text-sm font-semibold"
                >
                  <FileJson className="w-5 h-5 text-yellow-600" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleExportFigma}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all flex flex-col items-center gap-2 text-sm font-semibold"
                >
                  <Monitor className="w-5 h-5 text-purple-600" />
                  <span>Figma</span>
                </button>
              </div>
            </div>

            {/* Real-time Preview */}
            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary-600" />
                  Live Preview
                </h4>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all text-sm font-semibold"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              {showPreview && brandSystem && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {/* Website Mockup */}
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
                    <div className="bg-gray-100 p-2 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1 text-center text-xs text-gray-600 font-medium">Website Preview</div>
                    </div>
                    <div className="p-6" style={{ backgroundColor: brandSystem.primaryColors?.[0] || '#FFFFFF' }}>
                      <div className="mb-4">
                        <div className="h-8 rounded" style={{ backgroundColor: brandSystem.primaryColors?.[1] || '#000000', width: '60%' }}></div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 rounded" style={{ backgroundColor: brandSystem.primaryColors?.[1] || '#000000', opacity: 0.7, width: '100%' }}></div>
                        <div className="h-4 rounded" style={{ backgroundColor: brandSystem.primaryColors?.[1] || '#000000', opacity: 0.5, width: '85%' }}></div>
                        <div className="h-4 rounded" style={{ backgroundColor: brandSystem.primaryColors?.[1] || '#000000', opacity: 0.5, width: '70%' }}></div>
                      </div>
                      <button className="px-4 py-2 rounded text-white text-sm font-semibold" style={{ backgroundColor: brandSystem.secondaryColors?.[0] || brandSystem.primaryColors?.[1] || '#000000' }}>
                        Call to Action
                      </button>
                    </div>
                  </div>

                  {/* Social Media Post */}
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/30 rounded mb-1" style={{ width: '60%' }}></div>
                          <div className="h-2 bg-white/20 rounded" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4" style={{ backgroundColor: brandSystem.primaryColors?.[0] || '#FFFFFF' }}>
                      <p className="text-sm mb-3" style={{ color: brandSystem.primaryColors?.[1] || '#000000', fontFamily: brandSystem.primaryFont }}>
                        {brandSystem.messaging?.[0] || 'Your brand message here'}
                      </p>
                      <div className="aspect-video rounded-lg mb-3" style={{ backgroundColor: brandSystem.secondaryColors?.[0] || '#F5F5F5' }}></div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: brandSystem.primaryColors?.[1] || '#000000' }}>
                        <span>❤️</span>
                        <span>💬</span>
                        <span>📤</span>
                      </div>
                    </div>
                  </div>

                  {/* Business Card */}
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
                    <div className="p-6 aspect-[3.5/2] flex flex-col justify-between" style={{ backgroundColor: brandSystem.primaryColors?.[0] || '#FFFFFF' }}>
                      <div>
                        <div className="text-2xl font-bold mb-2" style={{ color: brandSystem.primaryColors?.[1] || '#000000', fontFamily: brandSystem.primaryFont }}>
                          Brand Name
                        </div>
                        <div className="text-sm mb-4" style={{ color: brandSystem.secondaryColors?.[0] || brandSystem.primaryColors?.[1] || '#000000', fontFamily: brandSystem.secondaryFont }}>
                          {brandSystem.brandTone}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs" style={{ color: brandSystem.primaryColors?.[1] || '#000000' }}>
                          email@brand.com
                        </div>
                        <div className="w-12 h-12 rounded" style={{ backgroundColor: brandSystem.secondaryColors?.[0] || brandSystem.primaryColors?.[1] || '#000000' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Assets */}
            {brandSystem.assets && brandSystem.assets.length > 0 && (
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6">Generated Brand Assets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brandSystem.assets.map((asset, index) => {
                    const iconMap: { [key: string]: any } = {
                      'logo-alternative': ImageIcon,
                      'social-template': Instagram,
                      'banner-template': Layers,
                      'moodboard': Palette,
                      'pitch-deck': Presentation,
                    }
                    const Icon = iconMap[asset.type] || FileText

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all group"
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                          {asset.imageUrl && asset.imageUrl.startsWith('http') ? (
                            <img 
                              src={asset.imageUrl} 
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">{asset.name}</h5>
                          <button 
                            onClick={() => {
                              if (asset.imageUrl && asset.imageUrl.startsWith('http')) {
                                window.open(asset.imageUrl, '_blank')
                              }
                            }}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            Download Asset
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
        </div>
      </motion.div>
    </div>
  )
}

