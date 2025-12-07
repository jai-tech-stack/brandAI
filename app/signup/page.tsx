'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { supabaseClient } from '@/lib/auth/supabaseAuth'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in
    checkSession()
  }, [])

  const checkSession = async () => {
    if (!supabaseClient) return
    
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    } catch (error) {
      // Ignore errors
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!supabaseClient) {
      // Demo mode - show message but allow testing
      setError('Supabase not configured. For full functionality, please set up Supabase environment variables. You can still test the brand generation feature.')
      setLoading(false)
      // Allow user to continue to dashboard in demo mode
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      return
    }

    try {
      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to sign up')
      }

      if (data.session) {
        // Redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      } else {
        // Email confirmation might be required
        setError('Please check your email to confirm your account.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16 pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Start generating brand systems today</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

