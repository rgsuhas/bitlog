'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export function RoleManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const allUsers = await response.json();
      setUsers(allUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, role }),
    });

    const { success, error } = await response.json();

    if (success) {
      toast({ title: 'Role updated successfully' });
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role } : user
      );
      setUsers(updatedUsers);
    } else {
      toast({ title: 'Error updating role', description: error, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reader">Reader</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}