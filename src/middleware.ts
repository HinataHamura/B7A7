import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/auth';

const publicRoutes = ['/', '/login', '/register', '/about', '/services', '/contact', '/pricing', '/payment/success', '/payment/cancel'];
const roleRedirects = {
  ADMIN: '/admin',
  LANDLORD: '/provider',
  TENANT: '/dashboard',
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserRole(value: unknown): value is keyof typeof roleRedirects {
  return value === 'ADMIN' || value === 'LANDLORD' || value === 'TENANT';
}

function isPublicPath(pathname: string) {
  return publicRoutes.some(
    (route) => route === pathname || (route !== '/' && pathname.startsWith(`${route}/`)),
  ) || pathname.startsWith('/_next') || pathname.startsWith('/favicon');
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  if (!accessToken) return redirectToLogin(request);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'https://b7a6.onrender.com/api/v1'}/auth/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );
    if (!response.ok) return redirectToLogin(request);

    const payload: unknown = await response.json();
    const data = isRecord(payload) && 'data' in payload ? payload.data : payload;
    const role = isRecord(data) ? data.role : undefined;
    if (!isUserRole(role)) return redirectToLogin(request);

    const requiredRole = pathname.startsWith('/admin')
      ? 'ADMIN'
      : pathname.startsWith('/provider')
        ? 'LANDLORD'
        : pathname.startsWith('/dashboard')
          ? 'TENANT'
          : null;

    if (requiredRole && role !== requiredRole) {
      const destination = roleRedirects[role];
      return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
