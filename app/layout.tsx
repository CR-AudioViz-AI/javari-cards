import type { Metadata } from 'next'
import './globals.css'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Javari Cards | AI Social Post Generator', description: 'Trading card collection and pricing tracker' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body style={{ margin: 0, padding: 0, background: '#0a0a0f' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(7,7,16,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <a href="https://craudiovizai.com" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontWeight: 800, fontSize: 15, color: '#f59e0b' }}>🤖 Javari Cards</a>
        <a href="https://craudiovizai.com/auth/signup" style={{ background: 'linear-gradient(135deg,#f59e0b,#8b5cf6)', color: 'white', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Get Started Free</a>
      </nav>
      <div style={{ height: 58 }} />{children}
      <footer style={{ background: '#030308', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '24px', textAlign: 'center', color: '#374151', fontSize: 12 }}>
        © 2026 CR AudioViz AI, LLC — EIN: 39-3646201</footer>
    </body></html>
  )
}