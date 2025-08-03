'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { id: 'all', label: 'All', href: '/blog' },
  { id: 'ai', label: 'AI', href: '/blog?category=ai' },
  { id: 'startup', label: 'Startup', href: '/blog?category=startup' },
  { id: 'software', label: 'Software', href: '/blog?category=software' },
  { id: 'general', label: 'General', href: '/blog?category=general' },
  { id: 'non-tech', label: 'Non-Tech', href: '/blog?category=non-tech' },
]

export function TopNav() {
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <nav className="border-b border-border/40 pb-6 mb-8">
      <div className="flex items-center space-x-1 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={`
              whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
            `}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Link>
        ))}
      </div>
    </nav>
  )
} 