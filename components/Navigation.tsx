'use client'

import { useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BloomboxAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </Link>
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="#features" className="block text-gray-700 hover:text-gray-900 font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-gray-700 hover:text-gray-900 font-medium">
              How It Works
            </Link>
            <Link href="#pricing" className="block text-gray-700 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Sign In
            </button>
            <button className="block w-full px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold text-center">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

