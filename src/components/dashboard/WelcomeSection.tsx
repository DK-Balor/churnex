import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Everything you can imagine is real."
];

export function WelcomeSection() {
  const { user } = useAuth();
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome back, {user?.email?.split('@')[0] || 'User'}!
      </h2>
      <p className="text-gray-600 italic">"{quote}"</p>
    </div>
  );
} 