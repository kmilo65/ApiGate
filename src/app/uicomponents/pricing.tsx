import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ApiGate",
    features: [
      "100 API calls per month",
      "Basic repository insights",
      "Star tracking",
      "Community support",
      "Rate limited access",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "default" as const,
    popular: false,
    comingSoon: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For developers and small teams",
    features: [
      "10,000 API calls per month",
      "All repository insights",
      "Real-time updates",
      "Webhook support",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    buttonText: "Coming Soon",
    buttonVariant: "outline" as const,
    popular: false,
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For large teams and organizations",
    features: [
      "Unlimited API calls",
      "All Pro features",
      "Dedicated support",
      "SLA guarantee",
      "Custom deployment",
      "Advanced security",
      "Team management",
      "Custom reporting",
    ],
    buttonText: "Coming Soon",
    buttonVariant: "outline" as const,
    popular: false,
    comingSoon: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 px-4">
            Simple, Transparent
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Pricing
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                plan.popular
                  ? "border-amber-500 shadow-xl scale-105 bg-gradient-to-b from-amber-50 to-orange-50"
                  : "border-gray-200 hover:border-amber-200 bg-white"
              } ${plan.comingSoon ? "opacity-90" : ""}`}
            >
              {plan.comingSoon && (
                <Badge className="absolute -top-3 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              )}

              <CardHeader className="text-center pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm sm:text-base text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  className={`w-full mb-6 sm:mb-8 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                    !plan.comingSoon
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-gray-300 text-gray-500 cursor-not-allowed hover:scale-100"
                  }`}
                  variant={!plan.comingSoon ? "default" : "outline"}
                  size="lg"
                  disabled={plan.comingSoon}
                >
                  {plan.buttonText}
                </Button>

                <ul className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${plan.comingSoon ? "text-gray-400" : "text-green-500"}`}
                      />
                      <span className={`text-xs sm:text-sm ${plan.comingSoon ? "text-gray-500" : "text-gray-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">All plans include our core API features and documentation</p>
          <Button variant="link" className="text-amber-600 hover:text-amber-700 font-medium text-sm sm:text-base">
            Compare all features →
          </Button>
        </div>
      </div>
    </section>
  )
}
