import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/about', '/services', '/contact', '/pricing', '/payment/success', '/payment/cancel'];
const roleRedirects = {
  ADMIN: '/admin',
  LANDLORD: '/provider',
  TENANT: '/dashboard',
} as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((route) => route === pathname || pathname.startsWith('/_next') || pathname.startsWith('/favicon'))) {
    return NextResponse.next();
  }

  const rawSession = request.cookies.get('roomly_session')?.value;

  if (!rawSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(decodeURIComponent(rawSession));
    const requiredRole = pathname.startsWith('/admin') ? 'ADMIN' : pathname.startsWith('/provider') ? 'LANDLORD' : pathname.startsWith('/dashboard') ? 'TENANT' : null;

    if (!requiredRole) {
      return NextResponse.next();
    }

    if (session.role !== requiredRole) {
      const destination = roleRedirects[session.role as keyof typeof roleRedirects] || '/login';
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
