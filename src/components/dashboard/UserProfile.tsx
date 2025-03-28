import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAccountTypeLabel, PlanType } from '@/types/account';

// Default avatar options
const defaultAvatars = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.png',
  '/avatars/avatar-3.png',
  '/avatars/avatar-4.png',
  '/avatars/avatar-5.png',
  '/avatars/avatar-6.png',
  '/avatars/avatar-7.png',
  '/avatars/avatar-8.png',
];

interface UserData {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
  account_type?: 'demo' | 'trial' | 'paid';
  subscription_tier?: PlanType;
}

interface UserProfileProps {
  showSettingsMenu?: boolean;
}

export default function UserProfile({ showSettingsMenu = true }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupUser = async () => {
      // Get the current user immediately
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Set initial data based on auth user
        setUserData({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          account_type: 'demo'
        });
        
        // Then fetch complete profile data
        fetchUserProfile();
      }
    };

    setupUser();
  }, []);

  async function fetchUserProfile() {
    try {
      setError(null);
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        setError('Authentication error');
        return;
      }

      if (!user) {
        console.error('No user found');
        setError('No user found');
        return;
      }

      // Try to get the profile and account status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .eq('id', user.id)
        .single();

      // Get account status
      const { data: accountStatus, error: accountError } = await supabase
        .from('account_status')
        .select('account_type, subscription_tier')
        .eq('id', user.id)
        .single();

      if (accountError) {
        console.error('Account status error:', accountError);
        // Create default account status if it doesn't exist
        const { data: newStatus, error: createStatusError } = await supabase
          .from('account_status')
          .insert([
            {
              id: user.id,
              account_type: 'demo',
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ])
          .select('account_type, subscription_tier')
          .single();

        if (createStatusError) {
          console.error('Create account status error:', createStatusError);
        } else if (newStatus) {
          console.log('Created new account status:', newStatus);
        }
      }

      if (profileError) {
        console.error('Profile error:', profileError);
        
        // If profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email,
              avatar_url: null
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Create profile error:', createError);
          setError('Error creating profile');
          return;
        }

        if (newProfile) {
          setUserData({
            ...newProfile,
            account_type: accountStatus?.account_type || 'demo',
            subscription_tier: accountStatus?.subscription_tier as PlanType
          });
          setSelectedAvatar(newProfile.avatar_url);
          setPreviewAvatar(newProfile.avatar_url);
        }
      } else if (profile) {
        setUserData({
          ...profile,
          account_type: accountStatus?.account_type || 'demo',
          subscription_tier: accountStatus?.subscription_tier as PlanType
        });
        setSelectedAvatar(profile.avatar_url);
        setPreviewAvatar(profile.avatar_url);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateAvatar(avatarUrl: string) {
    try {
      setError(null);
      setIsUpdating(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error in updateAvatar:', authError);
        setError('Authentication error');
        return;
      }

      if (!user) {
        console.error('No user found in updateAvatar');
        setError('No user found');
        return;
      }

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: avatarUrl,
          email: user.email,
          full_name: userData?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        })
        .select()
        .single();

      if (updateError) {
        console.error('Update avatar error:', updateError);
        setError('Failed to update avatar');
        return;
      }

      if (updateData) {
        console.log('Updated profile:', updateData);
        setUserData(updateData);
        setSelectedAvatar(updateData.avatar_url);
        setPreviewAvatar(updateData.avatar_url);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error in updateAvatar:', error);
      setError('Unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  }

  // Handle preview selection
  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setPreviewAvatar(avatar); // Update preview immediately
  };

  // Get first name, with better fallback handling
  const firstName = userData?.full_name 
    ? userData.full_name.split(' ')[0] 
    : userData?.email?.split('@')[0] || 'User';

  // Get badge color based on account type
  const getBadgeVariant = () => {
    switch (userData?.account_type) {
      case 'paid':
        return 'default';
      case 'trial':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all">
          {isLoading ? (
            <>
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </>
          ) : (
            <>
              <img
                src={previewAvatar || '/avatars/avatar-1.png'}
                alt="User avatar"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-green/20"
              />
              <span className="text-base font-semibold text-gray-900">
                {firstName}
              </span>
            </>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your profile picture</DialogTitle>
          <DialogDescription>
            Select an avatar to personalize your profile
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 p-4">
          {defaultAvatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleAvatarSelect(avatar)}
              className={cn(
                "relative rounded-full overflow-hidden aspect-square transition-all",
                "hover:ring-2 hover:ring-brand-green",
                selectedAvatar === avatar && "ring-2 ring-brand-green"
              )}
            >
              <img
                src={avatar}
                alt={`Avatar option ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedAvatar === avatar && (
                <div className="absolute inset-0 bg-brand-green/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 px-4 pb-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setPreviewAvatar(userData?.avatar_url || null);
            }}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedAvatar && updateAvatar(selectedAvatar)}
            disabled={!selectedAvatar || isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Apply'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 