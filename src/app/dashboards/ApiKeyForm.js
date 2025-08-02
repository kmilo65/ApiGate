import React from 'react';

export default function ApiKeyForm({ formData, setFormData, onSubmit, onCancel, editingKey }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
        {editingKey ? 'Edit API Key' : 'Create New API Key'}
      </h3>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-colors"
            placeholder="Enter API key name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition-colors"
            rows="3"
            placeholder="Enter description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Permissions
          </label>
          <div className="space-y-2">
            {['read', 'write', 'delete'].map(permission => (
              <label key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        permissions: [...formData.permissions, permission]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        permissions: formData.permissions.filter(p => p !== permission)
                      });
                    }
                  }}
                  className="mr-2 text-amber-600 focus:ring-amber-500"
                />
                <span className="capitalize text-sm sm:text-base text-gray-700">{permission}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onSubmit}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl"
          >
            {editingKey ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 