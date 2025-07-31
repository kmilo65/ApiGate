import { Card, CardContent } from "@/components/ui/card"
import { Star, FileText, Lightbulb, GitPullRequest, Tag, Zap } from "lucide-react"

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
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Powerful Features for
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              GitHub Analytics
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to understand and monitor open source repositories through our comprehensive API
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-amber-200 transform hover:scale-105 group"
            >
              <CardContent className="p-8">
                <div
                  className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.bgGradient} rounded-xl mb-6 group-hover:shadow-lg transition-all duration-300`}
                >
                  <feature.icon
                    className={`h-7 w-7 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
