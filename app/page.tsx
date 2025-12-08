'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import WhyBloomboxAI from '@/components/WhyBloomboxAI'
import Pricing from '@/components/Pricing'
import CompleteBrandSystem from '@/components/CompleteBrandSystem'
import Footer from '@/components/Footer'

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <WhyBloomboxAI />
        <Pricing />
        
        {/* Main Generator Section */}
        <section id="generator" className="relative py-24 bg-gradient-to-b from-white via-purple-50/20 to-white overflow-hidden">
          {/* Premium background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Generate Your Complete
                <br />
                <span className="gradient-text">Brand System</span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
                Enter your website URL and get everything you need—colors, logos, typography, templates, and more.
              </p>
            </motion.div>
            <CompleteBrandSystem />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

