import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DatabaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to select from the users table
        const { error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (error) throw error;
        
        setStatus('success');
        setMessage('Database connection successful! Tables are properly set up.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Database connection failed. Check your environment variables.');
        console.error('Database connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Database Connection Test</h3>
      <div className={`flex items-center space-x-2 ${
        status === 'success' ? 'text-green-600' : 
        status === 'error' ? 'text-red-600' : 
        'text-gray-600'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'success' ? 'bg-green-600' : 
          status === 'error' ? 'bg-red-600' : 
          'bg-gray-600 animate-pulse'
        }`} />
        <span>{message || 'Testing connection...'}</span>
      </div>
    </div>
  );
} 