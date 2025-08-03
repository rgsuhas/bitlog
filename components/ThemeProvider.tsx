'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true)
    
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      
      // Save to localStorage
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <html className="dark">
        <body className="bg-background text-foreground">
          {children}
        </body>
      </html>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 