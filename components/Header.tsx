/**
 * Header Component
 * 
 * The main navigation header for the blog application.
 * Provides consistent branding, navigation, and user interface elements
 * across all pages. Designed to be responsive and accessible.
 * 
 * Features:
 * - Responsive design that works on all screen sizes
 * - Clean, modern aesthetic with proper contrast ratios
 * - Accessible navigation with proper ARIA labels
 * - Smooth hover animations and micro-interactions
 * - Integration with Next.js Link for optimal performance
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  PenTool, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Search,
  User
} from 'lucide-react';
import { LoginButton } from '@/components/auth/LoginButton';

/**
 * Props interface for the Header component
 * Allows for future customization and theming
 */
interface HeaderProps {
  /** Optional CSS class name for styling customization */
  className?: string;
}

/**
 * Navigation link configuration
 * Centralizes navigation structure for easy maintenance
 */
const navigationLinks = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    description: 'Return to homepage'
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: BookOpen,
    description: 'Browse all blog posts'
  },
  {
    href: '/editor/new',
    label: 'Write',
    icon: PenTool,
    description: 'Create a new blog post'
  }
] as const;

/**
 * Header Component
 * 
 * Renders the main application header with navigation, branding, and user controls.
 * Implements responsive design patterns and accessibility best practices.
 * 
 * @param props - Component props
 * @returns JSX element representing the header
 * 
 * @example
 * ```tsx
 * <Header className="custom-header-styles" />
 * ```
 */
export default function Header({ className }: HeaderProps) {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggles the mobile navigation menu
   * Includes proper accessibility handling
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  /**
   * Closes the mobile menu
   * Used when navigation links are clicked
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        // Base styles
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              aria-label="CloudBlog - Return to homepage"
            >
              {/* Logo using Lucide React icon as requested */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PenTool className="h-5 w-5" aria-hidden="true" />
              </div>
              
              {/* Brand name with responsive text sizing */}
              <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                CloudBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex md:items-center md:space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    // Base button styles
                    "inline-flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    // Hover and focus states
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    // Default colors
                    "text-muted-foreground hover:text-foreground"
                  )}
                  title={link.description}
                >
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {/* Search button placeholder */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              title="Search posts"
              aria-label="Search posts"
            >
              <Search className="h-4 w-4" />
            </Button>

            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="border-t border-border/40 pb-3 pt-2 md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1 px-2">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      // Mobile link styles
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                      // Hover and focus states
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      // Default colors
                      "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={closeMobileMenu}
                    title={link.description}
                  >
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 border-t border-border/40 pt-4">
              <div className="flex items-center justify-around px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center space-y-1 h-auto py-2"
                  title="Search posts"
                  aria-label="Search posts"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-xs">Search</span>
                </Button>

                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}