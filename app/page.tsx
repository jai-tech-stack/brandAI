'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import CompleteBrandSystem from '@/components/CompleteBrandSystem'
import Footer from '@/components/Footer'

export default function Home() {
  const [generatedBrandSystem, setGeneratedBrandSystem] = useState<any>(null)

  useEffect(() => {
    // Listen for brand generation from Hero
    const handleBrandGenerated = (event: CustomEvent) => {
      setGeneratedBrandSystem(event.detail)
    }

    window.addEventListener('brandGenerated', handleBrandGenerated as EventListener)
    return () => {
      window.removeEventListener('brandGenerated', handleBrandGenerated as EventListener)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        
        {/* Results Section - Show when brand is generated */}
        {generatedBrandSystem && (
          <section id="generator" className="relative section-padding bg-white">
            <div className="container-responsive relative z-10">
              <CompleteBrandSystem initialBrandSystem={generatedBrandSystem} />
            </div>
          </section>
        )}

        {/* Features and other sections - only show if no brand generated yet */}
        {!generatedBrandSystem && (
          <>
            <Features />
            <HowItWorks />
            <Pricing />
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}

