'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      window.location.href = `/login?error=${encodeURIComponent(errorDescription || error)}`;
      return;
    }
    
    if (code) {
      console.log('Processing OAuth code...');
      
      // Redirect to the API callback route to process the code
      const callbackUrl = `/api/auth/callback?code=${encodeURIComponent(code)}`;
      window.location.href = callbackUrl;
    } else {
      console.error('No OAuth code found');
      window.location.href = '/login?error=No authorization code received';
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
} 