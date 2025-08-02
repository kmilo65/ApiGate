"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"
import { useTheme } from "@/app/contexts/ThemeContext"

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, setTheme } = useTheme()

  // Debug logging
  useEffect(() => {
    console.log("ThemeSwitcher mounted, current theme:", currentTheme)
  }, [currentTheme])

  const handleThemeChange = (theme: "orange" | "blue" | "green") => {
    console.log("Changing theme to:", theme)
    setTheme(theme)
    setIsOpen(false)
  }

  const getThemeColor = (theme: "orange" | "blue" | "green") => {
    switch (theme) {
      case "orange":
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "green":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-amber-500 to-orange-500"
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Main Theme Button */}
      <button
        onClick={() => {
          console.log("Theme button clicked, current theme:", currentTheme)
          setIsOpen(!isOpen)
        }}
        className={`w-14 h-14 rounded-full ${getThemeColor(currentTheme)} shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center`}
        aria-label="Change theme"
      >
        <Palette className="w-6 h-6 text-white" />
      </button>

      {/* Theme Options - Simplified */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 space-y-2 min-w-[120px] z-[10000]"
          style={{ zIndex: 10000 }}
        >
          <div className="text-xs text-gray-500 mb-2 text-center font-bold">Choose Theme</div>
          
          <button
            onClick={() => {
              console.log("Orange theme button clicked")
              handleThemeChange("orange")
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-110 border-2 border-white shadow-md"
            style={{ cursor: 'pointer' }}
          />
          
          <button
            onClick={() => {
              console.log("Blue theme button clicked")
              handleThemeChange("blue")
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-110 border-2 border-white shadow-md"
            style={{ cursor: 'pointer' }}
          />
          
          <button
            onClick={() => {
              console.log("Green theme button clicked")
              handleThemeChange("green")
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-110 border-2 border-white shadow-md"
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            console.log("Backdrop clicked, closing theme switcher")
            setIsOpen(false)
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
} 