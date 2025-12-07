'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Globe, Loader2, Sparkles, Download, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BrandSystem {
  id: string
  url: string
  primaryColors: string[]
  secondaryColors: string[]
  primaryFont: string
  secondaryFont: string
  style: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [brandSystems, setBrandSystems] = useState<BrandSystem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUserData()
    loadBrandSystems()
  }, [])

  const loadUserData = async () => {
    try {
      // Use Supabase client directly
      const { supabaseClient } = await import('@/lib/auth/supabaseAuth')
      if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession()
        if (session?.user) {
          setUser(session.user)
        }
      } else {
        // Fallback to API
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        if (data.session?.user) {
          setUser(data.session.user)
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadBrandSystems = async () => {
    try {
      // In production, fetch from API
      // For now, use sessionStorage or mock data
      const stored = sessionStorage.getItem('brandSystems')
      if (stored) {
        setBrandSystems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load brand systems:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand system?')) return

    try {
      // In production, call API to delete
      const updated = brandSystems.filter(s => s.id !== id)
      setBrandSystems(updated)
      sessionStorage.setItem('brandSystems', JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
              </p>
            </div>

            {/* Create New Button */}
            <div className="mb-8">
              <Link
                href="/#generator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Generate New Brand System
              </Link>
            </div>

            {/* Brand Systems Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : brandSystems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Brand Systems Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by generating your first complete brand system
                </p>
                <Link
                  href="/#generator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Generate Your First Brand System
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandSystems.map((system) => (
                  <div
                    key={system.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 truncate">{system.url}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(system.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(system.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Colors Preview */}
                      <div className="flex gap-2 mb-4">
                        {system.primaryColors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* Typography */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Typography</p>
                        <p className="text-sm font-semibold text-gray-900">{system.primaryFont}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/brand/${system.id}`}
                          className="flex-1 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}

