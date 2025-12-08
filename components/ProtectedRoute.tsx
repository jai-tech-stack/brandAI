'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabaseClient } from '@/lib/auth/supabaseAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()

    // Listen for auth changes
    if (supabaseClient) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/signin')
        } else if (event === 'SIGNED_IN') {
          checkAuth()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  const checkAuth = async () => {
    if (!supabaseClient) {
      // If Supabase not configured, allow access (for development/demo)
      console.warn('Supabase not configured - allowing access in demo mode')
      setAuthorized(true)
      setLoading(false)
      return
    }

    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession()

      if (error || !session) {
        // Only redirect if Supabase is properly configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          router.push('/signin')
          return
        } else {
          // Demo mode - allow access
          setAuthorized(true)
          setLoading(false)
          return
        }
      }

      if (requireAdmin) {
        // Check if user is admin
        try {
          const adminResponse = await fetch('/api/auth/check-admin')
          const adminData = await adminResponse.json()
          
          if (!adminData.isAdmin && process.env.NEXT_PUBLIC_SUPABASE_URL) {
            router.push('/dashboard')
            return
          }
        } catch (adminError) {
          // If admin check fails, allow access (for development)
          console.warn('Admin check failed:', adminError)
        }
      }

      setAuthorized(true)
    } catch (error: unknown) {
      console.error('Auth check failed:', error)
      // Only redirect if Supabase is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/signin')
      } else {
        // Demo mode - allow access
        setAuthorized(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}

