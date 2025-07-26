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
      const data = await res.json();
      setApiKeys(data || []);
    } catch (err) {
      setError('Failed to load API keys');
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
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create API key');
      const data = await res.json();
      setApiKeys([data, ...apiKeys]);
      return { success: true };
    } catch (err) {
      setError('Failed to create API key');
      return { success: false };
    }
  };

  const updateApiKey = async (id, formData) => {
    try {
      setError(null);
      const res = await fetch('/api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData }),
      });
      if (!res.ok) throw new Error('Failed to update API key');
      setApiKeys(apiKeys.map(key => key.id === id ? { ...key, ...formData } : key));
      return { success: true };
    } catch (err) {
      setError('Failed to update API key');
      return { success: false };
    }
  };

  const deleteApiKey = async (id) => {
    try {
      setError(null);
      const res = await fetch('/api', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete API key');
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete API key');
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
    validateApiKey, // <-- add this
  };
} 