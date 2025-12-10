'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
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
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-violet-50/30 min-h-[92vh] flex items-center">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-60"></div>
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 backdrop-blur-sm border border-violet-200/50 mb-8"
          >
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">AI-Powered Brand Creation</span>
          </motion.div>

          {/* Main Headline - Modern, bold typography */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 leading-[0.95]">
            <span className="block text-gray-900">Transform</span>
            <span className="block gradient-text">Your Brand</span>
            <span className="block text-gray-900">in Seconds</span>
          </h1>
          
          {/* Descriptive Text */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Extract your complete brand DNA—colors, fonts, logos, and style. 
            <span className="font-medium text-gray-900"> Edit in real-time</span> and generate unlimited on-brand assets.
          </p>

          {/* Modern input field with glass effect */}
          <div className="max-w-2xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass rounded-2xl p-2 shadow-modern-xl"
            >
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter your website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleGenerate()
                    }
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-5 text-lg border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 disabled:opacity-50 font-normal"
                />
                <motion.button
                  onClick={handleGenerate}
                  disabled={loading || !url.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-modern min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating</span>
                      </>
                    ) : (
                      <>
                        <span>Generate</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Modern progress indicator */}
            {progress && loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between mb-3">
                  <motion.span
                    key={progress.message}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium text-gray-700"
                  >
                    {progress.message}
                  </motion.span>
                  <span className="text-sm font-mono font-semibold text-violet-600">
                    {progress.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600"
                  />
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Recent brands */}
          {recentBrands.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <p className="text-sm text-gray-500 mb-3">or continue with</p>
              <div className="max-w-xs mx-auto">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/brand/${e.target.value}`)
                    }
                  }}
                  className="w-full glass rounded-xl p-3 cursor-pointer hover:shadow-modern-lg transition-modern text-gray-700 outline-none border-0 font-medium"
                >
                  <option value="">Recent brand</option>
                  {recentBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name || brand.url || 'Brand Project'}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
