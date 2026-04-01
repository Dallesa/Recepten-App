import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'camping-secret-key');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  const isPublicRoute =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/public') ||
    path.startsWith('/api/auth/login');


  const isApiRoute = path.startsWith('/api');
  if (isApiRoute) return NextResponse.next();

  // 🔓 Publieke route → geen redirect
  if (isPublicRoute) {
    if (!token) return NextResponse.next();

    // Als je ingelogd bent → weg van login
    try {
      await jwtVerify(token, SECRET);
      if (path.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Token invalid → laat login zien
    }

    return NextResponse.next();
  }

  // 🔒 Beschermde routes → check token
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      /* invalid token */
    }
  }

  // Niet ingelogd → redirect naar login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
