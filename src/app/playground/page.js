'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Notification from '@/app/components/Notification';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ message: '', type: 'success' });
    // Check API key in Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)
      .single();
    setLoading(false);
    if (data && data.id) {
      setNotification({ message: 'Valid API Key. Protected page can be accessed.', type: 'success' });
      setTimeout(() => {
        setNotification({ message: '', type: 'success' });
        router.push('/protected');
      }, 1200);
    } else {
      setNotification({ message: 'Invalid API Key', type: 'error' });
    }
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

  const getThemeFocus = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "focus:ring-amber-500 focus:border-amber-500"
      case "from-blue-500 to-cyan-500":
        return "focus:ring-blue-500 focus:border-blue-500"
      case "from-green-500 to-emerald-500":
        return "focus:ring-green-500 focus:border-green-500"
      default:
        return "focus:ring-amber-500 focus:border-amber-500"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            <span className={`bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent`}>
              API Playground
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Test your API key and explore the ApiGate platform. 
            Enter your valid API key to access protected resources.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12 max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">API Key Validation</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter your API key below to test access to protected endpoints and features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <div className="relative">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 ${getThemeFocus()} text-sm sm:text-base transition-colors`}
                  placeholder="Enter your API Key (e.g., pk_abc123_def456)"
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${getThemeButton()} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Validating...</span>
                </div>
              ) : (
                'Validate API Key'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you can do:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                <span className="text-sm text-gray-600">Access protected pages</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                <span className="text-sm text-gray-600">Test API endpoints</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                <span className="text-sm text-gray-600">View analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getThemeDot()} rounded-full`}></div>
                <span className="text-sm text-gray-600">Manage API keys</span>
              </div>
            </div>
          </div>
        </div>

        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, message: '' })}
        />
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
} 