'use client'

import Link from 'next/link'
import { useSidebar } from './SidebarContext'
import { Home, BookOpen, Tag, User, X } from 'lucide-react'

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar()

  const navigation = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blog', label: 'All Posts', icon: BookOpen },
    { href: '/tags', label: 'All Tags', icon: Tag },
    { href: '/about', label: 'About', icon: User },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-50
        transform transition-transform duration-300 ease-in-out shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-6 h-full flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <ul className="space-y-1 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground hover:text-foreground group"
                    onClick={closeSidebar}
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Footer */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Minimal Blog
            </p>
          </div>
        </nav>
      </aside>
    </>
  )
} 