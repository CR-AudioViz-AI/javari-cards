import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CravCards | Premium Digital Card Collection Platform',
  description: 'Collect, trade, and showcase premium digital cards. Build your ultimate collection with CravCards - part of the CR AudioViz AI ecosystem.',
  keywords: ['digital cards', 'trading cards', 'collectibles', 'NFT', 'collection', 'CravCards', 'CR AudioViz AI'],
  authors: [{ name: 'CR AudioViz AI' }],
  openGraph: {
    title: 'CravCards | Premium Digital Card Collection Platform',
    description: 'Collect, trade, and showcase premium digital cards. Build your ultimate collection.',
    url: 'https://cravcards.com',
    siteName: 'CravCards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CravCards | Premium Digital Card Collection Platform',
    description: 'Collect, trade, and showcase premium digital cards.',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
