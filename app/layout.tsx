import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/SidebarContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bitlog-eight.vercel.app'),
    title: {
    default: 'Bitlog',
    template: '%s | Bitlog'
  },
  description: 'A minimal, functional blog with insights on technology and development',
  keywords: ['blog', 'technology', 'development', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bitlog-eight.vercel.app',
    title: 'Bitlog',
    description: 'A minimal, functional blog with insights on technology and development',
    siteName: 'Bitlog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitlog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitlog',
    description: 'A minimal, functional blog with insights on technology and development',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-light.svg', media: '(prefers-color-scheme: light)' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon-light.svg" media="(prefers-color-scheme: light)" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Header />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-screen">
                  <div className="max-w-4xl mx-auto px-6 py-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
