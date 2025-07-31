'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Notification from '@/app/components/Notification';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">API Playground</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your API Key"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Submit'}
          </button>
        </form>
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, message: '' })}
        />
      </div>
    </div>
  );
} 