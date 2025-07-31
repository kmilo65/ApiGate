import { Header } from "@/uicomponents/header"
import { Hero } from "@/uicomponents/hero"
import { Features } from "@/uicomponents/features"
import { ApiDemo } from "@/uicomponents/api-demo"
import { Pricing } from "@/uicomponents/pricing"
import { Footer } from "@/uicomponents/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ApiDemo />
      <Pricing />
      <Footer />
    </div>
  )
}
