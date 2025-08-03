'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostList } from '@/components/dashboard/PostList';
import { CommentList } from '@/components/dashboard/CommentList';
import { RoleManager } from '@/components/dashboard/RoleManager';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Author Dashboard</h1>
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          {user?.role === 'admin' && <TabsTrigger value="roles">Roles</TabsTrigger>}
        </TabsList>
        <TabsContent value="posts">
          <PostList />
        </TabsContent>
        <TabsContent value="comments">
          <CommentList />
        </TabsContent>
        {user?.role === 'admin' && (
          <TabsContent value="roles">
            <RoleManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
