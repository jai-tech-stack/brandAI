'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Instagram, Linkedin, Twitter, Youtube, Download, Image as ImageIcon } from 'lucide-react'

export default function TemplatesPage() {
  const params = useParams()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load brand system from sessionStorage
    const stored = sessionStorage.getItem('brandSystem')
    if (stored) {
      try {
        const brandSystem = JSON.parse(stored)
        
        // Generate templates
        fetch('/api/generate-templates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            brandSystem: {
              colors: brandSystem.colors,
              voice: brandSystem.voice,
            },
            logoUrl: brandSystem.logos?.icon?.[0],
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setTemplates(data.data.templates)
            }
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
      } catch (e) {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [params.id])

  const getIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return Instagram
      case 'linkedin':
        return Linkedin
      case 'twitter':
        return Twitter
      case 'youtube':
        return Youtube
      default:
        return ImageIcon
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating templates...</p>
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
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Social Templates</h1>
          <p className="text-xl text-gray-600">Download ready-to-use templates for your social media</p>
        </motion.div>

        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 mb-4">No templates available</p>
            <p className="text-sm text-gray-500">Templates will be generated automatically after brand analysis</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => {
              const Icon = getIcon(template.type)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div
                    className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative"
                    style={{
                      aspectRatio: `${template.width} / ${template.height}`,
                    }}
                  >
                    <Icon className="w-12 h-12 text-gray-400" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {template.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                      {template.type} Template
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.width} × {template.height}px
                    </p>
                    <button
                      onClick={() => {
                        if (template.url) {
                          window.open(template.url, '_blank')
                        }
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

