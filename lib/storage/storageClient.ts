// lib/storage/storageClient.ts
// Complete persistent storage implementation for BloomboxAI

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Storage client
const storageClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface StorageItem {
  key: string
  value: any
  shared?: boolean
  userId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Get value from storage
 */
export async function storageGet(key: string, shared: boolean = false): Promise<StorageItem | null> {
  if (!storageClient) {
    console.warn('Storage not configured, using localStorage fallback')
    return getFromLocalStorage(key)
  }

  try {
    const { data: { user } } = await storageClient.auth.getUser()
    
    const { data, error } = await storageClient
      .from('storage')
      .select('*')
      .eq('key', key)
      .eq('shared', shared)
      .eq('user_id', shared ? null : user?.id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.warn('Storage get failed, using localStorage:', error)
    return getFromLocalStorage(key)
  }
}

/**
 * Set value in storage
 */
export async function storageSet(
  key: string, 
  value: any, 
  shared: boolean = false
): Promise<StorageItem | null> {
  if (!storageClient) {
    console.warn('Storage not configured, using localStorage fallback')
    return setToLocalStorage(key, value, shared)
  }

  try {
    const { data: { user } } = await storageClient.auth.getUser()
    
    const item: Partial<StorageItem> = {
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      shared,
      userId: shared ? undefined : user?.id,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await storageClient
      .from('storage')
      .upsert(item)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.warn('Storage set failed, using localStorage:', error)
    return setToLocalStorage(key, value, shared)
  }
}

/**
 * Delete value from storage
 */
export async function storageDelete(key: string, shared: boolean = false): Promise<boolean> {
  if (!storageClient) {
    console.warn('Storage not configured, using localStorage fallback')
    return deleteFromLocalStorage(key)
  }

  try {
    const { data: { user } } = await storageClient.auth.getUser()
    
    const { error } = await storageClient
      .from('storage')
      .delete()
      .eq('key', key)
      .eq('shared', shared)
      .eq('user_id', shared ? null : user?.id)

    if (error) throw error
    return true
  } catch (error) {
    console.warn('Storage delete failed, using localStorage:', error)
    return deleteFromLocalStorage(key)
  }
}

/**
 * List keys with optional prefix
 */
export async function storageList(
  prefix?: string, 
  shared: boolean = false
): Promise<string[]> {
  if (!storageClient) {
    return listFromLocalStorage(prefix)
  }

  try {
    const { data: { user } } = await storageClient.auth.getUser()
    
    let query = storageClient
      .from('storage')
      .select('key')
      .eq('shared', shared)
      .eq('user_id', shared ? null : user?.id)

    if (prefix) {
      query = query.ilike('key', `${prefix}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data?.map(item => item.key) || []
  } catch (error) {
    console.warn('Storage list failed, using localStorage:', error)
    return listFromLocalStorage(prefix)
  }
}

// LocalStorage fallbacks
function getFromLocalStorage(key: string): StorageItem | null {
  try {
    const item = localStorage.getItem(`bloombox_${key}`)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

function setToLocalStorage(key: string, value: any, shared: boolean): StorageItem {
  const item: StorageItem = {
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
    shared,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(`bloombox_${key}`, JSON.stringify(item))
  return item
}

function deleteFromLocalStorage(key: string): boolean {
  localStorage.removeItem(`bloombox_${key}`)
  return true
}

function listFromLocalStorage(prefix?: string): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('bloombox_')) {
      const actualKey = key.replace('bloombox_', '')
      if (!prefix || actualKey.startsWith(prefix)) {
        keys.push(actualKey)
      }
    }
  }
  return keys
}

// Window storage API (for backward compatibility with artifacts)
if (typeof window !== 'undefined') {
  (window as any).storage = {
    get: storageGet,
    set: storageSet,
    delete: storageDelete,
    list: storageList,
  }
}