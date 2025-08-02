'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

export default function ProtectedPage() {
  const router = useRouter();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const handleGoToDashboard = () => {
    router.push('/dashboards');
  };

  const handleViewDocumentation = () => {
    router.push('/documentation/requestList.md');
  };

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

  const getThemeButton = () => {
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

  const getThemeOutlineButton = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "border-amber-500 text-amber-600 hover:bg-amber-50"
      case "from-blue-500 to-cyan-500":
        return "border-blue-500 text-blue-600 hover:bg-blue-50"
      case "from-green-500 to-emerald-500":
        return "border-green-500 text-green-600 hover:bg-green-50"
      default:
        return "border-amber-500 text-amber-600 hover:bg-amber-50"
    }
  }

  const getThemeDot = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "bg-amber-500"
      case "from-blue-500 to-cyan-500":
        return "bg-blue-500"
      case "from-green-500 to-emerald-500":
        return "bg-green-500"
      default:
        return "bg-amber-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${getThemeGradient()} rounded-full mb-6 shadow-lg`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            <span className={`bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent`}>
              Access Granted
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            You have successfully accessed a protected page with a valid API key. 
            Welcome to the ApiGate platform!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">API Access</h3>
                  <p className="text-sm text-gray-600">Your API key is valid and active</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure Connection</h3>
                  <p className="text-sm text-gray-600">All requests are encrypted and secure</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Ready</h3>
                  <p className="text-sm text-gray-600">Access to all API endpoints and features</p>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${getThemeBg()} rounded-xl p-6 border ${getThemeBorder()}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                  <span className="text-sm text-gray-700">Explore the API documentation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                  <span className="text-sm text-gray-700">Test your API endpoints</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                  <span className="text-sm text-gray-700">Monitor your usage analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                  <span className="text-sm text-gray-700">Manage your API keys</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGoToDashboard}
                className={`${getThemeButton()} text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleViewDocumentation}
                className={`bg-transparent border-2 ${getThemeOutlineButton()} font-semibold px-6 py-3 rounded-xl transition-all duration-200`}
              >
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
} 