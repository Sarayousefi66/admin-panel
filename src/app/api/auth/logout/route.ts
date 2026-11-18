
import { NextRequest, NextResponse } from 'next/server';

import { deleteAuthSessionsByToken } from '@/shared/lib/auth-session';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      await deleteAuthSessionsByToken(token);
    } catch {
      // The browser cookie must still be cleared.
    }
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
