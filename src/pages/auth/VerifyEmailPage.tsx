import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import Header from '@/components/common/Header';
import { supabase } from '@/lib/supabase';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkVerificationStatus = async () => {
      try {
        // First get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Force refresh the session to get the latest user data
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Refresh error:', refreshError);
          throw refreshError;
        }

        if (!refreshedSession?.user) {
          setIsLoading(false);
          return;
        }

        // Check if email is confirmed
        if (refreshedSession.user.email_confirmed_at) {
          setIsVerified(true);
          clearInterval(interval);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
        
        setIsLoading(false);
        // Reset error count on successful check
        setConsecutiveErrors(0);
        setError(null);
      } catch (error) {
        console.error('Error checking verification status:', error);
        // Only show error after 3 consecutive failures
        setConsecutiveErrors(prev => prev + 1);
        if (consecutiveErrors >= 3 && !isVerified) {
          setError('Unable to verify your email. Please try refreshing the page.');
        }
        setIsLoading(false);
      }
    };

    // Handle message from verification tab
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'EMAIL_VERIFIED') {
        await checkVerificationStatus();
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Initial check
    checkVerificationStatus();

    // Check verification status every 2 seconds
    interval = setInterval(checkVerificationStatus, 2000);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        await checkVerificationStatus();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, isVerified, consecutiveErrors]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-8 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 mb-4">
                <Mail className="h-6 w-6 text-brand-green animate-pulse" />
              </div>
              <CardTitle className="text-2xl">Checking verification status...</CardTitle>
              <CardDescription>Please wait while we verify your account.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10 mb-4">
              <Mail className="h-6 w-6 text-brand-green" />
            </div>
            <CardTitle className="text-2xl">
              {isVerified ? 'Email Verified!' : 'Check your email'}
            </CardTitle>
            <CardDescription>
              {isVerified 
                ? 'Your email has been verified. Redirecting you to the dashboard...'
                : `We've sent a verification link to ${email}`
              }
            </CardDescription>
          </CardHeader>
          {!isVerified && (
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="text-sm text-center text-brand-dark-600">
                <p>Click the link in your email to verify your account.</p>
                <p className="mt-2">
                  No email?{' '}
                  <Link to="/signup" className="font-medium text-brand-green hover:text-brand-green-600">
                    Try again
                  </Link>
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 