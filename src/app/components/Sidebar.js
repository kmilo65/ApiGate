"use client"

import Link from "next/link"
import { useTheme } from "@/app/contexts/ThemeContext"

export default function Sidebar({ className = "" }) {
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

  const getThemeBg = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "from-amber-50 to-orange-50"
      case "from-blue-500 to-cyan-500":
        return "from-blue-50 to-cyan-50"
      case "from-green-500 to-emerald-500":
        return "from-green-50 to-emerald-50"
      default:
        return "from-amber-50 to-orange-50"
    }
  }

  const getThemeBorder = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "border-amber-200"
      case "from-blue-500 to-cyan-500":
        return "border-blue-200"
      case "from-green-500 to-emerald-500":
        return "border-green-200"
      default:
        return "border-amber-200"
    }
  }

  const getThemeText = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "text-amber-700"
      case "from-blue-500 to-cyan-500":
        return "text-blue-700"
      case "from-green-500 to-emerald-500":
        return "text-green-700"
      default:
        return "text-amber-700"
    }
  }

  const getThemeHover = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "hover:from-amber-50 hover:to-orange-50 hover:border-amber-200"
      case "from-blue-500 to-cyan-500":
        return "hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200"
      case "from-green-500 to-emerald-500":
        return "hover:from-green-50 hover:to-emerald-50 hover:border-green-200"
      default:
        return "hover:from-amber-50 hover:to-orange-50 hover:border-amber-200"
    }
  }

  return (
    <aside className={`w-64 h-full min-h-screen bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 flex flex-col p-4 sm:p-6 overflow-hidden transition-all duration-300 z-30 ${className}`}>
      {/* Logo/Title */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getThemeGradient()} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent lg:block hidden`}>
            ApiGate AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2 sm:space-y-3">
          <li>
            <Link 
              href="/dashboards" 
              className={`flex items-center px-4 py-3 rounded-xl bg-gradient-to-r ${getThemeBg()} border ${getThemeBorder()} ${getThemeText()} font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 group`}
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${getThemeGradient()} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                </svg>
              </div>
              <span className="lg:block hidden">Overview</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="#" 
              className={`flex items-center px-4 py-3 rounded-xl text-gray-700 ${getThemeHover()} text-sm sm:text-base transition-all duration-200 group`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-1a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" />
                </svg>
              </div>
              <span className="lg:block hidden">Research Assistant</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="#" 
              className={`flex items-center px-4 py-3 rounded-xl text-gray-700 ${getThemeHover()} text-sm sm:text-base transition-all duration-200 group`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" />
                </svg>
              </div>
              <span className="lg:block hidden">Research Reports</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/playground" 
              className={`flex items-center px-4 py-3 rounded-xl text-gray-700 ${getThemeHover()} text-sm sm:text-base transition-all duration-200 group`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18v-1a4 4 0 00-3-3.87M12 3v1m0 16v1m8-9h1M3 12H2m15.36 6.36l.71.71M6.34 6.34l-.71-.71M17.66 6.34l.71-.71M6.34 17.66l-.71.71" />
                </svg>
              </div>
              <span className="lg:block hidden">API Playground</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="#" 
              className={`flex items-center px-4 py-3 rounded-xl text-gray-700 ${getThemeHover()} text-sm sm:text-base transition-all duration-200 group`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" />
                </svg>
              </div>
              <span className="lg:block hidden">Invoices</span>
            </Link>
          </li>
          
          <li>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center px-4 py-3 rounded-xl text-gray-700 ${getThemeHover()} text-sm sm:text-base transition-all duration-200 group`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4h9m-9 8h9" />
                </svg>
              </div>
              <span className="lg:block hidden">Documentation</span>
              <svg className={`w-3 h-3 sm:w-4 sm:h-4 ml-auto text-gray-400 group-hover:${themeColors.text.replace('text-', 'text-')} transition-colors duration-200 lg:block hidden`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6m5-1l-7 7m0 0l7-7m-7 7V3" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 lg:block hidden">
        <div className={`bg-gradient-to-r ${getThemeBg()} rounded-xl p-4 border ${getThemeBorder()}`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 bg-gradient-to-r ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Quick Tips</span>
          </div>
          <p className="text-xs text-gray-600">
            Use the API Playground to test your endpoints and validate your API keys.
          </p>
        </div>
      </div>
    </aside>
  );
} 