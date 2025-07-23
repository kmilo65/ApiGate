import React from 'react';

export default function ApiKeyList({ apiKeys, onCopy, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Your API Keys</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{apiKey.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{apiKey.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {apiKey.created_at}</span>
                  <span>Last used: {apiKey.last_used || 'Never'}</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Permissions:</span>
                  {apiKey.permissions && apiKey.permissions.map(permission => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onCopy(apiKey.key)}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title="View Key"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => onCopy(apiKey.key)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Copy Key"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(apiKey)}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(apiKey.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <code className="text-sm text-gray-700 font-mono break-all">
                {"*".repeat(apiKey.key.length)}
              </code>
            </div>
          </div>
        ))}
      </div>
      {apiKeys.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No API keys found. Create your first API key to get started.
        </div>
      )}
    </div>
  );
} 