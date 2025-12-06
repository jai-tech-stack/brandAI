'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Loader2, CheckCircle2, Palette, Type, Image as ImageIcon, Download, Sparkles, Layers, FileText, Instagram, Presentation } from 'lucide-react'

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
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [brandSystem, setBrandSystem] = useState<BrandSystem | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setBrandSystem(null)

    try {
      const response = await fetch('/api/brand/complete-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate brand system')
      }

      const result = await response.json()
      setBrandSystem(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate complete brand system. Please try again.')
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
            {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
            <p className="mt-3 text-sm text-gray-500">
              💡 Tip: Enter any website URL—BloomboxAI will extract the complete brand identity automatically.
            </p>
          </div>
        </div>

        {brandSystem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
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
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                          <div className="absolute top-2 right-2">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">{asset.name}</h5>
                          <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            Download
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

