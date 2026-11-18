
import { NextRequest, NextResponse } from 'next/server';

import { resolveAuthenticatedSession } from '@/shared/lib/server-auth';

export async function GET(request: NextRequest) {
  const authentication = await resolveAuthenticatedSession(request);

  if (!authentication.authenticated) {
    const response = NextResponse.json(
      {
        user: null,
      },
      {
        status: authentication.status,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );

    if (
      authentication.status === 401 ||
      authentication.status === 403
    ) {
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
    }

    return response;
  }

  return NextResponse.json(
    {
      user: authentication.data.user,
      mustChangeCredentials:
        authentication.data.mustChangeCredentials,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
