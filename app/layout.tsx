import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloomboxAI - Complete Brand System Generator | Brand Assets Made Effortless',
  description: 'An AI platform that generates a complete brand system based on your website. Distill your website into a dynamic brand system and generate brand assets in seconds. Brand assets made effortless.',
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

