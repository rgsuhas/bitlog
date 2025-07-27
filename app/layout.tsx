import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CloudBlog - Modern Markdown Blog Platform',
  description: 'A production-grade cloud-powered markdown blog platform for developers and writers. Create, publish, and share your ideas with the world.',
  keywords: ['blog', 'markdown', 'writing', 'developer', 'nextjs', 'typescript'],
  authors: [{ name: 'CloudBlog Team' }],
  creator: 'CloudBlog',
  publisher: 'CloudBlog',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cloudblog.com',
    title: 'CloudBlog - Modern Markdown Blog Platform',
    description: 'A production-grade cloud-powered markdown blog platform for developers and writers.',
    siteName: 'CloudBlog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudBlog - Modern Markdown Blog Platform',
    description: 'A production-grade cloud-powered markdown blog platform for developers and writers.',
    creator: '@cloudblog',
  },
};

/**
 * Root Layout Component
 * 
 * Defines the base HTML structure and global layout for the entire application.
 * Includes the Header and Footer components that appear on all pages.
 * 
 * This layout follows Next.js 13+ App Router conventions and provides:
 * - Consistent typography with Inter font
 * - Global CSS styles and Tailwind CSS
 * - Semantic HTML structure for accessibility
 * - SEO-optimized metadata
 * - Header and Footer components on all pages
 * 
 * @param children - Page content to be rendered between header and footer
 * @returns Complete HTML document structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {/* 
            Main application structure with semantic HTML
            - Header: Site navigation and branding
            - Main: Page-specific content
            - Footer: Site information and links
          */}
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
