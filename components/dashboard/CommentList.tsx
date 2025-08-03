'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/lib/types';

export function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch('/api/comments');
      const allComments = await response.json();
      setComments(allComments);
      setLoading(false);
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded-lg">
          <p>{comment.content}</p>
          <p className="text-sm text-gray-500">By {comment.author_id} on post {comment.post_id}</p>
        </div>
      ))}
    </div>
  );
}