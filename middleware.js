import { NextResponse } from 'next/server';

export function middleware(req) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const credentials = atob(authValue);
      const [user, pwd] = credentials.split(':');

      if (user === 'todo' && pwd === 'password123') {
        const response = NextResponse.next();
        response.headers.set('X-Middleware-Test', 'Passed');
        return response;
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
      'X-Middleware-Test': 'Auth-Required',
    },
  });
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
