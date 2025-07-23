import { useState, useEffect } from 'react';

export default function useNotification() {
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification({ ...notification, message: '' });
  };

  return { notification, showNotification, clearNotification };
} 