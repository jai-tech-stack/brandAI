import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { FileText, Scale } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - BloomboxAI',
  description: 'Read BloomboxAI\'s terms of service to understand the rules and guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Scale className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing or using BloomboxAI, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access the service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Use of Service</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  You may use BloomboxAI to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Analyze websites and generate brand systems</li>
                  <li>Create brand assets and templates</li>
                  <li>Export and download generated content</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  You agree not to use the service for any illegal or unauthorized purpose, or in any way 
                  that violates these Terms.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Intellectual Property</h3>
                <p className="text-gray-600 leading-relaxed">
                  The service and its original content, features, and functionality are owned by BloomboxAI 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws. Generated brand assets are provided for your use, but BloomboxAI 
                  retains certain rights as specified in our license agreement.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">User Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  You retain ownership of any content you submit to BloomboxAI (such as website URLs). 
                  By submitting content, you grant us a license to use, modify, and process that content 
                  to provide our services.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  You may not use BloomboxAI to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service to compete with BloomboxAI</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Service Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strive to maintain high availability, but we do not guarantee that the service will be 
                  available at all times. We reserve the right to modify, suspend, or discontinue the service 
                  at any time without notice.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 leading-relaxed">
                  BloomboxAI shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use or inability to use the service.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms of Service at any time. We will notify users 
                  of any material changes by posting the new Terms on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at legal@bloomboxai.com.
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

