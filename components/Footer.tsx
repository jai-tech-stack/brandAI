'use client'

import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <span className="text-xl font-bold text-white">BloomboxAI</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 BloomboxAI. The world's first on-brand AI powered by Agentic AI.
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Generate anything. Always on brand. 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}

