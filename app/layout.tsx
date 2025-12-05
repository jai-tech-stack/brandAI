import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomboxAI - On-Brand AI Asset Generator',
  description: 'The world\'s first on-brand AI. BloomboxAI is an Agentic AI with 6 autonomous AI agents that automatically extract your brand\'s visual identity and generate any brand asset you need, always perfectly on-brand.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

