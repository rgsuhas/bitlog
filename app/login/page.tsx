'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
