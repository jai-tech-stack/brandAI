'use client'

import { useState } from 'react'
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
        <section id="generator" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Generate Your Complete Brand System
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Enter your website URL and get everything you need—colors, logos, typography, templates, and more.
              </p>
            </div>
            <CompleteBrandSystem />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

