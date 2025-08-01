"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, LogOut } from "lucide-react"
import Link from "next/link"
import { AuthModal } from "./auth-modal"

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { data: session, status } = useSession()

  return (
    <>
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
              
              {/* Authentication Section */}
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
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
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
