'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Users, Zap, Award } from 'lucide-react'

export default function WhyBrandForge() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why BrandForge Beats the Competition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're not just another brand generator. We're the only platform that gives you <span className="font-semibold text-purple-600">complete control</span> over your brand before you generate assets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Users,
              title: 'Live Brand Editor (We\'re the Only One)',
              description: 'Edit colors and fonts in real-time before generating assets. Other tools lock you into their output—we give you control.',
            },
            {
              icon: Zap,
              title: '10 Social Templates vs. Their 5',
              description: 'More templates, unlimited regenerations, and real-time progress tracking. We don\'t just generate—we help you perfect.',
            },
            {
              icon: Award,
              title: '100% Accurate Extraction',
              description: 'Multi-method color extraction, URL-decoded fonts, and intelligent filtering. We get your brand right the first time, every time.',
            },
          ].map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Perfect For Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-primary-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Who is BrandForge Perfect For?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Indie developers',
              'Content creators',
              'Small startups',
              'PM/ops who need visuals fast',
              'Non-designers',
              'Anyone who wants their project to look more professional',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transparency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Important to Know</h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-3">
              BrandForge generates professional brand systems quickly—perfect for MVPs, early-stage projects, and rapid iteration. AI outputs are great starting points that may need refinement for truly unique brand identities. For established brands or highly custom needs, consider combining AI generation with human design expertise.
            </p>
            <p className="text-blue-700 text-xs">
              <strong>Best for:</strong> Indie builders, startups, content creators | <strong>Consider refinement for:</strong> Highly unique identities, complex brand strategies, legal requirements
            </p>
          </div>
        </motion.div>

        {/* One-Sentence Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-white rounded-2xl p-8 shadow-xl border-2 border-primary-200">
            <p className="text-xl font-bold text-gray-900 mb-2">🪄 One-Sentence Summary</p>
            <p className="text-2xl text-gray-800 mb-4">
              <strong className="text-primary-600">BrandForge = "Turning branding from a week-long process into a few minutes."</strong>
            </p>
            <p className="text-lg text-gray-600">
              In the AI era, even branding is automatic now.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

