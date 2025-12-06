import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomboxAI - Your Brand Guardian Angel | Complete Brand System in One Click',
  description: 'One click gives you brand colors, logo directions, typography, social templates, visual identity. For small teams, indie founders, and non-designers—this feels like having a full-time brand design team on standby. Upload your website → AI analyzes → full brand system generated.',
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

