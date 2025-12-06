'use client'

import { motion } from 'framer-motion'
import { Globe, Wand2, Layers, Zap, Users, FileImage } from 'lucide-react'
import SocialTags from './SocialTags'

const features = [
  {
    icon: Globe,
    title: 'Brand Primary & Secondary Colors',
    description: 'AI extracts your exact color palette from your website—primary, secondary, and accent colors automatically identified',
    color: 'primary',
  },
  {
    icon: Wand2,
    title: 'Logo Concepts & Alternatives',
    description: 'Generate logo directions and alternatives based on your existing brand identity—endless variations',
    color: 'purple',
  },
  {
    icon: FileImage,
    title: 'Typography Pairings',
    description: 'Perfect font combinations extracted from your site, with pairing suggestions for all brand assets',
    color: 'pink',
  },
  {
    icon: Layers,
    title: 'Social Media Templates',
    description: 'Banner & ad templates, social content templates—all perfectly on-brand and ready to use',
    color: 'blue',
  },
  {
    icon: Zap,
    title: 'Visual Moodboard',
    description: 'Complete visual identity system with moodboards, style guides, and brand tone suggestions',
    color: 'yellow',
  },
  {
    icon: Users,
    title: 'Pitch-Deck Visual Kit',
    description: 'Professional pitch-deck visuals, brand messaging suggestions, and complete visual identity—all in one click',
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
            How BloomboxAI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            In one sentence: <strong>Upload your website → AI analyzes → full brand system generated.</strong>
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            And it includes a LOT 👇
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
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why BloomboxAI is Blowing Up</h3>
                <div className="space-y-3 text-left">
                  <p className="text-lg text-gray-700">
                    <strong className="text-gray-900">① Every startup needs branding</strong><br />
                    But hiring a designer is expensive and slow. BloomboxAI gives you a professional brand system in minutes.
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-gray-900">② Everyone wants to launch fast & iterate fast</strong><br />
                    AI lets you get a complete brand identity instantly, then regenerate and refine endlessly.
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="text-gray-900">③ The results are genuinely good</strong><br />
                    Not random collages—the AI pulls your site's content, tone, and visual cues, then extends it into a consistent brand identity.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who is BloomboxAI Perfect For?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✔️</span>
                    <span className="text-gray-700">Indie developers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✔️</span>
                    <span className="text-gray-700">Content creators</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✔️</span>
                    <span className="text-gray-700">Small startups</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✔️</span>
                    <span className="text-gray-700">PM/ops who need visuals fast</span>
                  </div>
                  <div className="flex items-start gap-2 md:col-span-2">
                    <span className="text-green-600 font-bold">✔️</span>
                    <span className="text-gray-700">Anyone who wants their project to look more professional</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border-2 border-primary-200">
                <p className="text-xl font-bold text-gray-900 mb-2">🪄 One-Sentence Summary</p>
                <p className="text-lg text-gray-700">
                  <strong>BloomboxAI = "Turning branding from a week-long process into a few minutes."</strong>
                </p>
                <p className="text-base text-gray-600 mt-2">
                  In the AI era, even branding is automatic now.
                </p>
              </div>
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

