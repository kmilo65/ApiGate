"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Github } from "lucide-react"
import { useTheme } from "@/app/contexts/ThemeContext"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null)
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const handleGoogleAuth = async () => {
    setIsLoading("google")
    try {
      await signIn("google", { callbackUrl: "/dashboards" })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleGithubAuth = async () => {
    setIsLoading("github")
    try {
      await signIn("github", { callbackUrl: "/dashboards" })
    } catch (error) {
      console.error("GitHub sign in error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const getBadgeClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200"
      case "from-blue-500 to-cyan-500":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200"
      case "from-green-500 to-emerald-500":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
      default:
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200"
    }
  }

  const getLinkClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "text-amber-600 hover:text-amber-700"
      case "from-blue-500 to-cyan-500":
        return "text-blue-600 hover:text-blue-700"
      case "from-green-500 to-emerald-500":
        return "text-green-600 hover:text-green-700"
      default:
        return "text-amber-600 hover:text-amber-700"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 border-2 border-gray-200 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`${themeColors.gradient} p-3 rounded-xl shadow-lg`}>
              <Github className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Welcome to ApiGate</CardTitle>
          <p className="text-gray-600">Choose your preferred authentication method to get started</p>
          <Badge className={`mx-auto mt-3 ${getBadgeClasses()} font-medium`}>
            🚀 Free tier available
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          {/* Google Authentication Button */}
          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading !== null}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            variant="outline"
          >
            {isLoading === "google" ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* GitHub Authentication Button */}
          <Button
            onClick={handleGithubAuth}
            disabled={isLoading !== null}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading === "github" ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-white mr-3"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </div>
            )}
          </Button>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className={`${getLinkClasses()} underline`}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={`${getLinkClasses()} underline`}>
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
