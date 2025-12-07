'use client'

import { motion } from 'framer-motion'
import { Palette, Type, Image as ImageIcon, Layers, FileText, Presentation, Instagram, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Brand Primary & Secondary Colors',
    description: 'Autonomous AI agent extracts your exact color palette from your website—primary, secondary, and accent colors automatically identified and categorized with 100% accuracy.',
    color: 'primary',
  },
  {
    icon: ImageIcon,
    title: 'Logo Concepts & Alternatives',
    description: 'Agentic AI generates logo directions and alternatives based on your existing brand identity—endless variations created autonomously, all perfectly on-brand.',
    color: 'purple',
  },
  {
    icon: Type,
    title: 'Typography Pairings',
    description: 'Autonomous AI agent extracts perfect font combinations from your site, with intelligent pairing suggestions optimized for all brand assets.',
    color: 'pink',
  },
  {
    icon: Layers,
    title: 'Visual Moodboard',
    description: 'AI agent autonomously creates complete visual identity system with moodboards, style guides, and brand aesthetic suggestions—all generated automatically.',
    color: 'blue',
  },
  {
    icon: FileText,
    title: 'Banner & Ad Templates',
    description: 'Agentic AI generates professional banner and ad templates autonomously—all perfectly on-brand and ready to customize for your campaigns.',
    color: 'yellow',
  },
  {
    icon: Instagram,
    title: 'Social Media Templates',
    description: 'Autonomous AI agent creates social content templates for Instagram, Twitter, LinkedIn—all perfectly on-brand and ready to use across platforms.',
    color: 'green',
  },
  {
    icon: Presentation,
    title: 'Pitch-Deck Visual Kit',
    description: 'Agentic AI autonomously generates professional pitch-deck visuals, brand messaging suggestions, and complete visual identity—all in one click.',
    color: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'Brand Tone & Messaging',
    description: 'Autonomous AI agent analyzes brand tone and generates messaging suggestions that align perfectly with your visual identity—all done automatically.',
    color: 'purple',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need in One Brand System
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From colors to templates—your complete brand identity, generated instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClasses = {
              primary: 'bg-primary-100 text-primary-600',
              purple: 'bg-purple-100 text-purple-600',
              pink: 'bg-pink-100 text-pink-600',
              blue: 'bg-blue-100 text-blue-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              green: 'bg-green-100 text-green-600',
              indigo: 'bg-indigo-100 text-indigo-600',
            }

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all bg-white"
              >
                <div className={`w-12 h-12 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
