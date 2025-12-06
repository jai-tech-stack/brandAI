import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomboxAI - Generate Full Brand System From Your Website | AI Branding Superpower',
  description: 'The New AI Branding Superpower! BloomboxAI generates a full brand system from your website—logo, colors, typography, style, and any brand asset you need. Insanely good. 🔥',
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

