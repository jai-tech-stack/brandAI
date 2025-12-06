'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Palette } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white text-sm font-bold mb-8 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Your Brand Guardian Angel ✨</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            One Click Gives You
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Complete Brand System
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Brand colors, logo directions, typography, social templates, visual identity—all generated from your website in seconds.
          </p>

          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-10 font-medium">
            For small teams, indie founders, and non-designers—this feels like having a full-time brand design team on standby.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
              Generate Your Brand System Now
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-200 hover:border-primary-300">
              See How It Works
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Minutes, Not Weeks</h3>
              <p className="text-sm text-gray-600 text-center">From website to complete brand system in seconds</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Quality</h3>
              <p className="text-sm text-gray-600 text-center">Genuinely good results—better than cheap outsourcing</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Endless Exploration</h3>
              <p className="text-sm text-gray-600 text-center">Regenerate, refine, try new styles—no extra cost</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

