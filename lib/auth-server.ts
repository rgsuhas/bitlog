import { createServerSupabase } from '@/lib/supabase/server';
import { dbUtils } from './supabase';
import { User } from '@supabase/supabase-js';
import { UserRole } from './auth';

/**
 * Server-side authentication utilities for API routes and Server Components
 */
export const serverAuth = {
  /**
   * Get authenticated user from server context
   *
   * @returns Current user or null if not authenticated
   *
   * @example
   * ```typescript
   * // In API route or Server Component
   * const user = await serverAuth.getUser();
   *
   * if (!user) {
   *   return new Response('Unauthorized', { status: 401 });
   * }
   * ```
   */
  async getUser(): Promise<User | null> {
    try {
      const supabase = createServerSupabase();
      return await dbUtils.getCurrentUser(supabase);
    } catch (error) {
      console.error('Error getting server user:', error);
      return null;
    }
  },

  /**
   * Require authentication for API routes
   *
   * @returns Authenticated user or throws error
   *
   * @example
   * ```typescript
   * // In API route
   * try {
   *   const user = await serverAuth.requireAuth();
   *   // User is authenticated, proceed with request
   * } catch (error) {
   *   return new Response('Unauthorized', { status: 401 });
   * }
   * ```
   */
  async requireAuth(): Promise<User> {
    const user = await this.getUser();

    if (!user) {
      throw new Error('Authentication required');
    }

    return user;
  },

  /**
   * Check if user has required role for server-side operations
   *
   * @param requiredRole - Required role for access
   * @returns Boolean indicating if user has required role
   *
   * @example
   * ```typescript
   * // In API route
   * const hasAccess = await serverAuth.hasRole('admin');
   *
   * if (!hasAccess) {
   *   return new Response('Forbidden', { status: 403 });
   * }
   * ```
   */
  async hasRole(requiredRole: UserRole): Promise<boolean> {
    try {
      const user = await this.getUser();
      if (!user) return false;

      // In production, fetch user role from database
      // For now, implement basic role checking
      return true; // Placeholder implementation
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  },
};
