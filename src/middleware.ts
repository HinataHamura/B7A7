import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/register', '/about', '/services', '/contact', '/pricing', '/payment/success', '/payment/cancel'];
const roleRedirects = {
  ADMIN: '/admin',
  LANDLORD: '/provider',
  TENANT: '/dashboard',
} as const;

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

  const requiredRole = pathname.startsWith('/admin')
    ? 'ADMIN'
    : pathname.startsWith('/provider')
      ? 'LANDLORD'
      : pathname.startsWith('/dashboard')
        ? 'TENANT'
        : null;
  if (!requiredRole) return NextResponse.next();

  const rawSession = request.cookies.get('roomly_session')?.value;
  if (!rawSession) return redirectToLogin(request);

  try {
    const session = JSON.parse(decodeURIComponent(rawSession)) as { role?: unknown };
    const role = session.role;
    if (role !== 'ADMIN' && role !== 'LANDLORD' && role !== 'TENANT') {
      return redirectToLogin(request);
    }
    if (role !== requiredRole) {
      return NextResponse.redirect(new URL(roleRedirects[role], request.url));
    }
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
