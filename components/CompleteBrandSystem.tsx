'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, Palette, Type, Image as ImageIcon, Download, Sparkles, Layers, FileText, Instagram, Presentation, ArrowRight, Lock, Crown } from 'lucide-react'
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
      } catch (error) {
        console.error('Error checking user status:', error)
      }
    }

    checkUserStatus()
  }, [])

  const handleGenerate = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    // Check feature access for free tier
    if (userTier === 'free' && usageCount >= 1) {
      setError('You\'ve reached your free limit. Upgrade to Pro for unlimited brand systems!')
      return
    }

    setLoading(true)
    setError('')
    setBrandSystem(null)

    try {
      // Check subscription before generating
      if (isAuthenticated && supabaseClient) {
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
        body: JSON.stringify({ url: trimmedUrl }),
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
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200"
      >

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
                className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
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
            
            <p className="mt-3 text-sm text-gray-500">
              💡 Tip: Enter any website URL—BloomboxAI will extract the complete brand identity automatically.
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
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">Complete Brand System Generated ✨</h3>
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
      </motion.div>
    </div>
  )
}

