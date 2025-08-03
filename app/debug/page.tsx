'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DebugPage() {
  const { user, profile, session, loading, isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Loading:</span>
              <Badge variant={loading ? "destructive" : "default"}>
                {loading ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Authenticated:</span>
              <Badge variant={isAuthenticated ? "default" : "secondary"}>
                {isAuthenticated ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Has Session:</span>
              <Badge variant={session ? "default" : "secondary"}>
                {session ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Has User:</span>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Has Profile:</span>
              <Badge variant={profile ? "default" : "secondary"}>
                {profile ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="text-sm text-muted-foreground break-all">{user.id}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <span className="font-medium">Created At:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No user data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <>
                <div>
                  <span className="font-medium">User ID:</span>
                  <p className="text-sm text-muted-foreground">{profile.id}</p>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <Badge variant="outline">{profile.role}</Badge>
                </div>
                <div>
                  <span className="font-medium">User Email:</span>
                  <p className="text-sm text-muted-foreground">{profile.user.email}</p>
                </div>
                <div>
                  <span className="font-medium">User Name:</span>
                  <p className="text-sm text-muted-foreground">
                    {profile.user.user_metadata?.full_name || 
                     profile.user.user_metadata?.name || 
                     profile.user.email?.split('@')[0] || 
                     'Not set'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Account Created:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.user.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No profile data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session ? (
              <>
                <div>
                  <span className="font-medium">Access Token:</span>
                  <p className="text-sm text-muted-foreground break-all">
                    {session.access_token.substring(0, 20)}...
                  </p>
                </div>
                <div>
                  <span className="font-medium">Refresh Token:</span>
                  <p className="text-sm text-muted-foreground break-all">
                    {session.refresh_token.substring(0, 20)}...
                  </p>
                </div>
                <div>
                  <span className="font-medium">Expires At:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.expires_at! * 1000).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No session data</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                <p className="text-sm text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
                </p>
              </div>
              <div>
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <p className="text-sm text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">OAuth Testing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Google OAuth Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ provider: 'google' })
                    });
                    const data = await response.json();
                    if (data.success) {
                      window.open(data.url, '_blank');
                    } else {
                      alert('Google OAuth failed: ' + data.error);
                    }
                  } catch (error) {
                    alert('Google OAuth error: ' + error);
                  }
                }}
                className="w-full"
              >
                Test Google OAuth
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GitHub OAuth Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ provider: 'github' })
                    });
                    const data = await response.json();
                    if (data.success) {
                      window.open(data.url, '_blank');
                    } else {
                      alert('GitHub OAuth failed: ' + data.error);
                    }
                  } catch (error) {
                    alert('GitHub OAuth error: ' + error);
                  }
                }}
                className="w-full"
              >
                Test GitHub OAuth
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OAuth Callback Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  const testUrl = '/api/auth/callback?code=test_code&error=test_error';
                  window.open(testUrl, '_blank');
                }}
                variant="outline"
                className="w-full"
              >
                Test Error Callback
              </Button>
              <Button 
                onClick={() => {
                  const testUrl = '/api/auth/callback?code=test_code';
                  window.open(testUrl, '_blank');
                }}
                variant="outline"
                className="w-full"
              >
                Test Code Callback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 