import { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AccountStatus {
  account_type: 'demo' | 'trial' | 'paid';
  subscription_tier?: string;
  expires_at?: string;
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'paid':
        return 'Pro';
      case 'trial':
        return 'Trial';
      default:
        return 'Demo';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'paid':
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'trial':
        return 'bg-amber-50/50 text-amber-600 border-amber-200/30';
      default:
        return 'bg-amber-50/50 text-amber-600 border-amber-200/30';
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2"
      >
        <span>{user?.email}</span>
        {accountStatus && (
          <Badge
            variant="outline"
            className={cn(
              "ml-2",
              getBadgeVariant(accountStatus.account_type)
            )}
          >
            {getAccountTypeLabel(accountStatus.account_type)}
          </Badge>
        )}
      </Button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              'Sign out'
            )}
          </button>
        </div>
      )}
    </div>
  );
} 