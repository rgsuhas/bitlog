/**
 * OAuth Login Form Component
 * 
 * A simple login form that only supports OAuth providers (Google, GitHub).
 * Provides a clean, modern interface for social login with proper error handling.
 * 
 * Features:
 * - OAuth provider buttons (Google, GitHub)
 * - Loading states and error handling
 * - Responsive design
 * - Accessibility compliance
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  Loader2,
  Github
} from 'lucide-react';
import { authService } from '@/services/authService';

/**
 * Props interface for the LoginForm component
 */
interface LoginFormProps {
  /** Optional callback function called after successful login */
  onSuccess?: () => void;
  /** Optional CSS class name for styling customization */
  className?: string;
  /** Redirect URL after successful login */
  redirectTo?: string;
}

/**
 * OAuth Login Form Component
 * 
 * Renders a simple login form with OAuth provider buttons.
 * Provides a smooth user experience with proper loading states and error messages.
 * 
 * @param props - Component props
 * @returns JSX element representing the OAuth login form
 * 
 * @example
 * ```tsx
 * <LoginForm
 *   onSuccess={() => router.push('/dashboard')}
 *   redirectTo="/dashboard"
 * />
 * ```
 */
export function LoginForm({
  onSuccess,
  className,
  redirectTo = '/dashboard',
}: LoginFormProps) {
  // Authentication context
  const { loading, setLoading } = useAuth();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  /**
   * Handle OAuth login
   * 
   * @param provider - OAuth provider (google or github)
   */
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      console.log(`[LOGIN] Starting OAuth login with ${provider}`);
      setLoading(true);
      setError('');
      
      const result = await authService.loginWithOAuth(provider);
      
      console.log(`[LOGIN] OAuth login result:`, { 
        success: result.success, 
        error: result.error,
        hasUrl: !!result.data?.url 
      });

      if (result.success && result.data?.url) {
        console.log(`[LOGIN] Redirecting to OAuth provider: ${result.data.url}`);
        window.location.href = result.data.url;
      } else {
        console.error(`[LOGIN] OAuth login failed:`, result.error);
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error(`[LOGIN] Unexpected error during OAuth login:`, error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome to BitLog
        </CardTitle>
        <CardDescription className="text-center">
          Sign in with your social account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Login Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading || isSubmitting === 'google'}
            className="w-full h-12 text-base"
          >
            {isSubmitting === 'google' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            disabled={loading || isSubmitting === 'github'}
            className="w-full h-12 text-base"
          >
            {isSubmitting === 'github' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in with GitHub...
              </>
            ) : (
              <>
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </>
            )}
          </Button>
        </div>

        {/* Info Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}