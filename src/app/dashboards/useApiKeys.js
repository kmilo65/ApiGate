import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingKey, setEditingKey] = useState(null);

  // Fetch API keys from Supabase
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
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

  const generateApiKey = () => {
    return `pk_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
  };

  const createApiKey = async (formData) => {
    try {
      setError(null);
      const newKey = {
        name: formData.name,
        key: generateApiKey(),
        description: formData.description,
        permissions: formData.permissions,
        created_at: new Date().toISOString().split('T')[0],
        last_used: new Date().toISOString().split('T')[0]
      };
      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select();
      if (error) throw error;
      setApiKeys([data[0], ...apiKeys]);
      return { success: true };
    } catch (err) {
      setError('Failed to create API key');
      return { success: false };
    }
  };

  const updateApiKey = async (id, formData) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('api_keys')
        .update({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        })
        .eq('id', id);
      if (error) throw error;
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
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete API key');
      return { success: false };
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
  };
} 