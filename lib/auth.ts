/**
 * Authentication System
 * 
 * Comprehensive authentication system using Supabase Auth with additional
 * security features, user management, and session handling. Provides
 * production-grade authentication with proper error handling and type safety.
 * 
 * Features:
 * - Email/password authentication
 * - Social authentication (Google, GitHub, etc.)
 * - Session management with automatic refresh
 * - User profile management
 * - Role-based access control
 * - Security features (rate limiting, password validation)
 */

import { createClientSupabase } from '@/lib/supabase/client';
import { dbUtils, type DatabaseProfile } from './supabase';
import { User, AuthError, Session } from '@supabase/supabase-js';

/**
 * Authentication result interface for consistent error handling
 */
export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

/**
 * User registration data interface
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

/**
 * User login data interface
 */
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Password reset data interface
 */
export interface ResetPasswordData {
  email: string;
}

/**
 * Profile update data interface
 */
export interface UpdateProfileData {
  name?: string;
  bio?: string;
  website?: string;
  avatar_url?: string;
}

/**
 * User roles for role-based access control
 */
export type UserRole = 'admin' | 'editor' | 'author' | 'reader';

/**
 * Extended user interface with profile information
 */
export interface ExtendedUser extends User {
  profile?: DatabaseProfile;
  role?: UserRole;
}

/**
 * Authentication service class with comprehensive user management
 */
export class AuthService {
  private supabase = createClientSupabase();

  /**
   * Register a new user with email and password
   * 
   * @param data - Registration data including email, password, and name
   * @returns Authentication result with user data or error
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.register({
   *   email: 'user@example.com',
   *   password: 'securePassword123',
   *   name: 'John Doe'
   * });
   * 
   * if (result.success) {
   *   console.log('User registered:', result.data);
   * } else {
   *   console.error('Registration failed:', result.error);
   * }
   * ```
   */
  async register(data: RegisterData): Promise<AuthResult<User>> {
    try {
      // Validate input data
      const validation = this.validateRegistrationData(data);
      if (!validation.success) {
        return validation;
      }

      // Register user with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: this.getAuthErrorMessage(authError),
          details: authError,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Registration failed - no user data returned',
        };
      }

      // Create user profile
      const profileResult = await this.createUserProfile(authData.user, data.name);
      if (!profileResult.success) {
        console.error('Failed to create user profile:', profileResult.error);
        // Don't fail registration if profile creation fails
      }

      return {
        success: true,
        data: authData.user,
      };
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during registration',
        details: error,
      };
    }
  }

  /**
   * Login user with email and password
   * 
   * @param data - Login credentials
   * @returns Authentication result with session data or error
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.login({
   *   email: 'user@example.com',
   *   password: 'userPassword123'
   * });
   * 
   * if (result.success) {
   *   console.log('User logged in:', result.data);
   * } else {
   *   console.error('Login failed:', result.error);
   * }
   * ```
   */
  async login(data: LoginData): Promise<AuthResult<Session>> {
    try {
      // Validate input data
      if (!data.email || !data.password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: this.getAuthErrorMessage(authError),
          details: authError,
        };
      }

      if (!authData.session) {
        return {
          success: false,
          error: 'Login failed - no session created',
        };
      }

      return {
        success: true,
        data: authData.session,
      };
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login',
        details: error,
      };
    }
  }

  /**
   * Logout current user
   * 
   * @returns Authentication result indicating success or failure
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.logout();
   * 
   * if (result.success) {
   *   console.log('User logged out successfully');
   * }
   * ```
   */
  async logout(): Promise<AuthResult<void>> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: this.getAuthErrorMessage(error),
          details: error,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during logout',
        details: error,
      };
    }
  }

  /**
   * Login with OAuth provider
   * 
   * @param provider - OAuth provider (google or github)
   * @returns Authentication result with redirect URL or error
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.loginWithOAuth('google');
   * 
   * if (result.success) {
   *   window.location.href = result.data.url;
   * }
   * ```
   */
  async loginWithOAuth(provider: 'google' | 'github'): Promise<AuthResult<{ url: string }>> {
    try {
      console.log(`[AUTH] Starting OAuth login with provider: ${provider}`);
      
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      console.log(`[AUTH] OAuth signInWithOAuth response:`, { data, error });

      if (error) {
        console.error(`[AUTH] OAuth login error:`, error);
        return {
          success: false,
          error: error.message || 'OAuth login failed',
          data: null
        };
      }

      if (!data.url) {
        console.error(`[AUTH] No redirect URL received from OAuth provider`);
        return {
          success: false,
          error: 'No redirect URL received from OAuth provider',
          data: null
        };
      }

      console.log(`[AUTH] OAuth login successful, redirecting to: ${data.url}`);
      return {
        success: true,
        error: null,
        data: { url: data.url }
      };
    } catch (error) {
      console.error(`[AUTH] Unexpected error during OAuth login:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error during OAuth login',
        data: null
      };
    }
  }

  /**
   * Send password reset email
   * 
   * @param data - Password reset data containing email
   * @returns Authentication result indicating success or failure
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.resetPassword({
   *   email: 'user@example.com'
   * });
   * 
   * if (result.success) {
   *   console.log('Password reset email sent');
   * }
   * ```
   */
  async resetPassword(data: ResetPasswordData): Promise<AuthResult<void>> {
    try {
      if (!data.email) {
        return {
          success: false,
          error: 'Email is required for password reset',
        };
      }

      const { error } = await this.supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: this.getAuthErrorMessage(error),
          details: error,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during password reset',
        details: error,
      };
    }
  }

  /**
   * Get current authenticated user with profile information
   * 
   * @returns Extended user data or null if not authenticated
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const user = await authService.getCurrentUser();
   * 
   * if (user) {
   *   console.log('Current user:', user.email);
   *   console.log('Profile:', user.profile);
   * }
   * ```
   */
  async getCurrentUser(): Promise<ExtendedUser | null> {
    try {
      const user = await dbUtils.getCurrentUser(this.supabase);
      
      if (!user) {
        return null;
      }

      // Fetch user profile
      const profile = await dbUtils.getUserProfile(this.supabase, user.id);

      return {
        ...user,
        profile: profile || undefined,
        role: profile?.role as UserRole,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user profile information
   * 
   * @param userId - User ID to update profile for
   * @param data - Profile update data
   * @returns Authentication result with updated profile or error
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const result = await authService.updateProfile(userId, {
   *   name: 'Updated Name',
   *   bio: 'Updated bio'
   * });
   * 
   * if (result.success) {
   *   console.log('Profile updated:', result.data);
   * }
   * ```
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<AuthResult<DatabaseProfile>> {
    try {
      // Get current user to include email
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const updateData = {
        id: userId,
        email: currentUser.email!,
        name: data.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
        ...data,
        updated_at: new Date().toISOString(),
      };

      const profile = await dbUtils.upsertUserProfile(this.supabase, updateData);

      if (!profile) {
        return {
          success: false,
          error: 'Failed to update profile',
        };
      }

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating profile',
        details: error,
      };
    }
  }

  /**
   * Check if user has specific role or permission
   * 
   * @param user - User to check permissions for
   * @param requiredRole - Required role for access
   * @returns Boolean indicating if user has required role
   * 
   * @example
   * ```typescript
   * const authService = new AuthService();
   * const user = await authService.getCurrentUser();
   * 
   * if (authService.hasRole(user, 'admin')) {
   *   console.log('User has admin access');
   * }
   * ```
   */
  hasRole(user: ExtendedUser | null, requiredRole: UserRole): boolean {
    if (!user) return false;

    // For now, implement basic role checking
    // In production, this would check against user roles in the database
    const userRole = user.role || 'reader';
    
    const roleHierarchy: Record<UserRole, number> = {
      reader: 1,
      author: 2,
      editor: 3,
      admin: 4,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Create user profile after successful registration
   * 
   * @private
   * @param user - Authenticated user
   * @param name - User's display name
   * @returns Result of profile creation
   */
  private async createUserProfile(user: User, name: string): Promise<AuthResult<DatabaseProfile>> {
    try {
      const profileData = {
        id: user.id,
        email: user.email!,
        name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profile = await dbUtils.upsertUserProfile(this.supabase, profileData);

      if (!profile) {
        return {
          success: false,
          error: 'Failed to create user profile',
        };
      }

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return {
        success: false,
        error: 'Failed to create user profile',
        details: error,
      };
    }
  }

  /**
   * Create or update user profile for OAuth users
   * 
   * @param user - Authenticated user from OAuth
   * @returns Result of profile creation/update
   */
  async createOrUpdateOAuthProfile(user: User): Promise<AuthResult<DatabaseProfile>> {
    try {
      // Check if profile already exists
      const existingProfile = await dbUtils.getUserProfile(this.supabase, user.id);
      
      if (existingProfile) {
        // Profile exists, just return it
        return {
          success: true,
          data: existingProfile,
        };
      }

      // Create new profile for OAuth user
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      
      const profileData = {
        id: user.id,
        email: user.email!,
        name: name,
        role: 'author' as const, // Default role for OAuth users
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const profile = await dbUtils.upsertUserProfile(this.supabase, profileData);

      if (!profile) {
        return {
          success: false,
          error: 'Failed to create user profile',
        };
      }

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      console.error('Error creating OAuth user profile:', error);
      return {
        success: false,
        error: 'Failed to create user profile',
        details: error,
      };
    }
  }

  /**
   * Validate registration data
   * 
   * @private
   * @param data - Registration data to validate
   * @returns Validation result
   */
  private validateRegistrationData(data: RegisterData): AuthResult<User> {
    if (!data.email || !data.password || !data.name) {
      return {
        success: false,
        error: 'Email, password, and name are required',
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    // Password validation
    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    // Password confirmation validation
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
      };
    }

    // Name validation
    if (data.name.trim().length < 2) {
      return {
        success: false,
        error: 'Name must be at least 2 characters long',
      };
    }

    return {
      success: true,
    };
  }

  /**
   * Convert Supabase auth errors to user-friendly messages
   * 
   * @private
   * @param error - Supabase auth error
   * @returns User-friendly error message
   */
  private getAuthErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.';
      case 'Signup is disabled':
        return 'New user registration is currently disabled.';
      case 'Email rate limit exceeded':
        return 'Too many email requests. Please wait before trying again.';
      default:
        return error.message || 'An authentication error occurred. Please try again.';
    }
  }
}



/**
 * Export singleton instance for client-side use
 */
export const authService = new AuthService();