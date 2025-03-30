import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../ui/button';

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Churnex
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 