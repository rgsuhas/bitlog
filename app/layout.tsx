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
    default: 'Minimal Blog',
    template: '%s | Minimal Blog'
  },
  description: 'A minimal, functional blog with insights on technology and development',
  keywords: ['blog', 'technology', 'development', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
          url: 'https://bitlog-eight.vercel.app',
    title: 'Minimal Blog',
    description: 'A minimal, functional blog with insights on technology and development',
    siteName: 'Minimal Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minimal Blog',
    description: 'A minimal, functional blog with insights on technology and development',
  },
  robots: {
    index: true,
    follow: true,
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
