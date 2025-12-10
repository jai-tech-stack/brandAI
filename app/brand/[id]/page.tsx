'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Palette, Type, Image as ImageIcon, Download, ArrowRight, Sparkles } from 'lucide-react'
import { BrandSystem } from '@/lib/generators/generatorTypes'

export default function BrandViewerPage() {
  const params = useParams()
  const router = useRouter()
  const [brandSystem, setBrandSystem] = useState<BrandSystem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBrandSystem = async () => {
      // Try to load from sessionStorage first (for temp projects)
      const stored = sessionStorage.getItem('brandSystem')
      if (stored) {
        try {
          setBrandSystem(JSON.parse(stored))
          setLoading(false)
          return
        } catch (e) {
          console.warn('Failed to parse stored brand system')
        }
      }

      // Otherwise, fetch from API (if projectId exists)
      if (params.id && params.id !== 'temp') {
        try {
          const response = await fetch(`/api/projects?projectId=${params.id}`)
          if (response.ok) {
            const result = await response.json()
            if (result.data && result.data.brand_system) {
              setBrandSystem(result.data.brand_system)
            } else {
              setError('Brand system not found')
            }
          } else {
            setError('Failed to load brand system')
          }
        } catch (err) {
          console.error('Error loading brand system:', err)
          setError('Failed to load brand system')
        }
      }
      setLoading(false)
    }

    loadBrandSystem()
  }, [params.id])

  const handleExportPDF = async () => {
    if (!brandSystem) return

    try {
      const response = await fetch('/api/export-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandSystem,
          brandName: 'Brand Kit',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to export PDF')
      }

      const result = await response.json()
      window.open(result.data.pdfUrl, '_blank')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF'
      setError(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brand system...</p>
        </div>
      </div>
    )
  }

  if (!brandSystem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Brand system not found</p>
          <button
            onClick={() => router.push('/analyze')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Analyze Website
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Brand System</h1>
            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* Colors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Brand Colors</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Primary Colors</h3>
              <div className="flex flex-wrap gap-4">
                {brandSystem.colors.primary.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono text-gray-700 mt-2">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Secondary Colors</h3>
              <div className="flex flex-wrap gap-4">
                {brandSystem.colors.secondary.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono text-gray-700 mt-2">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Typography Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Typography</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Primary Font</h3>
              <p
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: brandSystem.typography.primary.name }}
              >
                {brandSystem.typography.primary.name}
              </p>
              <p className="text-sm text-gray-600">
                Weights: {brandSystem.typography.primary.weights.join(', ')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Secondary Font</h3>
              <p
                className="text-3xl mb-2"
                style={{ fontFamily: brandSystem.typography.secondary.name }}
              >
                {brandSystem.typography.secondary.name}
              </p>
              <p className="text-sm text-gray-600">
                Weights: {brandSystem.typography.secondary.weights.join(', ')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Voice Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Brand Voice</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Tagline</h3>
              <p className="text-xl text-gray-900">{brandSystem.voice.tagline}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Elevator Pitch</h3>
              <p className="text-gray-700">{brandSystem.voice.elevatorPitch}</p>
            </div>

            {brandSystem.voice.valueProps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Value Propositions</h3>
                <ul className="space-y-2">
                  {brandSystem.voice.valueProps.map((prop, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="text-gray-700">{prop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/templates/temp')}
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-xl flex items-center gap-2 mx-auto"
          >
            View Templates
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

