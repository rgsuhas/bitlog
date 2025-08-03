'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.profile?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [website, setWebsite] = useState(user?.profile?.website || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, error } = await updateProfile({ name, bio, website });

    if (success) {
      toast({ title: 'Profile updated successfully' });
    } else {
      toast({ title: 'Error updating profile', description: error, variant: 'destructive' });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
