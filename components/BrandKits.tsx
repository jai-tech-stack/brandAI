'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, Palette, Type, Image as ImageIcon, Trash2, Plus } from 'lucide-react'

interface BrandKit {
  id: string
  name: string
  url: string
  logo?: string
  colors: string[]
  typography: string[]
  style: string
}

export default function BrandKits() {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrandKits()
  }, [])

  const fetchBrandKits = async () => {
    try {
      const response = await fetch('/api/brand-kits')
      if (response.ok) {
        const result = await response.json()
        setBrandKits(result.data)
      }
    } catch (error: unknown) {
      console.error('Failed to fetch brand kits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/brand-kits?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setBrandKits(brandKits.filter((kit) => kit.id !== id))
      }
    } catch (error: unknown) {
      console.error('Failed to delete brand kit:', error)
    }
  }
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Brand Kits</h2>
              <p className="text-gray-600">Manage all your brand identities in one place</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchBrandKits}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Refresh
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Brand
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{kit.name}</h3>
                  <p className="text-sm text-gray-600">{kit.url}</p>
                </div>
                <button
                  onClick={() => handleDelete(kit.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {kit.logo && (
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Colors</span>
                  </div>
                  <div className="flex gap-2">
                    {kit.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Typography</span>
                  </div>
                  <div className="space-y-1">
                    {kit.typography.map((font, i) => (
                      <div key={i} className="text-sm text-gray-700" style={{ fontFamily: font }}>
                        {font}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Style</span>
                  <p className="text-sm text-gray-600 mt-1">{kit.style}</p>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Use This Brand
              </button>
            </motion.div>
          ))}
        </div>

        {!loading && brandKits.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No brand kits yet</h3>
            <p className="text-gray-600 mb-6">Extract your first brand identity to get started</p>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Extract Brand
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

