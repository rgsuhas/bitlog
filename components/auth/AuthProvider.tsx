/**
 * Authentication Provider Component
 * 
 * React Context provider for managing authentication state throughout the application.
 * Provides user authentication status, user data, and authentication methods to all
 * child components with automatic session management and real-time updates.
 * 
 * Features:
 * - Automatic session management with Supabase Auth
 * - Real-time authentication state updates
 * - User profile data integration
 * - Loading states for authentication operations
 * - Error handling and recovery
 * - TypeScript support with proper typing
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { createClientSupabase } from '@/lib/supabase';
import { authService, type ExtendedUser, type AuthResult } from '@/lib/auth';

/**
 * Authentication context interface defining available methods and state
 */
interface AuthContextType {
  // Authentication state
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  
  // Authentication methods
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (data: any) => Promise<AuthResult>;
  
  // Utility methods
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Authentication context with default values
 * Provides type safety and prevents undefined context usage
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ success: false, error: 'Auth context not initialized' }),
  signIn: async () => ({ success: false, error: 'Auth context not initialized' }),
  signOut: async () => ({ success: false, error: 'Auth context not initialized' }),
  resetPassword: async () => ({ success: false, error: 'Auth context not initialized' }),
  updateProfile: async () => ({ success: false, error: 'Auth context not initialized' }),
  refreshUser: async () => {},
  isAuthenticated: false,
});

/**
 * Props interface for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides authentication methods to child components.
 * Automatically handles session management, user data fetching, and real-time updates.
 * 
 * @param props - Component props containing children to wrap
 * @returns JSX element providing authentication context
 * 
 * @example
 * ```tsx
 * // Wrap your app with the AuthProvider
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourAppComponents />
 *     </AuthProvider>
 *   );
 * }
 * 
 * // Use authentication in any child component
 * function LoginButton() {
 *   const { signIn, user, loading } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (user) return <div>Welcome, {user.email}!</div>;
 *   
 *   return (
 *     <button onClick={() => signIn('email@example.com', 'password')}>
 *       Sign In
 *     </button>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Authentication state
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Supabase client instance
  const supabase = createClientSupabase();

  /**
   * Initialize authentication state and set up listeners
   * Runs once when the component mounts
   */
  useEffect(() => {
    let mounted = true;

    /**
     * Get initial session and user data
     */
    const getInitialSession = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
        }

        // Get user data if session exists
        if (session?.user) {
          const userData = await authService.getCurrentUser();
          if (mounted) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    /**
     * Handle authentication state changes
     * 
     * @param event - Type of authentication event
     * @param session - Current session data
     */
    const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (!mounted) return;

      setSession(session);
      setLoading(true);

      try {
        if (session?.user) {
          // User signed in - fetch full user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else {
          // User signed out - clear user data
          setUser(null);
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initialize authentication state
    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  /**
   * Sign up a new user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param name - User's display name
   * @returns Authentication result with success status and any errors
   */
  const signUp = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const result = await authService.register({
        email,
        password,
        name,
      });

      return result;
    } catch (error) {
      console.error('Error in signUp:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up',
        details: error,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Authentication result with success status and any errors
   */
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const result = await authService.login({
        email,
        password,
      });

      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in',
        details: error,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   * 
   * @returns Authentication result with success status and any errors
   */
  const signOut = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const result = await authService.logout();
      
      // Clear local state immediately for better UX
      if (result.success) {
        setUser(null);
        setSession(null);
      }

      return result;
    } catch (error) {
      console.error('Error in signOut:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out',
        details: error,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send password reset email
   * 
   * @param email - User's email address
   * @returns Authentication result with success status and any errors
   */
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      const result = await authService.resetPassword({ email });
      return result;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during password reset',
        details: error,
      };
    }
  };

  /**
   * Update user profile information
   * 
   * @param data - Profile data to update
   * @returns Authentication result with success status and any errors
   */
  const updateProfile = async (data: any): Promise<AuthResult> => {
    try {
      if (!user) {
        return {
          success: false,
          error: 'No user logged in',
        };
      }

      setLoading(true);
      
      const result = await authService.updateProfile(user.id, data);
      
      // Update local user state if successful
      if (result.success && result.data) {
        setUser(prev => prev ? {
          ...prev,
          profile: result.data,
        } : null);
      }

      return result;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during profile update',
        details: error,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh current user data
   * Useful for updating user information after external changes
   */
  const refreshUser = async (): Promise<void> => {
    try {
      if (!session?.user) return;

      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Context value object containing all authentication state and methods
   */
  const contextValue: AuthContextType = {
    // State
    user,
    session,
    loading,
    isAuthenticated: !!user,
    
    // Methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing authentication context
 * 
 * Provides a convenient way to access authentication state and methods
 * from any component within the AuthProvider tree.
 * 
 * @returns Authentication context with user data and methods
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, loading, updateProfile } = useAuth();
 *   
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   if (!user) {
 *     return <div>Please sign in</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {user.email}!</h1>
 *       <button onClick={() => updateProfile({ name: 'New Name' })}>
 *         Update Profile
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Higher-order component for protecting routes that require authentication
 * 
 * @param WrappedComponent - Component to protect with authentication
 * @returns Protected component that redirects unauthenticated users
 * 
 * @example
 * ```tsx
 * const ProtectedDashboard = withAuth(Dashboard);
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <ProtectedDashboard />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}