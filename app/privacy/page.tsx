import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - BloomboxAI',
  description: 'Read BloomboxAI\'s privacy policy to understand how we protect your data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Lock className="w-8 h-8 text-primary-600" />
                  Your Privacy Matters
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  At BloomboxAI, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Website URLs you submit for brand analysis</li>
                  <li>Account information (email, name) if you create an account</li>
                  <li>Generated brand assets and preferences</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-purple-600" />
                  How We Use Your Information
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Generate brand systems and assets based on your input</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  information. However, no method of transmission over the Internet is 100% secure, and we 
                  cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may use third-party services (such as AI providers, cloud storage, and analytics tools) 
                  to help us operate our service. These third parties have access to your information only to 
                  perform specific tasks on our behalf and are obligated not to disclose or use it for any 
                  other purpose.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h3>
                <p className="text-gray-600 leading-relaxed">
                  You have the right to access, update, or delete your personal information at any time. 
                  You can also opt out of certain communications from us. To exercise these rights, please 
                  contact us at privacy@bloomboxai.com.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Changes to This Policy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@bloomboxai.com.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

