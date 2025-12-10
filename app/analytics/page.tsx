// app/analytics/page.tsx
// Comprehensive analytics dashboard

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Users, Palette, Download, Eye, Clock,
  BarChart3, PieChart, Activity, Zap, Target, Award
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { supabaseClient } from '@/lib/auth/supabaseAuth'

interface AnalyticsData {
  overview: {
    totalProjects: number
    totalGenerations: number
    totalDownloads: number
    totalViews: number
    avgGenerationTime: number
  }
  topColors: Array<{ color: string; usage: number }>
  topFonts: Array<{ font: string; usage: number }>
  generationTrend: Array<{ date: string; count: number }>
  exportFormats: Array<{ format: string; count: number }>
  stylePreferences: Array<{ style: string; count: number }>
  timeToGenerate: Array<{ range: string; count: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  async function loadAnalytics() {
    setLoading(true)
    setError('')
    try {
      // Get session token
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session) {
        setError('Please sign in to view analytics')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load analytics')
      }

      const data = await response.json()
      setAnalytics(data.data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics'
      console.error('Failed to load analytics:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </main>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen pt-16 pb-20 bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    )
  }

  const stats = [
    { 
      icon: Activity, 
      label: 'Total Projects', 
      value: analytics?.overview.totalProjects || 0,
      change: '+12%',
      color: 'blue'
    },
    { 
      icon: Zap, 
      label: 'Generations', 
      value: analytics?.overview.totalGenerations || 0,
      change: '+24%',
      color: 'purple'
    },
    { 
      icon: Download, 
      label: 'Downloads', 
      value: analytics?.overview.totalDownloads || 0,
      change: '+18%',
      color: 'green'
    },
    { 
      icon: Clock, 
      label: 'Avg. Gen Time', 
      value: `${Math.round(analytics?.overview.avgGenerationTime || 0)}s`,
      change: '-8%',
      color: 'pink'
    },
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
  }

  // Calculate insights from data
  const mostActiveDay = analytics?.generationTrend.length 
    ? new Date(analytics.generationTrend.reduce((max, item) => 
        item.count > max.count ? item : max, analytics.generationTrend[0]
      ).date).toLocaleDateString('en-US', { weekday: 'long' })
    : 'N/A'

  const avgProjectsPerWeek = analytics?.overview.totalProjects 
    ? (analytics.overview.totalProjects / (timeRange === '7d' ? 1 : timeRange === '30d' ? 4.3 : timeRange === '90d' ? 12.9 : 52)).toFixed(1)
    : '0'

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-16 pb-20 bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Track your brand generation insights</p>
              </div>
              <div className="flex gap-2">
                {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeRange === range
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range === 'all' ? 'All Time' : range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      colorClasses[stat.color as keyof typeof colorClasses]
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-semibold ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Colors */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary-600" />
                Most Used Colors
              </h3>
              {analytics?.topColors && analytics.topColors.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topColors.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-sm text-gray-700">{item.color}</span>
                          <span className="text-sm font-semibold text-gray-900">{item.usage}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-600 rounded-full"
                            style={{ width: `${(item.usage / (analytics.topColors[0]?.usage || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No color data available</p>
              )}
            </div>

            {/* Top Fonts */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-600" />
                Popular Fonts
              </h3>
              {analytics?.topFonts && analytics.topFonts.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topFonts.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900" style={{ fontFamily: item.font }}>
                            {item.font}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{item.usage}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${(item.usage / (analytics.topFonts[0]?.usage || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No font data available</p>
              )}
            </div>

            {/* Export Formats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                Export Formats
              </h3>
              {analytics?.exportFormats && analytics.exportFormats.length > 0 ? (
                <div className="space-y-3">
                  {analytics.exportFormats.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{item.format}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No export data available</p>
              )}
            </div>

            {/* Style Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-pink-600" />
                Style Preferences
              </h3>
              {analytics?.stylePreferences && analytics.stylePreferences.length > 0 ? (
                <div className="space-y-3">
                  {analytics.stylePreferences.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{item.style}</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No style data available</p>
              )}
            </div>
          </div>

          {/* Generation Trend Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Generation Trend
            </h3>
            {analytics?.generationTrend && analytics.generationTrend.length > 0 ? (
              <div className="h-64 flex items-end gap-2">
                {analytics.generationTrend.map((item, idx) => {
                  const maxCount = Math.max(...(analytics.generationTrend.map(d => d.count) || [1]))
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-primary-600 to-purple-600 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${height}%`, minHeight: maxCount > 0 ? '4px' : '0' }}
                        title={`${item.count} generations on ${new Date(item.date).toLocaleDateString()}`}
                      />
                      <span className="text-xs text-gray-600 transform -rotate-45 origin-center whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-16">No generation trend data available</p>
            )}
          </div>

          {/* Insights Section */}
          <div className="mt-8 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 border-2 border-primary-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary-600" />
              AI Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Most Active Day</p>
                <p className="text-lg font-bold text-gray-900">{mostActiveDay}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg. Projects/Week</p>
                <p className="text-lg font-bold text-gray-900">{avgProjectsPerWeek}</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Generations</p>
                <p className="text-lg font-bold text-gray-900">{analytics?.overview.totalGenerations || 0}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}

