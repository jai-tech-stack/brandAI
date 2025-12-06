'use client'

import { motion } from 'framer-motion'
import { Globe, Sparkles, Download, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Globe,
    title: 'Enter Your Website URL',
    description: 'Simply paste your website URL. Our AI agent analyzes your site\'s visual identity, content, and design patterns.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Generates Complete System',
    description: 'In seconds, receive your complete brand system: primary & secondary colors, typography pairings, logo alternatives, and visual moodboard.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download & Use Instantly',
    description: 'Get social templates, banner designs, pitch-deck visuals, and brand messaging—all perfectly on-brand and ready to use.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How BloomboxAI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            In one sentence: <strong className="text-gray-900">Upload your website → AI analyzes → full brand system generated.</strong>
          </p>
          <p className="text-lg text-gray-700 mt-4">
            And it includes a LOT 👇
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="mt-2 text-3xl font-bold text-gray-300">{step.number}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What You Get in Your Brand System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Brand Primary & Secondary Colors',
              'Logo Concepts & Alternatives',
              'Typography Pairings',
              'Visual Moodboard',
              'Banner & Ad Templates',
              'Social Media Content Templates',
              'Pitch-Deck Visual Kit',
              'Brand Tone & Messaging Suggestions',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

