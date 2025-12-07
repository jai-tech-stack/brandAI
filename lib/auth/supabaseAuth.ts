// Supabase Auth Client for BloomboxAI
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Client-side Supabase client (for browser)
export const supabaseClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client (for API routes)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseServer = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, name?: string) {
  if (!supabaseClient) {
    throw new Error('Supabase client not configured')
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  if (!supabaseClient) {
    throw new Error('Supabase client not configured')
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!supabaseClient) {
    throw new Error('Supabase client not configured')
  }

  const { error } = await supabaseClient.auth.signOut()
  if (error) throw error
}

/**
 * Get current user session
 */
export async function getSession() {
  if (!supabaseClient) {
    return null
  }

  const { data: { session } } = await supabaseClient.auth.getSession()
  return session
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  if (!supabaseClient) {
    return null
  }

  const { data: { user } } = await supabaseClient.auth.getUser()
  return user
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  if (!supabaseServer) {
    return false
  }

  const { data, error } = await supabaseServer
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return false
  return data.role === 'admin'
}

