import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Sparkles, Zap, Users, Target } from 'lucide-react'

export const metadata = {
  title: 'About Us - BloomboxAI',
  description: 'Learn about BloomboxAI - The AI platform that generates complete brand systems from your website.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              About BloomboxAI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building the future of brand identity generation—where AI meets design excellence.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-xl text-gray-600">
                To make professional brand systems accessible to everyone, instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-gray-50 rounded-xl">
                <Target className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  We envision a world where every business, regardless of size or budget, can have a professional, 
                  cohesive brand identity that resonates with their audience.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">What We Do</h3>
                <p className="text-gray-600">
                  Using advanced AI, we analyze your website and generate a complete brand system—colors, 
                  typography, logos, templates, and more—in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl">
                <Sparkles className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation First</h3>
                  <p className="text-gray-600">
                    We're constantly pushing the boundaries of what AI can do for brand design, 
                    always staying ahead of the curve.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl">
                <Users className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Centric</h3>
                  <p className="text-gray-600">
                    Every feature we build is designed with our users in mind—making complex 
                    design tasks simple and accessible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl">
                <Zap className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Speed & Quality</h3>
                  <p className="text-gray-600">
                    We believe you shouldn't have to choose between fast results and high quality. 
                    With BloomboxAI, you get both.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of businesses using BloomboxAI to create stunning brand systems.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
            >
              Get Started Free
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

