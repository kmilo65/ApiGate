"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, FileText, Lightbulb, GitPullRequest, Tag, Zap } from "lucide-react"
import { useTheme } from "@/app/contexts/ThemeContext"

const features = [
  {
    icon: FileText,
    title: "Repository Summaries",
    description:
      "Get AI-generated summaries of any GitHub repository including purpose, tech stack, and key highlights.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-100 to-cyan-100",
  },
  {
    icon: Star,
    title: "Star Analytics",
    description: "Track star growth, analyze trending patterns, and understand repository popularity over time.",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-100 to-orange-100",
  },
  {
    icon: Lightbulb,
    title: "Cool Facts Discovery",
    description:
      "Uncover interesting facts, statistics, and unique insights about repositories and their contributors.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-100 to-pink-100",
  },
  {
    icon: GitPullRequest,
    title: "Important Pull Requests",
    description: "Monitor and analyze the most significant pull requests, breaking changes, and feature additions.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-100 to-emerald-100",
  },
  {
    icon: Tag,
    title: "Version Updates",
    description: "Stay informed about latest releases, changelog summaries, and version compatibility information.",
    gradient: "from-red-500 to-rose-500",
    bgGradient: "from-red-100 to-rose-100",
  },
  {
    icon: Zap,
    title: "Real-time API",
    description: "Access all insights through our fast, reliable REST API with real-time data updates and webhooks.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-100 to-purple-100",
  },
]

export function Features() {
  const { getThemeColors } = useTheme()
  const themeColors = getThemeColors()

  const getThemeGradient = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "from-amber-500 to-orange-500"
      case "from-blue-500 to-cyan-500":
        return "from-blue-500 to-cyan-500"
      case "from-green-500 to-emerald-500":
        return "from-green-500 to-emerald-500"
      default:
        return "from-amber-500 to-orange-500"
    }
  }

  const getThemeBorder = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "hover:border-amber-200"
      case "from-blue-500 to-cyan-500":
        return "hover:border-blue-200"
      case "from-green-500 to-emerald-500":
        return "hover:border-green-200"
      default:
        return "hover:border-amber-200"
    }
  }

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 px-4">
            Powerful Features for
            <span className={`bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent`}>
              {" "}
              GitHub Analytics
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Everything you need to understand and monitor open source repositories through our comprehensive API
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border border-gray-200 hover:shadow-xl transition-all duration-300 ${getThemeBorder()} transform hover:scale-105 group`}
            >
              <CardContent className="p-6 sm:p-8">
                <div
                  className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.bgGradient} rounded-xl mb-4 sm:mb-6 group-hover:shadow-lg transition-all duration-300`}
                >
                  <feature.icon
                    className={`h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
