'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Notification from "@/app/components/Notification";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import useApiKeys from './useApiKeys';
import useNotification from './useNotification';
import ApiKeyList from './ApiKeyList';
import ApiKeyForm from './ApiKeyForm';
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    apiKeys,
    isLoading,
    error,
    setError,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    editingKey,
    setEditingKey,
  } = useApiKeys();
  const { notification, showNotification, clearNotification } = useNotification();
  const { getThemeColors } = useTheme();
  const themeColors = getThemeColors();

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSidebar]);

  // Handle window resize to auto-hide sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && showSidebar) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  // Copy to clipboard handler
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied API Key to clipboard", "success");
    } catch (err) {
      showNotification("Failed to copy API key. Please try again.", "error");
    }
  };

  // Form submit handler
  const handleFormSubmit = async () => {
    if (editingKey) {
      const result = await updateApiKey(editingKey.id, formData);
      if (result.success) {
        showNotification("API Key updated successfully!", "success");
        setEditingKey(null);
        setFormData({ name: '', description: '', permissions: [] });
      } else {
        showNotification("Failed to update API key. Please try again.", "error");
      }
    } else {
      const result = await createApiKey(formData);
      if (result.success) {
        showNotification("API Key created successfully!", "success");
        setShowCreateForm(false);
        setFormData({ name: '', description: '', permissions: [] });
      } else {
        showNotification("Failed to create API key. Please try again.", "error");
      }
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return;
    }
    const result = await deleteApiKey(id);
    if (result.success) {
      showNotification("API Key deleted successfully!", "success");
    } else {
      showNotification("Failed to delete API key. Please try again.", "error");
    }
  };

  // Edit handler
  const handleEdit = (apiKey) => {
    setEditingKey(apiKey);
    setFormData({
      name: apiKey.name,
      description: apiKey.description,
      permissions: apiKey.permissions || []
    });
    setShowCreateForm(false);
  };

  // Cancel form
  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingKey(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  // Toggle sidebar (mobile)
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Toggle sidebar collapsed (desktop)
  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Close sidebar (mobile)
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const getButtonClasses = () => {
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

  const getBorderClasses = () => {
    switch (themeColors.primary) {
      case "from-amber-500 to-orange-500":
        return "border-amber-600"
      case "from-blue-500 to-cyan-500":
        return "border-blue-600"
      case "from-green-500 to-emerald-500":
        return "border-green-600"
      default:
        return "border-amber-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className={`animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 ${getBorderClasses()}`}></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Mobile overlay for sidebar */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar - responsive */}
        <Sidebar
          className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-40 w-64 lg:w-64
            ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${showSidebar ? 'shadow-2xl' : 'shadow-none'}
            ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
          `}
        />

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Upper Menu/Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              {/* Breadcrumb and Title */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Hamburger toggle button (mobile) */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 lg:hidden transition-colors duration-200"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                  aria-expanded={showSidebar}
                >
                  {/* Hamburger icon */}
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Desktop sidebar toggle button */}
                <button
                  className="hidden lg:flex p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-200"
                  onClick={toggleSidebarCollapsed}
                  aria-label="Toggle sidebar collapsed"
                  aria-expanded={!sidebarCollapsed}
                >
                  {/* Chevron icon */}
                  <svg className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div>
                  <div className="text-xs text-gray-400 mb-1">Pages / Overview</div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h1>
                </div>
              </div>
              
              {/* Right Side: Status and Icons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Status */}
                <div className="hidden sm:flex items-center bg-white shadow rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-gray-700">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Operational
                  </span>
                </div>
                
                {/* Icons - hide on very small screens */}
                <div className="hidden sm:flex items-center space-x-2">
                  <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                    {/* GitHub icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.848-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                  </a>
                  <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                    {/* Twitter icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.15 2.97 4.05 3A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" /></svg>
                  </a>
                  <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                    {/* Email icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0v1a4 4 0 004 4h0a4 4 0 004-4v-1" /></svg>
                  </a>
                  <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                    {/* Moon (dark mode) icon */}
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">API Key Management</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your API keys and their permissions</p>
            </div>

            {/* Create Button */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingKey(null);
                  setFormData({ name: '', description: '', permissions: [] });
                }}
                className={`${getButtonClasses()} text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl`}
              >
                + Create New API Key
              </button>
            </div>

            {/* Create/Edit Form */}
            {(showCreateForm || editingKey) && (
              <ApiKeyForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                editingKey={editingKey}
              />
            )}

            {/* API Keys List */}
            <ApiKeyList
              apiKeys={apiKeys}
              onCopy={copyToClipboard}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={clearNotification}
            />
          </div>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </ProtectedRoute>
  );
} 