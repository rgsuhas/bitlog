import { getAllComments } from '@/lib/comments';
import { NextResponse } from 'next/server';

export async function GET() {
  const comments = await getAllComments();
  return NextResponse.json(comments);
}
