'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/auth/supabaseAuth'

export default function Hero() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentBrands, setRecentBrands] = useState<any[]>([])
  const [progress, setProgress] = useState<{ step: string; progress: number; message: string } | null>(null)

  // Load recent brands from session or database
  useEffect(() => {
    const loadRecentBrands = async () => {
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession()
          if (session) {
            const response = await fetch('/api/projects', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            })
            if (response.ok) {
              const result = await response.json()
              if (result.data && result.data.length > 0) {
                setRecentBrands(result.data.slice(0, 5))
              }
            }
          }
        } catch (err) {
          console.warn('Failed to load recent brands:', err)
        }
      }
    }
    loadRecentBrands()
  }, [])

  const handleGenerate = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a website URL')
      return
    }

    // Add protocol if missing
    let fullUrl = trimmedUrl
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      fullUrl = `https://${trimmedUrl}`
    }

    setLoading(true)
    setError('')
    setProgress({ step: 'starting', progress: 0, message: 'Starting brand extraction...' })

    try {
      // Get user ID if authenticated
      let userId: string | undefined
      if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession()
        userId = session?.user?.id
      }

      // Start progress tracking (simulated for now)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (!prev) return { step: 'analyzing', progress: 10, message: 'Analyzing website...' }
          if (prev.progress < 30) {
            return { step: 'extracting', progress: prev.progress + 5, message: 'Extracting colors and fonts...' }
          }
          if (prev.progress < 60) {
            return { step: 'analyzing', progress: prev.progress + 5, message: 'Analyzing brand personality...' }
          }
          if (prev.progress < 90) {
            return { step: 'generating', progress: prev.progress + 5, message: 'Generating brand assets...' }
          }
          return { step: 'finalizing', progress: 95, message: 'Finalizing brand system...' }
        })
      }, 800)

      const response = await fetch('/api/brand/complete-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: fullUrl,
          userId,
        }),
      })

      clearInterval(progressInterval)
      setProgress({ step: 'complete', progress: 100, message: 'Brand system ready!' })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate brand system')
      }

      const result = await response.json()

      // Store in sessionStorage
      sessionStorage.setItem('brandSystem', JSON.stringify(result.data))
      sessionStorage.setItem('brandUrl', fullUrl)

      // Redirect to results page or scroll to generator section
      const element = document.getElementById('generator')
      if (element) {
        // If generator section exists, scroll to it
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Trigger a custom event to show results
        window.dispatchEvent(new CustomEvent('brandGenerated', { detail: result.data }))
      } else {
        // Otherwise redirect to brand viewer
        router.push('/brand/temp')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate brand system'
      setError(errorMessage)
      setProgress(null)
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(null), 2000) // Clear progress after 2 seconds
    }
  }

  return (
    <div className="relative overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Beautiful illustrated background - serene landscape */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Simplified gradient background with nature-inspired colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 via-purple-50/20 to-blue-50/30"></div>
        
        {/* Decorative elements - simplified */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Main Headline - Large serif font */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Brand Assets
          </h1>
          
          {/* Sub-headline - Purple italicized */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal italic text-purple-600 mb-8">
            made effortless
          </h2>
          
          {/* Descriptive Text - Simple and clean */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
            Distill your website into a living brand system.
            <br />
            Generate brand assets in seconds.
          </p>

          {/* Input Field - Clean and prominent */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-3 items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
              <input
                type="text"
                placeholder="yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleGenerate()
                  }
                }}
                disabled={loading}
                className="flex-1 px-6 py-4 text-lg border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
                className="w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-colors shadow-md"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Progress Indicator */}
            {progress && loading && (
              <div className="mt-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{progress.message}</span>
                  <span className="text-sm font-medium text-purple-600">{progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* "or continue with" option */}
          {recentBrands.length > 0 && (
            <>
              <p className="text-gray-500 mb-4">or continue with</p>
              
              {/* Recent brand dropdown */}
              <div className="max-w-xs mx-auto">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/brand/${e.target.value}`)
                    }
                  }}
                  className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow text-gray-600 outline-none"
                >
                  <option value="">Recent brand</option>
                  {recentBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name || brand.url || 'Brand Project'}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
