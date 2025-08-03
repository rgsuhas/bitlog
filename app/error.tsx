'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          Something went wrong!
        </h1>
        
        <p className="mb-6 text-muted-foreground">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {error.message}
              {error.stack && (
                <>
                  {'\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/">
              Go Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 