import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg shadow-lg">
              <Github className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ApiGate</span>
            <span className="text-sm text-gray-500">Github Analyzer</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              About
            </Link>
            <Link href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Dashboard
            </Link>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Sign Up
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
