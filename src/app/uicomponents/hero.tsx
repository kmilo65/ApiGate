"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "./auth-modal"
import { useRouter } from "next/navigation"
import { useTheme } from "@/app/contexts/ThemeContext"

export function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const handleStartFreeTrial = () => {
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

  const getBadgeClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 border-amber-200"
      case "from-blue-500 to-cyan-500":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 border-blue-200"
      case "from-green-500 to-emerald-500":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200"
      default:
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 border-amber-200"
    }
  }

  const getOutlineButtonClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600"
      case "from-blue-500 to-cyan-500":
        return "border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
      case "from-green-500 to-emerald-500":
        return "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
      default:
        return "border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600"
    }
  }

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <Badge
            variant="secondary"
            className={`mb-4 sm:mb-6 ${getBadgeClasses()} font-medium text-xs sm:text-sm`}
          >
            🚀 Now with AI-powered insights
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className={`bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
              Unlock GitHub Insights
            </span>
            <br />
            <span className="text-gray-900">with ApiGate</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Get comprehensive summaries, track stars, discover cool facts, monitor important pull requests, and stay
            updated with version releases for any open source GitHub repository. All through our powerful API.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              onClick={handleStartFreeTrial}
              className={`${getButtonClasses()} text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto`}
            >
              {session ? 'Go to Dashboard' : 'Start Free Trial'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent border-2 ${getOutlineButtonClasses()} font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto`}
            >
              Learn More
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>API-first approach</span>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
