import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - BloomboxAI',
  description: 'Read the latest articles about brand design, AI, and marketing from BloomboxAI.',
}

// Mock blog posts - replace with real data from CMS/API
const blogPosts = [
  {
    id: 1,
    title: 'How AI is Revolutionizing Brand Design',
    excerpt: 'Discover how artificial intelligence is transforming the way businesses create and maintain their brand identity.',
    date: '2024-12-01',
    category: 'AI & Design',
  },
  {
    id: 2,
    title: '5 Essential Elements of a Strong Brand System',
    excerpt: 'Learn the key components that make up a cohesive and effective brand system for your business.',
    date: '2024-11-25',
    category: 'Branding',
  },
  {
    id: 3,
    title: 'The Future of Automated Brand Asset Generation',
    excerpt: 'Explore how automated tools are making professional brand assets accessible to everyone.',
    date: '2024-11-18',
    category: 'Technology',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              BloomboxAI Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Insights on brand design, AI technology, and marketing strategies.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-16 text-center p-8 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">
                More articles coming soon! Subscribe to stay updated.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

