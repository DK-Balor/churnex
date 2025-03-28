import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the type of auth callback
        const type = searchParams.get('type');
        
        if (type === 'email_confirmation') {
          // This is an email verification callback
          try {
            // Get the current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            
            if (session) {
              // Refresh the session to get the updated user data
              const { data: { user }, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError) throw refreshError;
              
              if (user?.email_confirmed_at) {
                // Message the original tab and close this one
                if (window.opener) {
                  window.opener.postMessage({ type: 'EMAIL_VERIFIED' }, window.location.origin);
                  window.close();
                } else {
                  // If no opener, redirect to dashboard
                  navigate('/dashboard');
                }
                return;
              }
            }
          } catch (error) {
            console.error('Error handling email verification:', error);
            // If there's an error, try to close the window or redirect
            if (window.opener) {
              window.close();
            } else {
              navigate('/login');
            }
            return;
          }
        }

        // For other auth callbacks (or if email verification handling fails)
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        
        if (access_token && refresh_token) {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });
            
            if (error) throw error;

            if (data?.user) {
              navigate('/dashboard');
              return;
            }
          } catch (error) {
            console.error('Error setting session:', error);
          }
        }
        
        navigate('/login');
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-brand-dark-900 mb-2">Verifying...</h2>
        <p className="text-brand-dark-600">Please wait while we verify your account.</p>
      </div>
    </div>
  );
} 