import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'CardVerse | Premium Trading Card Collection Platform',
  description: 'The ultimate trading card collection platform. Track Pokemon, MTG, Yu-Gi-Oh!, Sports Cards and more. AI-powered scanner, real-time pricing, clubs, and community.',
  keywords: 'trading cards, pokemon cards, mtg, magic the gathering, sports cards, card collection, psa grading, card scanner',
  authors: [{ name: 'CR AudioViz AI' }],
  openGraph: {
    title: 'CardVerse | Premium Trading Card Collection Platform',
    description: 'Track, value, and trade your card collection with AI-powered tools',
    type: 'website',
    locale: 'en_US',
    siteName: 'CardVerse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CardVerse | Premium Trading Card Collection Platform',
    description: 'Track, value, and trade your card collection with AI-powered tools',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
