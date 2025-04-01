import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../ui/button';
import { UserProfile } from './UserProfile';
import { Search, LogOut, HelpCircle, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PostgrestError } from '@supabase/supabase-js';
import { connectStripeAccount } from '@/lib/stripe/connect';

export function DashboardHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStripeConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const response = await connectStripeAccount();
      if (!response.success) {
        throw new Error(response.error || 'Failed to connect Stripe');
      }
      
      if (response.onboardingUrl) {
        window.location.href = response.onboardingUrl;
      } else {
        setStripeConnected(true);
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect Stripe');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHelpClick = () => {
    navigate('/docs');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Left section - Profile and Name */}
        <div className="flex items-center gap-4">
          <UserProfile />
        </div>

        {/* Middle section - Search */}
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200",
                  "bg-gray-50/50 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-brand-green/20",
                  "focus:shadow-[0_0_0_2px_rgba(34,197,94,0.1)]",
                  isSearchFocused 
                    ? "border-brand-green bg-white" 
                    : "border-gray-200"
                )}
              />
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-3">
          {!stripeConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStripeConnect}
              disabled={isConnecting}
              className="gap-2"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Stripe"}
            </Button>
          )}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpClick}
            className="gap-2"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
} 