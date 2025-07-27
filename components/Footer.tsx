/**
 * Footer Component
 * 
 * The main footer for the blog application providing site information,
 * navigation links, and social media connections. Designed to be informative
 * yet unobtrusive, with a clean layout that complements the overall design.
 * 
 * Features:
 * - Responsive multi-column layout
 * - Social media integration placeholders
 * - Copyright and legal information
 * - Additional navigation links
 * - Accessible design with proper semantic markup
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  PenTool,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ExternalLink
} from 'lucide-react';

/**
 * Props interface for the Footer component
 */
interface FooterProps {
  /** Optional CSS class name for styling customization */
  className?: string;
}

/**
 * Footer navigation links organized by category
 * Makes it easy to maintain and update footer content
 */
const footerLinks = {
  platform: [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'All Posts' },
    { href: '/editor/new', label: 'Write' },
    { href: '/tags', label: 'Tags' }
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact' }
  ],
  resources: [
    { href: '/docs', label: 'Documentation' },
    { href: '/api', label: 'API Reference' },
    { href: '/help', label: 'Help Center' },
    { href: '/changelog', label: 'Changelog' }
  ]
} as const;

/**
 * Social media links with icons
 * Easily configurable for different social platforms
 */
const socialLinks = [
  {
    href: 'https://github.com',
    label: 'GitHub',
    icon: Github,
    description: 'Follow us on GitHub'
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    icon: Twitter,
    description: 'Follow us on Twitter'
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: Linkedin,
    description: 'Connect with us on LinkedIn'
  },
  {
    href: 'mailto:hello@cloudblog.com',
    label: 'Email',
    icon: Mail,
    description: 'Send us an email'
  }
] as const;

/**
 * Footer Component
 * 
 * Renders a comprehensive footer with navigation, social links, and legal information.
 * Uses a responsive design that adapts to different screen sizes.
 * 
 * @param props - Component props
 * @returns JSX element representing the footer
 * 
 * @example
 * ```tsx
 * <Footer className="custom-footer-styles" />
 * ```
 */
export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={cn(
        "border-t border-border/40 bg-background",
        className
      )}
      role="contentinfo"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand and Description */}
            <div className="space-y-4">
              {/* Logo and Brand */}
              <Link 
                href="/" 
                className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                aria-label="CloudBlog - Return to homepage"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <PenTool className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  CloudBlog
                </span>
              </Link>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                A modern, cloud-powered markdown blog platform for developers and writers. 
                Create, publish, and share your ideas with the world.
              </p>

              {/* Social Links */}
              <div className="flex space-x-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.href}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      asChild
                    >
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.description}
                        aria-label={social.description}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Platform
              </h3>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground flex items-center space-x-1"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <Separator className="mb-6" />
        <div className="pb-6">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} CloudBlog. All rights reserved.</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" aria-hidden="true" />
              <span>using Next.js & TypeScript</span>
            </div>
          </div>

          {/* Additional Legal Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This platform is designed for educational and professional use. 
              Please ensure your content complies with our{' '}
              <Link 
                href="/terms" 
                className="underline hover:no-underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link 
                href="/privacy" 
                className="underline hover:no-underline"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}