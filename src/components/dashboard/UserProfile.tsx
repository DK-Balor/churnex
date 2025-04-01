import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { ProfileIconModal } from './ProfileIconModal';

interface AccountStatus {
  account_type: 'demo' | 'trial' | 'paid';
  subscription_tier?: string;
  expires_at?: string;
}

interface UserProfile {
  first_name: string;
  icon_id: string;
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showIconModal, setShowIconModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewIconId, setPreviewIconId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        
        // First try to fetch the profile
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('first_name, icon_id')
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          // If the error is not a "not found" error, throw it
          if (fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          // If profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              first_name: user.email?.split('@')[0] || 'User',
              icon_id: 'chef',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating user profile:', createError);
            setError('Failed to create user profile');
            return;
          }

          if (newProfile) {
            setUserProfile(newProfile);
            setPreviewIconId(newProfile.icon_id);
          }
        } else if (data) {
          setUserProfile(data);
          setPreviewIconId(data.icon_id);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

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

  const handleIconSelect = async (iconId: string) => {
    if (!user?.id) return;

    try {
      setIsUpdating(true);
      setError(null);
      
      // First, get the current profile
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current profile:', fetchError);
        setError('Failed to update profile icon');
        return;
      }

      // Update the user's icon in the database
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          icon_id: iconId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentProfile.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user icon:', updateError);
        setError('Failed to update profile icon');
        // Revert preview on error
        setPreviewIconId(userProfile?.icon_id || 'chef');
        return;
      }

      if (data) {
        setUserProfile(prev => prev ? { ...prev, icon_id: iconId } : null);
        setPreviewIconId(iconId);
        setShowIconModal(false);
      }
    } catch (error) {
      console.error('Error updating user icon:', error);
      setError('Failed to update profile icon');
      setPreviewIconId(userProfile?.icon_id || 'chef');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIconPreview = (iconId: string) => {
    setPreviewIconId(iconId);
  };

  const handleModalClose = () => {
    setPreviewIconId(userProfile?.icon_id || 'chef');
    setShowIconModal(false);
  };

  const getIconEmoji = (iconId: string) => {
    switch (iconId) {
      case 'chef':
        return '👨‍🍳';
      case 'foodie':
        return '🍽️';
      case 'restaurant':
        return '🏪';
      case 'critic':
        return '📝';
      case 'host':
        return '👋';
      case 'manager':
        return '💼';
      default:
        return '👨‍🍳';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setShowIconModal(true)}
        className="flex items-center space-x-2"
      >
        <div 
          className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center cursor-pointer hover:bg-brand-green/20 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-lg">
              {getIconEmoji(previewIconId || userProfile?.icon_id || 'chef')}
            </span>
          )}
        </div>
        {isLoading ? (
          <span className="font-medium">Loading...</span>
        ) : (
          <span className="font-medium">{userProfile?.first_name || 'User'}</span>
        )}
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

      <ProfileIconModal
        isOpen={showIconModal}
        onClose={handleModalClose}
        onSelect={handleIconSelect}
        onPreview={handleIconPreview}
        currentIconId={userProfile?.icon_id || 'chef'}
      />

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 text-red-600 text-sm p-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
} 