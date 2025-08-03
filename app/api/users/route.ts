import { getAllUsers, updateUserRole } from '@/lib/users';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { userId, role } = await request.json();
  const result = await updateUserRole(userId, role);
  return NextResponse.json(result);
}
