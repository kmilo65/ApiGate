'use client';

import { useState } from 'react';
import Link from "next/link";
import Notification from "@/app/components/Notification";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import useApiKeys from './useApiKeys';
import useNotification from './useNotification';
import ApiKeyList from './ApiKeyList';
import ApiKeyForm from './ApiKeyForm';

export default function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });
  const [showSidebar, setShowSidebar] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Sidebar - absolute and animated */}
        <Sidebar
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          `}
        />
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Upper Menu/Header */}
          <div className="flex items-center justify-between mb-8">
            {/* Breadcrumb and Title */}
            <div className="flex items-center space-x-4">
              {/* Hamburger toggle button */}
              <button
                className="p-2 rounded hover:bg-gray-200 focus:outline-none"
                onClick={() => setShowSidebar(!showSidebar)}
                aria-label="Toggle sidebar"
              >
                {/* Hamburger icon */}
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <div className="text-xs text-gray-400 mb-1">Pages / Overview</div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
              </div>
            </div>
            {/* Right Side: Status and Icons */}
            <div className="flex items-center space-x-4">
              {/* Status */}
              <div className="flex items-center bg-white shadow rounded-full px-4 py-1 text-sm font-medium text-gray-700">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Operational
                </span>
              </div>
              {/* Icons */}
              <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                {/* GitHub icon */}
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.848-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.135 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
              </a>
              <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                {/* Twitter icon */}
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.15 2.97 4.05 3A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" /></svg>
              </a>
              <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                {/* Email icon */}
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0v1a4 4 0 004 4h0a4 4 0 004-4v-1" /></svg>
              </a>
              <a href="#" className="bg-white shadow rounded-full p-2 hover:bg-gray-100 transition-colors">
                {/* Moon (dark mode) icon */}
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              </a>
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
            <p className="mt-2 text-gray-600">Manage your API keys and their permissions</p>
          </div>

          {/* Create Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingKey(null);
                setFormData({ name: '', description: '', permissions: [] });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
    </div>
    </ProtectedRoute>
  );
} 