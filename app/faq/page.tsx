'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { HelpCircle, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How does BloomboxAI work?',
        a: 'Simply enter your website URL. Our autonomous AI agents analyze your site, extract colors, fonts, and content, then generate a complete brand system including logos, templates, and messaging suggestions—all in seconds.',
      },
      {
        q: 'Do I need design skills to use BloomboxAI?',
        a: 'No! BloomboxAI is designed for non-designers. Just enter your website URL and get a complete brand system automatically. No design skills required.',
      },
      {
        q: 'How long does it take to generate a brand system?',
        a: 'Typically 30-60 seconds. Our autonomous AI agents work quickly to analyze your site and generate all brand assets.',
      },
    ],
  },
  {
    category: 'Quality & Outputs',
    questions: [
      {
        q: 'How unique are the generated logos and designs?',
        a: 'AI-generated designs are professional starting points. Real users report getting cohesive brand kits quickly, but for truly unique, memorable brand identities, manual refinement is recommended. BloomboxAI is perfect for MVPs and early-stage projects—many users generate in hours what would take weeks with designers.',
      },
      {
        q: 'Will the templates work across all platforms?',
        a: 'Yes! We generate templates for web, social media, banners, and pitch decks. Real users find them useful for rapid prototyping. However, you may want to customize templates for specific platforms or use cases, especially for long-term brand use.',
      },
      {
        q: 'How accurate is the brand tone and messaging?',
        a: 'Our AI analyzes your website content to suggest brand tone and messaging. These are starting points—we recommend reviewing and refining based on your brand strategy, target audience, and cultural context. Expert reviews note AI may miss nuanced cultural or contextual details.',
      },
      {
        q: 'Do the outputs look generic or template-driven?',
        a: 'AI tools can produce similar-looking outputs. BloomboxAI generates based on YOUR unique website, which helps. However, for maximum uniqueness, we recommend refining outputs manually. Many users successfully use AI outputs as a foundation, then customize for distinctiveness.',
      },
    ],
  },
  {
    category: 'Legal & Usage',
    questions: [
      {
        q: 'Do I own the generated assets?',
        a: 'Yes! You have full rights to use the generated assets. However, we recommend conducting trademark searches for logos and ensuring designs are unique before finalizing.',
      },
      {
        q: 'Are the designs trademark-safe?',
        a: 'AI-generated designs may be similar to existing brands. We recommend conducting trademark searches and ensuring uniqueness before commercial use, especially for logos.',
      },
      {
        q: 'Can I use generated assets commercially?',
        a: 'Yes, you can use generated assets commercially. However, ensure designs are unique and don\'t conflict with existing trademarks or copyrights.',
      },
    ],
  },
  {
    category: 'Best Use Cases',
    questions: [
      {
        q: 'Who is BloomboxAI best for?',
        a: 'Perfect for indie developers, solo founders, small startups, content creators, and anyone who needs professional branding fast without design skills or large budgets. Real users report building complete brand kits in hours instead of weeks, at a fraction of designer costs.',
      },
      {
        q: 'Is BloomboxAI suitable for established brands?',
        a: 'BloomboxAI is best for MVPs, early-stage projects, and rapid prototyping. Real user feedback shows AI tools shine for prototypes and early-stage, but established brands typically need more custom, unique branding. Many users use AI as a starting point, then refine with human designers.',
      },
      {
        q: 'What if my website is minimal or poorly designed?',
        a: 'The quality of your website affects the output. For best results, ensure your website represents your brand well. Consider refining your site before generating a brand system. Better input = better output.',
      },
      {
        q: 'Can I use BloomboxAI for long-term brand identity?',
        a: 'AI tools are great for MVPs and early-stage, but for long-term brand building (uniqueness, emotional resonance, print materials), treat AI output as a starting point. Plan to refine design manually or with a human designer for final brand identity.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What if Supabase is not configured?',
        a: 'BloomboxAI works in demo mode without authentication. You can test brand generation, but full features (saving projects, user accounts) require Supabase setup.',
      },
      {
        q: 'Can I regenerate brand systems?',
        a: 'Yes! Generate as many brand systems as you need. Each generation creates new variations based on your website.',
      },
      {
        q: 'How do I download the generated assets?',
        a: 'All generated assets have download buttons. Click to open in a new tab, then save the images. Assets are high-resolution PNGs ready to use.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Know
            </h1>
            <p className="text-xl text-gray-600">
              Transparent answers about BloomboxAI's capabilities, limitations, and best use cases
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-12"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Transparency Notice</h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  BloomboxAI is designed for speed, accessibility, and rapid iteration. Based on real user feedback: AI tools excel at rapid brand-kit creation (hours vs. weeks) and cost-effectiveness, but outputs may need refinement for uniqueness. Perfect for MVPs, early-stage projects, and rapid prototyping. For long-term brand identity, treat AI output as a starting point and refine with human design expertise.
                </p>
                <div className="bg-blue-100 rounded-lg p-3 mt-3">
                  <p className="text-blue-900 text-xs font-semibold mb-1">Real User Insights:</p>
                  <ul className="text-blue-800 text-xs space-y-1 list-disc list-inside">
                    <li>✅ Users report building complete brand kits in hours (vs. weeks with designers)</li>
                    <li>✅ Cost-effective: fraction of designer costs</li>
                    <li>⚠️ Outputs may look generic—refinement recommended for uniqueness</li>
                    <li>⚠️ Best for MVPs/early-stage, less ideal for long-term high-stakes branding</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQs by Category */}
          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * categoryIndex }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                  {category.category}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        {faq.q}
                      </h3>
                      <p className="text-gray-600 ml-7 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Best Practices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8 border border-primary-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Use as a starting point, then refine manually',
                'Generate multiple variations to explore options',
                'Test templates across different platforms',
                'Review messaging for cultural context',
                'Conduct trademark searches for logos',
                'Ensure website quality for best results',
              ].map((practice, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6">
                Generate your complete brand system in seconds
              </p>
              <a
                href="/#generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
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

