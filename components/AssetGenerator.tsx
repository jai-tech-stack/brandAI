'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Loader2, Download, Image as ImageIcon, Sparkles } from 'lucide-react'

interface GeneratedAsset {
  id: string
  prompt: string
  enhancedPrompt?: string
  imageUrl: string
  timestamp: Date
  aiPowered?: boolean
  autonomous?: boolean
  provider?: string
  model?: string
  brandKit?: {
    name: string
    colors: string[]
    typography: string[]
    style: string
  }
}

const examplePrompts = [
  'Create a hiring poster for a senior designer position',
  'Design a t-shirt with our logo and brand colors',
  'Generate a social media banner for product launch',
  'Create a business card with modern design',
]

export default function AssetGenerator() {
  const [prompt, setPrompt] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [availableBrands, setAvailableBrands] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([])
  const [error, setError] = useState('')
  
  // Auto-load most recent brand from session or database
  useEffect(() => {
    const loadBrands = async () => {
      // First, try to get from sessionStorage (most recent generation)
      const stored = sessionStorage.getItem('brandSystem')
      if (stored) {
        try {
          const brandSystem = JSON.parse(stored)
          const brandName = brandSystem.brandName || brandSystem.sourceUrl || 'Current Brand'
          setAvailableBrands([{ id: 'session', name: brandName }])
          setSelectedBrand('session')
          return
        } catch (e) {
          console.warn('Failed to parse stored brand system')
        }
      }
      
      // Otherwise, try to load from user's projects
      try {
        const { supabaseClient } = await import('@/lib/auth/supabaseAuth')
        if (supabaseClient) {
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
                const brands = result.data
                  .filter((p: any) => p.brand_system)
                  .map((p: any) => ({
                    id: p.id,
                    name: p.name || p.url || 'Brand Project'
                  }))
                
                if (brands.length > 0) {
                  setAvailableBrands(brands)
                  setSelectedBrand(brands[0].id) // Auto-select most recent
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load brands:', err)
      }
    }
    
    loadBrands()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    if (!selectedBrand) {
      setError('Please select a brand')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/assets/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, brandId: selectedBrand }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate asset')
      }

      const result = await response.json()
      const newAsset: GeneratedAsset = {
        id: result.data.id,
        prompt,
        enhancedPrompt: result.data.enhancedPrompt,
        imageUrl: result.data.imageUrl,
        timestamp: new Date(result.data.generatedAt),
        aiPowered: result.data.aiPowered,
        autonomous: result.data.autonomous,
        provider: result.data.provider,
        model: result.data.model,
        brandKit: result.data.brandKit,
      }
      
      setGeneratedAssets([newAsset, ...generatedAssets])
      setPrompt('')
    } catch (err: unknown) {
      setError('Failed to generate asset. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate On-Brand Assets</h2>
            <p className="text-gray-600">Describe what you need and we'll create it perfectly on-brand</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Choose a brand...</option>
              {availableBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {availableBrands.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No brands found. Generate a brand system first to create assets.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your asset
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a hiring poster for a senior designer position with our brand colors..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Example prompts:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedBrand}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating on-brand asset...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Asset
              </>
            )}
          </button>
        </div>

        {generatedAssets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Generated Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="aspect-video bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    {asset.aiPowered && (
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          AI-Powered
                        </span>
                        {asset.autonomous && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Autonomous
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-medium mb-1">{asset.prompt}</p>
                    {asset.brandKit && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Brand:</span>
                        <span className="text-xs font-medium text-gray-700">{asset.brandKit.name}</span>
                        <div className="flex gap-1">
                          {asset.brandKit.colors.slice(0, 3).map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

