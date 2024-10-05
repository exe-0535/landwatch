import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const accessToken = request.cookies.get('access');
  const refreshToken = request.cookies.get('refresh');

  if (accessToken && refreshToken) {
    if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
      return NextResponse.rewrite(new URL('/', request.url));
    }
  } else {
    const routes = ['/', 'data'];
    if (routes.includes(url.pathname)) {
      {
        return NextResponse.rewrite(new URL('/sign-in', request.url));
      }
    }
  }
};
