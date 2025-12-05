'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import BrandExtractor from '@/components/BrandExtractor'
import AssetGenerator from '@/components/AssetGenerator'
import BrandKits from '@/components/BrandKits'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'extract' | 'generate' | 'kits'>('extract')

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveSection('extract')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeSection === 'extract'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Extract Brand
              </button>
              <button
                onClick={() => setActiveSection('generate')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeSection === 'generate'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate Assets
              </button>
              <button
                onClick={() => setActiveSection('kits')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeSection === 'kits'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Brand Kits
              </button>
            </div>
          </div>

          {activeSection === 'extract' && <BrandExtractor />}
          {activeSection === 'generate' && <AssetGenerator />}
          {activeSection === 'kits' && <BrandKits />}
        </div>
      </div>
      <Footer />
    </main>
  )
}

