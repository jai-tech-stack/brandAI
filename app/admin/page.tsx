'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Users, FileText, TrendingUp, Shield, Loader2 } from 'lucide-react'

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary-600" />
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600">Manage users, projects, and system analytics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">1,234</h3>
                <p className="text-gray-600">Total Users</p>
                <p className="text-sm text-green-600 mt-2">+12% this month</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">5,678</h3>
                <p className="text-gray-600">Brand Systems</p>
                <p className="text-sm text-green-600 mt-2">+24% this month</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">89%</h3>
                <p className="text-gray-600">Success Rate</p>
                <p className="text-sm text-green-600 mt-2">+3% this month</p>
              </div>
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Management */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary-600" />
                  User Management
                </h2>
                <p className="text-gray-600 mb-4">
                  View and manage user accounts, roles, and permissions.
                </p>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                  Manage Users
                </button>
              </div>

              {/* Project Management */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Project Management
                </h2>
                <p className="text-gray-600 mb-4">
                  Monitor all brand systems, view analytics, and manage content.
                </p>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                  View Projects
                </button>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Analytics
                </h2>
                <p className="text-gray-600 mb-4">
                  View detailed analytics, usage statistics, and performance metrics.
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  View Analytics
                </button>
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-gray-600" />
                  System Settings
                </h2>
                <p className="text-gray-600 mb-4">
                  Configure system settings, API keys, and platform preferences.
                </p>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}

