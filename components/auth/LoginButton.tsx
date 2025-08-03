'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, Github, User, Settings, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function LoginButton() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsSubmitting(provider);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          redirectTo: '/dashboard',
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to OAuth provider
        window.location.href = data.url;
      } else {
        console.error('OAuth login failed:', data.error);
        toast({
          title: "Login failed",
          description: data.error || "Failed to initiate OAuth login",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OAuth login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      } else {
        toast({
          title: "Logout failed",
          description: result.error || "Failed to log out",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Logout error",
        description: "An unexpected error occurred during logout",
        variant: "destructive",
      });
    }
  };

  if (user) {
    // Get user initials for avatar fallback
    const getUserInitials = () => {
      if (user.user_metadata?.full_name) {
        return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
      }
      if (user.email) {
        return user.email[0].toUpperCase();
      }
      return 'U';
    };

    const getUserName = () => {
      return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserName()} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getUserName()}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/editor" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>Sign in with</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleOAuthLogin('google')}
          disabled={isSubmitting === 'google'}
          className="flex items-center"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isSubmitting === 'google' ? 'Signing in...' : 'Google'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleOAuthLogin('github')}
          disabled={isSubmitting === 'github'}
          className="flex items-center"
        >
          <Github className="mr-2 h-4 w-4" />
          {isSubmitting === 'github' ? 'Signing in...' : 'GitHub'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
