'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type ColorTheme, DEFAULT_COLOR_THEME } from '@/lib/constants/themes'

type Theme = 'light' | 'dark'

export type { ColorTheme }

const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {},
  colorTheme: DEFAULT_COLOR_THEME as ColorTheme,
  setColorTheme: (_ct: ColorTheme) => {},
  mounted: false,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(DEFAULT_COLOR_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')

    const storedColor = localStorage.getItem('color-theme') as ColorTheme | null
    const initialColor: ColorTheme = storedColor ?? DEFAULT_COLOR_THEME
    setColorThemeState(initialColor)
    document.documentElement.setAttribute('data-theme', initialColor)

    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  const setColorTheme = (ct: ColorTheme) => {
    setColorThemeState(ct)
    localStorage.setItem('color-theme', ct)
    document.documentElement.setAttribute('data-theme', ct)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme, setColorTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
