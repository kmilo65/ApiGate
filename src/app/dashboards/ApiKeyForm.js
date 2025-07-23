import React from 'react';

export default function ApiKeyForm({ formData, setFormData, onSubmit, onCancel, editingKey }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {editingKey ? 'Edit API Key' : 'Create New API Key'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mr-2"
                />
                <span className="capitalize">{permission}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {editingKey ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 