'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAnalyze = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze website')
      }

      const result = await response.json()
      
      // Generate brand system
      const brandResponse = await fetch('/api/generate-brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysis: result.data }),
      })

      if (!brandResponse.ok) {
        throw new Error('Failed to generate brand system')
      }

      const brandResult = await brandResponse.json()
      
      // Redirect to brand viewer
      if (result.data.projectId) {
        router.push(`/brand/${result.data.projectId}`)
      } else {
        // Store in sessionStorage as fallback
        sessionStorage.setItem('brandSystem', JSON.stringify(brandResult.data))
        router.push('/brand/temp')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze website. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Analyze Your Website
            </h1>
            <p className="text-xl text-gray-600">
              Enter your website URL to extract brand elements and generate a complete brand system
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !url.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5" />
                      Analyze
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">What we'll extract:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Brand colors (primary, secondary, accent)</li>
                <li>✓ Typography and font pairings</li>
                <li>✓ Logo variations</li>
                <li>✓ Brand voice and messaging</li>
                <li>✓ Visual moodboard</li>
                <li>✓ Social media templates</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

