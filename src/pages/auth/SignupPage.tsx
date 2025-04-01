import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/common/Header';
import { supabase } from '@/lib/supabase';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    dataProtection: false,
    whatsNext: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { password } = formData;
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordStrong) {
      setError('Please ensure your password meets all requirements');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company: formData.company,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!data?.user) {
        throw new Error('No user data returned from signup');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPasswordStrengthPercentage = () => {
    const metRequirements = Object.values(passwordStrength).filter(Boolean).length;
    return (metRequirements / 5) * 100;
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? 'text-green-700' : 'text-red-700'}>{text}</span>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-8 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">
                We've sent a verification link to {formData.email}. Please check your inbox and click the link to verify your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-center text-brand-dark-600">
                Redirecting to verification page...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sign Up Form */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Enter your information to get started with Churnex
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Full name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Company name <span className="text-brand-dark-400">(optional)</span>
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-dark-700 mb-1">
                      Confirm password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label htmlFor="acceptTerms" className="ml-2 block text-sm text-brand-dark-700">
                      I agree to the{' '}
                      <Link to="/terms" className="font-medium text-brand-green hover:text-brand-green-600">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="font-medium text-brand-green hover:text-brand-green-600">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-green text-white hover:bg-brand-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>

                  <p className="text-center text-sm text-brand-dark-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-brand-green hover:text-brand-green-600">
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Requirements and Information */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password Requirements</CardTitle>
                  <CardDescription>Your password must meet the following criteria:</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters long" />
                    <PasswordRequirement met={passwordStrength.hasUpperCase} text="Contains uppercase letter" />
                    <PasswordRequirement met={passwordStrength.hasLowerCase} text="Contains lowercase letter" />
                    <PasswordRequirement met={passwordStrength.hasNumber} text="Contains number" />
                    <PasswordRequirement met={passwordStrength.hasSpecialChar} text="Contains special character" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-green transition-all duration-300 ease-in-out"
                        style={{ width: `${getPasswordStrengthPercentage()}%` }}
                      />
                    </div>
                    <p className="text-sm text-brand-dark-600 text-center">
                      Password strength: {Math.round(getPasswordStrengthPercentage())}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <button
                    onClick={() => toggleSection('dataProtection')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <CardTitle>Data Protection</CardTitle>
                      <CardDescription>How we handle your information</CardDescription>
                    </div>
                    {expandedSections.dataProtection ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </CardHeader>
                {expandedSections.dataProtection && (
                  <CardContent className="prose prose-sm">
                    <p>
                      At Churnex, we take your privacy seriously. We comply with GDPR and other data protection regulations:
                    </p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Your data is encrypted and stored securely</li>
                      <li>We never share your information without consent</li>
                      <li>You can request data deletion at any time</li>
                      <li>Regular security audits and updates</li>
                    </ul>
                  </CardContent>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <button
                    onClick={() => toggleSection('whatsNext')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div>
                      <CardTitle>What's Next?</CardTitle>
                      <CardDescription>After creating your account</CardDescription>
                    </div>
                    {expandedSections.whatsNext ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </CardHeader>
                {expandedSections.whatsNext && (
                  <CardContent className="prose prose-sm">
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>Check your email for verification link</li>
                      <li>Click the link to verify your account</li>
                      <li>Set up your company profile</li>
                      <li>Connect your data sources</li>
                      <li>Get your first AI-powered insights</li>
                    </ol>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 