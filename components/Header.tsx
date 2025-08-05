'use client'

import { useTheme } from './ThemeProvider'
import { useSidebar } from './SidebarContext'
import { Moon, Sun, Menu, Search, Rss } from 'lucide-react'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">Blog</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* RSS Feed and Theme Toggle */}
          <div className="flex items-center space-x-2">
            <a
              href="/feed.xml"
              className="p-2.5 hover:bg-accent rounded-lg transition-colors"
              aria-label="RSS Feed"
              title="RSS Feed"
            >
              <Rss className="h-5 w-5" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}