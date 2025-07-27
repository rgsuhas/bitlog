/**
 * Login Form Component
 * 
 * A comprehensive login form with validation, error handling, and beautiful design.
 * Integrates with the authentication system to provide secure user login functionality
 * with proper UX patterns and accessibility features.
 * 
 * Features:
 * - Email and password validation
 * - Loading states and error handling
 * - Remember me functionality
 * - Password reset integration
 * - Responsive design
 * - Accessibility compliance
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2,
  Github,
  Chrome
} from 'lucide-react';

/**
 * Props interface for the LoginForm component
 */
interface LoginFormProps {
  /** Optional callback function called after successful login */
  onSuccess?: () => void;
  /** Optional callback function called when user wants to switch to register */
  onSwitchToRegister?: () => void;
  /** Optional CSS class name for styling customization */
  className?: string;
  /** Whether to show social login options */
  showSocialLogin?: boolean;
  /** Whether to show the register link */
  showRegisterLink?: boolean;
}

/**
 * Form data interface for type safety
 */
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Login Form Component
 * 
 * Renders a complete login form with validation, error handling, and integration
 * with the authentication system. Provides a smooth user experience with proper
 * loading states and error messages.
 * 
 * @param props - Component props
 * @returns JSX element representing the login form
 * 
 * @example
 * ```tsx
 * <LoginForm
 *   onSuccess={() => router.push('/dashboard')}
 *   onSwitchToRegister={() => setActiveTab('register')}
 *   showSocialLogin={true}
 * />
 * ```
 */
export function LoginForm({
  onSuccess,
  onSwitchToRegister,
  className,
  showSocialLogin = true,
  showRegisterLink = true,
}: LoginFormProps) {
  // Authentication context
  const { signIn, loading } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate form data
   * 
   * @param data - Form data to validate
   * @returns Object containing validation errors
   */
  const validateForm = (data: LoginFormData): Partial<LoginFormData> => {
    const newErrors: Partial<LoginFormData> = {};

    // Email validation
    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  /**
   * Handle input field changes
   * 
   * @param field - Field name to update
   * @param value - New field value
   */
  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  /**
   * Handle form submission
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Attempt to sign in
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        // Login successful
        onSuccess?.();
      } else {
        // Login failed
        setSubmitError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle social login (placeholder for future implementation)
   * 
   * @param provider - Social login provider
   */
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      // TODO: Implement social login with Supabase
      console.log(`Social login with ${provider} - Coming soon!`);
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Social Login Buttons */}
        {showSocialLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                disabled={loading || isSubmitting}
                className="w-full"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                disabled={loading || isSubmitting}
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Submit Error Alert */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={loading || isSubmitting}
                className={cn(
                  "pl-10",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={loading || isSubmitting}
                className={cn(
                  "pl-10 pr-10",
                  errors.password && "border-destructive focus-visible:ring-destructive"
                )}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                disabled={loading || isSubmitting}
                className="rounded border-border"
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Register Link */}
        {showRegisterLink && (
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            {onSwitchToRegister ? (
              <button
                onClick={onSwitchToRegister}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            ) : (
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}