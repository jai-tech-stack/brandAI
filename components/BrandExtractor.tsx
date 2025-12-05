'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, Palette, Type, Image as ImageIcon } from 'lucide-react'

interface BrandData {
  logo?: string
  colors: string[]
  typography: string[]
  style: string
  sourceUrl?: string
  aiPowered?: boolean
  autonomous?: boolean
  brandPersonality?: string
  recommendations?: string[]
}

export default function BrandExtractor() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [brandData, setBrandData] = useState<BrandData | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [sourceUrl, setSourceUrl] = useState('')

  const handleExtract = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setBrandData(null)

    try {
      const response = await fetch('/api/brand/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract brand')
      }

      const result = await response.json()
      
      if (result.error) {
        setError(result.error)
      } else {
        setBrandData(result.data)
        setSourceUrl(result.data.sourceUrl || url)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extract brand data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToBrandKit = async () => {
    if (!brandData) return

    setSaving(true)
    setSaveSuccess(false)
    setError('')

    try {
      // Extract domain name from URL for brand name
      const domain = sourceUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      const brandName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)

      const brandKitData = {
        name: brandName,
        url: domain,
        logo: brandData.logo || null,
        colors: brandData.colors,
        typography: brandData.typography,
        style: brandData.style,
      }

      const response = await fetch('/api/brand-kits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandKitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save brand kit')
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        // Refresh the page to show updated brand kits
        window.location.reload()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to save brand kit. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Extract Brand Identity</h2>
            <p className="text-gray-600">Enter a website URL to automatically extract brand elements</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleExtract()}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            onClick={handleExtract}
            disabled={loading}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing website...
              </>
            ) : (
              <>
                <Globe className="w-5 h-5" />
                Extract Brand Identity
              </>
            )}
          </button>
        </div>

        {brandData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Brand Identity Extracted</h3>
              </div>
              {brandData.aiPowered && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    AI-Powered
                  </span>
                  {brandData.autonomous && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Autonomous Agent
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandData.logo && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Logo</h4>
                  </div>
                  <div className="w-32 h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Colors</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {brandData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-mono text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Type className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Typography</h4>
                </div>
                <div className="space-y-2">
                  {brandData.typography.map((font, index) => (
                    <div key={index} className="text-gray-700" style={{ fontFamily: font }}>
                      {font}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Style</h4>
                <p className="text-gray-700">{brandData.style}</p>
                {brandData.brandPersonality && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Personality: </span>
                    <span className="text-xs font-medium text-gray-700">{brandData.brandPersonality}</span>
                  </div>
                )}
              </div>
              
              {brandData.recommendations && brandData.recommendations.length > 0 && (
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {brandData.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveToBrandKit}
              disabled={saving || saveSuccess}
              className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved to Brand Kit!
                </>
              ) : (
                'Save to Brand Kit'
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

