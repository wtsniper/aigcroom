import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

import { getSiteUrl } from '@/lib/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AIGC Room - Discover the Best AI Tools for Your Business',
    template: '%s | AIGC Room',
  },
  description: 'In-depth reviews, comparisons, and curated AI tool solutions to help you choose the right AI tools for your business. Expert analysis, pricing insights, and affiliate discounts.',
  keywords: ['AI tools', 'AI software', 'AI comparison', 'AI reviews', 'best AI tools 2026', 'artificial intelligence', 'machine learning tools', 'AI pricing'],
  authors: [{ name: 'AIGC Room Team' }],
  creator: 'AIGC Room',
  publisher: 'AIGC Room',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'AIGC Room',
    title: 'AIGC Room - Discover the Best AI Tools',
    description: 'In-depth reviews, comparisons, and curated AI tool solutions to help you choose the right AI tools.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AIGC Room - AI Tools Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIGC Room - Discover the Best AI Tools',
    description: 'In-depth reviews, comparisons, and curated AI tool solutions.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'impact-site-verification': '6c5bbf95-ef43-4870-a179-f7741418cfa6',
    'google-site-verification': 'OFciaVApU2A9RrmOgKJsaI1k95hxfi-kqfCSTAHRkvs',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-gray-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
