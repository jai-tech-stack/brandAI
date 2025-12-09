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
        
        {/* Main Generator Section - Enhanced Premium Design */}
        <section id="generator" className="relative section-padding bg-gradient-to-b from-white via-purple-50/20 via-pink-50/10 to-white overflow-hidden">
          {/* Enhanced Premium background with better visibility */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-purple-200/20 via-pink-200/15 to-primary-200/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-pink-200/20 via-purple-200/15 to-primary-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          
          <div className="container-responsive relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-high-contrast mb-4 sm:mb-6 leading-tight">
                Generate Your Complete
                <br className="hidden sm:block" />
                <span className="gradient-text-enhanced">Brand System</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-readable max-w-3xl mx-auto px-4 sm:px-0">
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

