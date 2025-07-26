import { useState, useEffect } from 'react';

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingKey, setEditingKey] = useState(null);

  // Fetch API keys from REST endpoint
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch API keys');
      const response = await res.json();
      
      // Handle new API response structure
      if (response.success && Array.isArray(response.data)) {
        setApiKeys(response.data);
      } else if (Array.isArray(response)) {
        // Fallback for old API structure
        setApiKeys(response);
      } else {
        setApiKeys([]);
      }
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError('Failed to load API keys');
      setApiKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const createApiKey = async (formData) => {
    try {
      setError(null);
      
      // Debug: Log the data being sent
      console.log('Creating API key with data:', formData);
      
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const response = await res.json();
      
      // Debug: Log the response
      console.log('API response status:', res.status);
      console.log('API response:', response);
      
      if (!res.ok) {
        // Extract error message from response
        const errorMessage = response.error || response.details || 'Failed to create API key';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Handle new API response structure
      const newKey = response.success ? response.data : response;
      setApiKeys([newKey, ...apiKeys]);
      return { success: true };
    } catch (err) {
      console.error('Error creating API key:', err);
      setError(err.message || 'Failed to create API key');
      return { success: false };
    }
  };

  const updateApiKey = async (id, formData) => {
    try {
      setError(null);
      
      // Debug: Log the data being sent
      console.log('Updating API key with data:', { id, ...formData });
      
      const res = await fetch('/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData }),
      });
      
      const response = await res.json();
      
      // Debug: Log the response
      console.log('API response status:', res.status);
      console.log('API response:', response);
      
      if (!res.ok) {
        // Extract error message from response
        const errorMessage = response.error || response.details || 'Failed to update API key';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Update the local state with the new data
      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === id 
            ? { 
                ...key, 
                name: formData.name,
                description: formData.description,
                permissions: formData.permissions
              }
            : key
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating API key:', err);
      setError(err.message || 'Failed to update API key');
      return { success: false };
    }
  };

  const deleteApiKey = async (id) => {
    try {
      setError(null);
      
      // Debug: Log the data being sent
      console.log('Deleting API key with id:', id);
      
      const res = await fetch('/api', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const response = await res.json();
      
      // Debug: Log the response
      console.log('API response status:', res.status);
      console.log('API response:', response);
      
      if (!res.ok) {
        // Extract error message from response
        const errorMessage = response.error || response.details || 'Failed to delete API key';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError(err.message || 'Failed to delete API key');
      return { success: false };
    }
  };

  // Validate API Key using the REST endpoint
  const validateApiKey = async (apiKey) => {
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      if (!res.ok) return false;
      const result = await res.json();
      return result.valid;
    } catch (err) {
      console.error('Error validating API key:', err);
      return false;
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    setError,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    editingKey,
    setEditingKey,
    validateApiKey,
  };
} 