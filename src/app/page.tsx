
import { Header } from "@/app/uicomponents/header"
import { Hero } from "@/app/uicomponents/hero"
import { Features } from "@/app/uicomponents/features"
import { ApiDemo } from "@/app/uicomponents/api-demo"
import { Pricing } from "@/app/uicomponents/pricing"
import { Footer } from "@/app/uicomponents/footer"
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ApiDemo />
      <Pricing />
      <Footer />
      <ThemeSwitcher />
    </div>
  )
}
