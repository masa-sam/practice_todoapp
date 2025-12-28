import { NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*',
};

export function middleware(req) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Edge Runtimeではatobの代わりにBufferを使用
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    if (user === 'todo' && pwd === 'password123') {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
