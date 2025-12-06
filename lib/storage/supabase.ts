import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Upload file to Supabase Storage
 */
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string = 'image/png'
): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      upsert: true,
    })

    if (error) {
      console.error('Storage upload error:', error)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  } catch (error) {
    console.error('Storage upload failed:', error)
    return null
  }
}

/**
 * Save project to database
 */
export async function saveProject(data: {
  url: string
  analysis?: any
  brandSystem?: any
  templates?: any
  pdfUrl?: string
}): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        url: data.url,
        analysis: data.analysis || null,
        brand_system: data.brandSystem || null,
        templates: data.templates || null,
        pdf_url: data.pdfUrl || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database save error:', error)
      return null
    }

    return project.id
  } catch (error) {
    console.error('Database save failed:', error)
    return null
  }
}

/**
 * Get project by ID
 */
export async function getProject(projectId: string): Promise<any | null> {
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      console.error('Database fetch error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Database fetch failed:', error)
    return null
  }
}

/**
 * Save asset to database
 */
export async function saveAsset(data: {
  projectId: string
  type: 'logo' | 'template' | 'moodboard' | 'screenshot'
  path: string
  url: string
}): Promise<string | null> {
  if (!supabase) {
    return null
  }

  try {
    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        project_id: data.projectId,
        type: data.type,
        path: data.path,
        url: data.url,
      })
      .select()
      .single()

    if (error) {
      console.error('Asset save error:', error)
      return null
    }

    return asset.id
  } catch (error) {
    console.error('Asset save failed:', error)
    return null
  }
}

