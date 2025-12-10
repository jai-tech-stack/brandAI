'use client'

import { motion } from 'framer-motion'
import { Twitter, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const hashtags = [
  '#AI',
  '#AITech',
  '#TechInnovation',
  '#AIRevolution',
  '#BrandForge',
  '#BrandAI',
  '#TechBreakthrough',
  '#Innovation',
  '#ArtificialIntelligence',
  '#ContentCreation',
  '#BrandAssets',
  '#OnBrandAI',
  '#MarketingAI',
]

export default function SocialTags() {
  const [copied, setCopied] = useState(false)
  const tagString = hashtags.join(' ')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tagString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Twitter className="w-5 h-5 text-primary-600" />
          Share BrandForge
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Join the conversation about the future of AI-powered brand asset generation
      </p>
    </motion.div>
  )
}

