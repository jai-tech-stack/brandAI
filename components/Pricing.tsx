'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles, Zap, Crown, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  return (
    <section id="pricing" className="relative py-24 bg-gradient-to-b from-white via-purple-50/20 via-pink-50/10 to-white overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <div className="container-premium relative z-10">
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
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get more credits to continue generating brand systems.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Annual <span className="text-sm text-green-600 ml-1">Save 20%</span>
            </button>
          </div>

          {/* Credit Info */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-800">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                1 credit = 1 complete brand system
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-premium hover:border-purple-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-600">Get started with BloomboxAI</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-semibold text-yellow-800">6 credits/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">6 credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Credits reset monthly</span>
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

          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-premium hover:border-purple-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Starter</h3>
                <p className="text-sm text-gray-600">For occasional creators</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === 'annual' ? '8' : '8'}
                </span>
                <span className="text-gray-600 text-lg">/mo</span>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-gray-500 mt-1">$96 billed annually</p>
                )}
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-semibold text-yellow-800">25 credits/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">25 credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Credits reset monthly</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=starter"
                className="block w-full px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-premium text-center"
              >
                Upgrade
              </Link>
            </div>
          </motion.div>

          {/* Plus Plan - Recommended */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-10 text-white relative shadow-premium-lg border-4 border-white/20 backdrop-blur-sm group overflow-hidden"
          >
            {/* Recommended Badge */}
            <div className="absolute top-6 right-6 z-10">
              <span className="px-4 py-1.5 bg-purple-500/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/30">
                Recommended
              </span>
            </div>
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-1">Plus</h3>
                <p className="text-white/80 text-sm">For regular creators</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold">
                  ${billingCycle === 'annual' ? '16' : '16'}
                </span>
                <span className="text-white/80 text-lg">/mo</span>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-white/70 mt-1">$192 billed annually</p>
                )}
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 border border-yellow-300/50 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="text-sm font-semibold text-yellow-100">50 credits/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">50 credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">Credits reset monthly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">Priority support</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=plus"
                className="block w-full px-6 py-3.5 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-50 transition-premium shadow-lg hover:shadow-xl text-center transform hover:scale-105"
              >
                Upgrade
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-premium hover:border-purple-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Pro</h3>
                <p className="text-sm text-gray-600">For power users</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === 'annual' ? '28' : '28'}
                </span>
                <span className="text-gray-600 text-lg">/mo</span>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-gray-500 mt-1">$336 billed annually</p>
                )}
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-semibold text-yellow-800">100 credits/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">100 credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Credits reset monthly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Priority support</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="block w-full px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-premium text-center"
              >
                Upgrade
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600">
            Need more? <Link href="/contact?type=enterprise" className="text-primary-600 font-semibold hover:text-primary-700 underline">Contact us</Link> for enterprise pricing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

