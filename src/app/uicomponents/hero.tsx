import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto text-center">
        <Badge
          variant="secondary"
          className="mb-6 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 border-amber-200 font-medium"
        >
          🚀 Now with AI-powered insights
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Unlock GitHub Insights
          </span>
          <br />
          <span className="text-gray-900">with ApiGate</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Get comprehensive summaries, track stars, discover cool facts, monitor important pull requests, and stay
          updated with version releases for any open source GitHub repository. All through our powerful API.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Learn More
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
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
  )
}
