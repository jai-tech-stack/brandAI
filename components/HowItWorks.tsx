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
    title: 'Edit & Refine in Real-Time',
    description: 'Watch your brand system generate with live progress updates. Then use our unique brand editor to tweak colors and fonts before generating assets—something no other tool offers.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Generate Unlimited Assets',
    description: 'Create 10+ social templates, unlimited regenerations, and custom assets—all perfectly on-brand. Export to PDF, CSS, Figma, or Sketch. Full ownership, zero restrictions.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            How it works
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-light">
            Enter your website URL. We analyze it and generate your complete brand system.
          </p>
        </motion.div>

        {/* Minimal steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                  <Icon className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

