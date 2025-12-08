'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2, Zap, TrendingUp, Infinity, Target as TargetIcon } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 via-pink-50/30 to-white pt-20 sm:pt-24 pb-20 sm:pb-24">
      {/* Premium animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-primary-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Premium grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
      </div>
      
      <div className="relative container-premium z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-purple-200/50 text-purple-700 text-sm font-semibold mb-8 shadow-premium"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Your Brand Guardian Angel
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight text-balance">
            Professional Brand System
            <br />
            <span className="gradient-text">
              In Minutes, Not Days
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Extract your brand identity with <span className="font-bold text-purple-600">100% accuracy</span>, 
            generate unlimited style variations, and explore endless possibilities—<span className="font-semibold">all free</span>.
          </p>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed font-medium text-balance">
            Brand colors, logo directions, typography, social templates, visual identity—all generated from your website in seconds.
          </p>

          {/* Value Proposition */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 text-balance">
            For small teams, indie founders, and non-designers—this feels like having a full-time brand design team on standby.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={() => {
                const element = document.getElementById('generator')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-premium hover:shadow-glow-lg transition-premium transform hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Zap className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Generate Your Brand System</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('how-it-works')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-900 rounded-2xl font-bold text-base sm:text-lg hover:bg-gradient-to-br hover:from-gray-50 hover:to-purple-50/30 transition-premium shadow-premium border-2 border-gray-200 hover:border-purple-300 hover:shadow-premium-lg w-full sm:w-auto"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <TrendingUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span>Generate in seconds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span>Professional quality</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <Infinity className="w-5 h-5 text-pink-600 flex-shrink-0" />
              <span>Infinite regeneration</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <TargetIcon className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <span>100% accurate extraction</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
