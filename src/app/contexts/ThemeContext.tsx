"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Theme = "orange" | "blue" | "green"

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: Theme) => void
  getThemeColors: () => ThemeColors
}

interface ThemeColors {
  primary: string
  hover: string
  text: string
  border: string
  bg: string
  ring: string
  gradient: string
}

const themes: Record<Theme, ThemeColors> = {
  orange: {
    primary: "from-amber-500 to-orange-500",
    hover: "from-amber-600 to-orange-600",
    text: "text-amber-600",
    border: "border-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-500",
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500"
  },
  blue: {
    primary: "from-blue-500 to-cyan-500",
    hover: "from-blue-600 to-cyan-600",
    text: "text-blue-600",
    border: "border-blue-500",
    bg: "bg-blue-50",
    ring: "ring-blue-500",
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  green: {
    primary: "from-green-500 to-emerald-500",
    hover: "from-green-600 to-emerald-600",
    text: "text-green-600",
    border: "border-green-500",
    bg: "bg-green-50",
    ring: "ring-green-500",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>("orange")

  const setTheme = (theme: Theme) => {
    console.log("ThemeProvider: Setting theme to", theme)
    setCurrentTheme(theme)
    // Store theme preference in localStorage
    localStorage.setItem("theme", theme)
  }

  const getThemeColors = (): ThemeColors => {
    console.log("ThemeProvider: Getting colors for theme", currentTheme)
    return themes[currentTheme]
  }

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme
    console.log("ThemeProvider: Loading saved theme", savedTheme)
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    console.log("ThemeProvider: Theme changed to", currentTheme)
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 