'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2, Zap, TrendingUp, Infinity, Target as TargetIcon } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Beautiful illustrated background - serene landscape */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Simplified gradient background with nature-inspired colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 via-purple-50/20 to-blue-50/30"></div>
        
        {/* Decorative elements - simplified */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Main Headline - Large serif font */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Brand Assets
          </h1>
          
          {/* Sub-headline - Purple italicized */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal italic text-purple-600 mb-8">
            made effortless
          </h2>
          
          {/* Descriptive Text - Simple and clean */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
            Distill your website into a living brand system.
            <br />
            Generate brand assets in seconds.
          </p>

          {/* Input Field - Clean and prominent */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-3 items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
              <input
                type="text"
                placeholder="yourwebsite.com"
                className="flex-1 px-6 py-4 text-lg border-none outline-none bg-transparent text-gray-900 placeholder-gray-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const element = document.getElementById('generator')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const element = document.getElementById('generator')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center text-white transition-colors shadow-md"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* "or continue with" option */}
          <p className="text-gray-500 mb-4">or continue with</p>
          
          {/* Recent brand dropdown - placeholder */}
          <div className="max-w-xs mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recent brand</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
