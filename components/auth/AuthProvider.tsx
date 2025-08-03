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
import { createClientSupabase } from '@/lib/supabase/client';
import { authService, type ExtendedUser, type AuthResult } from '@/lib/auth';
import { UserProfile, getUserProfile, canEdit, Role } from '@/lib/roles';

/**
 * Authentication context interface defining available methods and state
 */
interface AuthContextType {
  // Authentication state
  user: ExtendedUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  
  // Authentication methods
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (data: any) => Promise<AuthResult>;
  
  // Utility methods
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  canEdit: boolean;
}

/**
 * Authentication context with default values
 * Provides type safety and prevents undefined context usage
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signUp: async () => ({ success: false, error: 'Auth context not initialized' }),
  signInWithOAuth: async () => ({ success: false, error: 'Auth context not initialized' }),
  signOut: async () => ({ success: false, error: 'Auth context not initialized' }),
  resetPassword: async () => ({ success: false, error: 'Auth context not initialized' }),
  updateProfile: async () => ({ success: false, error: 'Auth context not initialized' }),
  refreshUser: async () => {},
  isAuthenticated: false,
  canEdit: false,
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        
        console.log('Initial session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          error: sessionError?.message 
        });
        
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
          console.log('User found in session, fetching user data...');
          const userData = await authService.getCurrentUser();
          console.log('User data fetched:', { hasUser: !!userData, userId: userData?.id });
          if (mounted) {
            setUser(userData);
            if (userData) {
              const userProfile = await getUserProfile(userData);
              console.log('User profile fetched:', { hasProfile: !!userProfile, role: userProfile?.role });
              setProfile(userProfile);
            }
          }
        } else {
          console.log('No user in session');
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
      console.log(`[AUTH_PROVIDER] Auth state change:`, { event, hasSession: !!session, userId: session?.user?.id });
      
      setSession(session);
      setUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log(`[AUTH_PROVIDER] User signed in:`, { userId: session.user.id, email: session.user.email });
        
        try {
          // Create or update user profile for OAuth users
          const profileResult = await authService.createOrUpdateOAuthProfile(session.user);
          
          console.log(`[AUTH_PROVIDER] Profile creation result:`, { 
            success: profileResult.success, 
            error: profileResult.error,
            hasProfile: !!profileResult.data 
          });

          if (profileResult.success && profileResult.data) {
            setProfile({
              user: session.user,
              ...profileResult.data
            });
            console.log(`[AUTH_PROVIDER] Profile set successfully`);
          } else {
            console.error(`[AUTH_PROVIDER] Failed to create/update profile:`, profileResult.error);
          }
        } catch (error) {
          console.error(`[AUTH_PROVIDER] Error creating/updating profile:`, error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log(`[AUTH_PROVIDER] User signed out`);
        setProfile(null);
      }

      setLoading(false);
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
  const signInWithOAuth = async (provider: 'google' | 'github'): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      const result = await authService.loginWithOAuth(provider);

      return result;
    } catch (error) {
      console.error('Error in signInWithOAuth:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during OAuth sign in',
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
        setProfile(null);
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
      if (userData) {
        const userProfile = await getUserProfile(userData);
        setProfile(userProfile);
      }
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
    profile,
        session,
    loading,
    isAuthenticated: !!user,
    canEdit: canEdit(profile),
    
    // Methods
    signUp,
    signInWithOAuth,
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

/**
 * Higher-order component for protecting routes based on user role
 * 
 * @param WrappedComponent - Component to protect with authentication
 * @param allowedRoles - Array of roles that are allowed to access the component
 * @returns Protected component that redirects users without the required role
 * 
 * @example
 * ```tsx
 * const AdminDashboard = withRole(Dashboard, ['admin']);
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <AdminDashboard />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function withRole<P extends object>(WrappedComponent: React.ComponentType<P>, allowedRoles: Role[]) {
  return function RoleAuthenticatedComponent(props: P) {
    const { profile, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You do not have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
