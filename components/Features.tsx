'use client'

import { motion } from 'framer-motion'
import { Globe, Wand2, Layers, Zap, Users, FileImage } from 'lucide-react'
import SocialTags from './SocialTags'

const features = [
  {
    icon: Globe,
    title: 'Full Brand System Extraction',
    description: 'Autonomous AI agent extracts complete brand identity—logo, colors, typography, style—from any website instantly',
    color: 'primary',
  },
  {
    icon: Wand2,
    title: 'Generate Any Brand Asset',
    description: 'Agentic AI creates hiring posters, merch, marketing materials, social media—all perfectly on-brand',
    color: 'purple',
  },
  {
    icon: FileImage,
    title: 'Simple Text Prompts',
    description: 'Just describe what you need. Autonomous AI agent generates professional brand assets—no design skills required',
    color: 'pink',
  },
  {
    icon: Layers,
    title: 'Multi-Brand Management',
    description: 'AI agent manages multiple brands simultaneously. Switch between Gumroad, Ulysses, HFØ, and more instantly',
    color: 'blue',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'From website URL to complete brand system in seconds. Agentic AI works at lightning speed',
    color: 'yellow',
  },
  {
    icon: Users,
    title: 'Complete Brand Kit',
    description: 'Autonomous AI agent builds your entire brand kit automatically—colors, fonts, logos, style guide, all ready to use',
    color: 'green',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Brand Assets Made Effortless
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Distill your website into a dynamic brand system. Generate any brand asset in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClasses = {
              primary: 'bg-primary-100 text-primary-600',
              purple: 'bg-purple-100 text-purple-600',
              pink: 'bg-pink-100 text-pink-600',
              blue: 'bg-blue-100 text-blue-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              green: 'bg-green-100 text-green-600',
            }

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all bg-white"
              >
                <div className={`w-12 h-12 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 space-y-8"
        >
          <div className="text-center">
            <div className="inline-block p-8 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-200">
              <p className="text-lg text-gray-700 mb-4">
                <strong className="text-gray-900">Tech enthusiasts:</strong> Experience the power of Agentic AI—autonomous agents that work independently to deliver perfect brand assets.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                <strong className="text-gray-900">Marketing teams:</strong> Let our AI agent maintain perfect brand consistency across all assets effortlessly—no manual oversight needed.
              </p>
              <p className="text-lg text-gray-700">
                <strong className="text-gray-900">Designers:</strong> Generate on-brand assets instantly with an autonomous AI agent that understands your brand identity.
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SocialTags />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

