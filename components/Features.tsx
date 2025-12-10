'use client'

import { motion } from 'framer-motion'
import { Palette, Type, Image as ImageIcon, Layers, FileText, Presentation, Instagram, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Live Color Editor',
    description: 'Extract colors with 100% accuracy, then edit them in real-time. Add, remove, or modify colors before generating assets—only BrandForge offers this.',
    color: 'primary',
  },
  {
    icon: ImageIcon,
    title: 'Unlimited Logo Regeneration',
    description: 'Generate logo concepts, then regenerate endlessly until perfect. Pro users get unlimited regenerations—no credit limits on style variations.',
    color: 'purple',
  },
  {
    icon: Type,
    title: 'Editable Typography System',
    description: 'Extract fonts with clean, URL-decoded names (not encoded strings). Edit primary and secondary fonts in real-time with our brand editor.',
    color: 'pink',
  },
  {
    icon: Layers,
    title: 'Complete Visual Identity',
    description: 'Get moodboards, style guides, and brand aesthetics—all generated automatically. Then refine and perfect with our live editor before exporting.',
    color: 'blue',
  },
  {
    icon: FileText,
    title: '10 Social Templates (vs. 5)',
    description: 'Instagram, Twitter, LinkedIn, TikTok, Stories, Reels, Pinterest, Facebook, YouTube, and Hero Banners. More templates than any competitor.',
    color: 'yellow',
  },
  {
    icon: Instagram,
    title: 'Real-Time Progress Tracking',
    description: 'Watch your brand system generate with live progress updates. Know exactly what\'s happening at each step—no black box, full transparency.',
    color: 'green',
  },
  {
    icon: Presentation,
    title: 'Multiple Export Formats',
    description: 'Export to PDF, CSS, SCSS, Tailwind, Figma, or Sketch. Full ownership, zero restrictions. Use your brand assets anywhere, any way you want.',
    color: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'Smart Error Handling',
    description: 'If generation fails, credits are automatically refunded. Get helpful error messages with actionable suggestions—not just generic errors.',
    color: 'purple',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Everything you need
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-light">
            Complete brand systems with colors, fonts, logos, and templates—all generated in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <div className="w-10 h-10 mb-4 text-gray-400">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
