"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { AuthModal } from "./auth-modal"
import { useRouter } from "next/navigation"
import { useTheme } from "@/app/contexts/ThemeContext"

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  // Debug logging
  useEffect(() => {
    console.log("Header: Theme colors updated", themeColors)
  }, [themeColors])

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (session) {
      router.push('/dashboards')
    } else {
      setIsAuthModalOpen(true)
    }
  }

  const getButtonClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
      case "from-blue-500 to-cyan-500":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
      case "from-green-500 to-emerald-500":
        return "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      default:
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg shadow-lg ${themeColors.gradient}`}>
                <Github className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">ApiGate</span>
                <span className="text-xs sm:text-sm text-gray-500">Github Analyzer</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base">
                About
              </Link>
              <button
                onClick={handleDashboardClick}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm lg:text-base"
              >
                Dashboard
              </button>
              
              {/* Authentication Section */}
              {session ? (
                <div className="flex items-center gap-2 lg:gap-4">
                  <div className="hidden lg:flex items-center gap-2">
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`${getButtonClasses()} text-white font-semibold px-3 lg:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-xs lg:text-sm`}
                  >
                    <LogOut className="w-4 h-4 lg:hidden mr-1" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`${getButtonClasses()} text-white font-semibold px-3 lg:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-xs lg:text-sm`}
                >
                  Sign Up
                </Button>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <Link
                  href="#features"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="#about"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <button
                  onClick={() => {
                    handleDashboardClick(new Event('click') as any)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Dashboard
                </button>
                
                {/* Mobile Authentication Section */}
                {session ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {session.user?.image && (
                        <img
                          src={session.user.image}
                          alt={session.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {session.user?.name || session.user?.email}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full mt-2 ${getButtonClasses()} text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full ${getButtonClasses()} text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
