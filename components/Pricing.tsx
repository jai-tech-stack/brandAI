'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles, Zap, Crown, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Choose Your Plan</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-10 hover:border-primary-300 transition-premium shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 brand system generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic color & typography extraction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3 assets per system</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Logo generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 line-through">Social templates</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full px-6 py-3.5 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-premium text-center"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-10 text-white relative transform scale-105 md:scale-110 shadow-2xl border-4 border-white"
          >
            <div className="absolute top-6 right-6">
              <span className="px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Pro</h3>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-white/80 text-lg">/month</span>
                <p className="text-sm text-white/70 mt-1">or $290/year (save 17%)</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Unlimited brand systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Unlimited assets per system</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">AI logo generation & variations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Social media templates (all platforms)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">PDF brand kit export</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="font-medium">Priority processing</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="block w-full px-6 py-3.5 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-50 transition-premium shadow-lg hover:shadow-xl text-center transform hover:scale-105"
              >
                Start 14-Day Free Trial
              </Link>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-10 hover:border-purple-300 transition-premium shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">Custom</span>
                <p className="text-sm text-gray-600 mt-1">Tailored to your needs</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">REST API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">24/7 priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">SLA guarantee</span>
                </li>
              </ul>
              <Link
                href="/contact?type=enterprise"
                className="block w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-primary-700 transition-premium shadow-lg hover:shadow-xl text-center"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

