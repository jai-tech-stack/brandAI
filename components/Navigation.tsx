'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/auth/supabaseAuth'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (supabaseClient) {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })

      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-modern ${
        scrolled 
          ? 'glass border-b border-gray-200/50 shadow-modern-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-modern-lg"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              BrandForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-modern relative group"
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-modern relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            {user ? (
              <Link
                href="/dashboard"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-modern-lg hover:shadow-modern-xl transition-modern hover:scale-105"
              >
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </Link>
            ) : (
              <Link
                href="/signin"
                className="btn-modern text-sm px-5 py-2.5"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-modern"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-6 space-y-4"
          >
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
            >
              FAQ
            </Link>
            <button 
              onClick={() => {
                scrollToSection('pricing')
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
            >
              Pricing
            </button>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full btn-modern text-center py-3"
              >
                <span>Sign In</span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
