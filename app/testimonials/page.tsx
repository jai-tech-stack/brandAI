'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Quote, Star, CheckCircle2 } from 'lucide-react'

const testimonials = [
  {
    name: 'Small Business Owner',
    role: 'Candle Business',
    quote: 'I built a complete brand kit in hours instead of weeks. The result looked way more cohesive than I expected. My friend thought I had outsourced it to a full creative team.',
    rating: 5,
    highlight: 'Complete brand kit in hours',
  },
  {
    name: 'Solo Founder',
    role: 'Tech Startup',
    quote: 'Got logo, tagline, colors, fonts, and even a tiny script for an ad—all in minutes. For a quick ad-making experiment, the kit was incredibly useful.',
    rating: 5,
    highlight: 'Everything in minutes',
  },
  {
    name: 'Content Creator',
    role: 'Indie Creator',
    quote: 'Instant multi-option generation with context-aware recommendations. Zero design experience needed. Perfect for getting started quickly.',
    rating: 5,
    highlight: 'Zero design experience needed',
  },
  {
    name: 'Early-Stage Founder',
    role: 'Side Project',
    quote: 'Generated a full brand-book in minutes—something that would\'ve taken weeks with a designer. The cost savings are incredible for early-stage projects.',
    rating: 5,
    highlight: 'Minutes vs. weeks',
  },
]

const useCases = [
  {
    title: 'Rapid Brand-Kit Creation',
    description: 'Users report building complete brand identity in hours instead of days or weeks',
    icon: '⚡',
    examples: [
      'Complete brand kit (logo + colors + fonts + templates) in hours',
      'Friend thought it was "outsourced to full creative team"',
      'Way more cohesive than expected',
    ],
  },
  {
    title: 'Cost-Effective Solution',
    description: 'Fraction of designer costs with professional results',
    icon: '💰',
    examples: [
      'Full brand-book in minutes vs. weeks',
      'Attractive for early-stage founders with limited budgets',
      'Unlimited generations without extra cost',
    ],
  },
  {
    title: 'Good Starting Point',
    description: 'Perfect foundation for iteration and refinement',
    icon: '🎨',
    examples: [
      'Use as starting point to iterate upon',
      'Good for prototyping and experimentation',
      'Can hand off to human designer for refinement',
    ],
  },
]

const considerations = [
  {
    title: 'Generic Output Risk',
    description: 'AI outputs may look similar—refinement recommended for uniqueness',
    icon: '⚠️',
  },
  {
    title: 'MVP/Early Stage Focus',
    description: 'Best for prototypes and early-stage, less ideal for long-term high-stakes branding',
    icon: '🚀',
  },
  {
    title: 'Refinement Recommended',
    description: 'Use AI as foundation, then refine manually or with designer for final brand',
    icon: '✨',
  },
]

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Real User Experiences
            </h1>
            <p className="text-xl text-gray-600">
              Based on real feedback from users of AI branding tools
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-200 mb-4" />
                <p className="text-gray-700 mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                    {testimonial.highlight}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What Actually Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
                >
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-700 mb-4 text-sm">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Considerations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Important Considerations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {considerations.map((consideration, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
                >
                  <div className="text-4xl mb-4">{consideration.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{consideration.title}</h3>
                  <p className="text-gray-700 text-sm">{consideration.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Try BloomboxAI?</h2>
              <p className="text-gray-600 mb-6">
                Join users who are building professional brand systems in minutes
              </p>
              <a
                href="/#generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Generate Your Brand System
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

