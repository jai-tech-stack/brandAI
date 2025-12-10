'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/auth/supabaseAuth'
import { Loader2, Plus, Search, Filter, Download, Eye, Trash2, Edit } from 'lucide-react'

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    if (!supabaseClient) {
      setLoading(false)
      return
    }

    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session) return

      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setProjects(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProject(projectId: string) {
    if (!confirm('Delete this project?')) return

    try {
      const { data: { session } } = await supabaseClient!.auth.getSession()
      const response = await fetch(`/api/projects?projectId=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = !filterTag || project.tags?.includes(filterTag)
    
    return matchesSearch && matchesTag
  })

  return (
    <main className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-2">{project.name || project.url}</h3>
                <p className="text-sm text-gray-500 mb-4">{new Date(project.created_at).toLocaleDateString()}</p>
                
                {/* Color Preview */}
                {project.brand_system?.primaryColors && (
                  <div className="flex gap-2 mb-4">
                    {project.brand_system.primaryColors.slice(0, 4).map((color: string, idx: number) => (
                      <div key={idx} className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`/brand/${project.id}`}
                    className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </a>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}