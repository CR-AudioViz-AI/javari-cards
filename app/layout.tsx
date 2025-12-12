import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalHeader from '@/components/GlobalHeader';
import AuthProvider from '@/components/AuthProvider';
import JavariWrapper from '@/components/JavariWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CravCards | Premium Trading Card Collection Platform',
  description: 'Collect, trade, and showcase your trading card collection. Build your ultimate collection with CravCards - part of the CR AudioViz AI ecosystem.',
  keywords: ['trading cards', 'pokemon cards', 'sports cards', 'mtg', 'collectibles', 'CravCards', 'CR AudioViz AI'],
  authors: [{ name: 'CR AudioViz AI' }],
  openGraph: {
    title: 'CravCards | Premium Trading Card Collection Platform',
    description: 'Collect, trade, and showcase your trading card collection. Build your ultimate collection.',
    url: 'https://cravcards.com',
    siteName: 'CravCards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CravCards | Premium Trading Card Collection Platform',
    description: 'Collect, trade, and showcase your trading card collection.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GlobalHeader />
          <main className="pt-16">
            {children}
          </main>
          <JavariWrapper sourceApp="cravcards" />
        </AuthProvider>
      </body>
    </html>
  );
}
