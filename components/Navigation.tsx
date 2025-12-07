'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/auth/supabaseAuth'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (supabaseClient) {
      // Get current user
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleSignOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut()
      router.push('/')
      router.refresh()
    }
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    }
  }

  const scrollToGenerator = () => {
    const element = document.getElementById('generator')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    } else {
      // Fallback: scroll to generator section
      const generatorSection = document.querySelector('section[id="generator"]')
      if (generatorSection) {
        generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BloomboxAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Pricing
            </button>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <button 
                  onClick={scrollToGenerator}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Get Started
                </button>
              </>
            )}
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
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium"
            >
              Pricing
            </button>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <button 
                  onClick={() => {
                    scrollToGenerator()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold text-center"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

