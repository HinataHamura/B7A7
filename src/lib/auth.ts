export type UserRole = 'ADMIN' | 'LANDLORD' | 'TENANT';

export const AUTH_COOKIE_NAME = 'roomly_session';
export const AUTH_STORAGE_KEY = 'roomly_user';

export interface SessionData {
  role: UserRole;
  email?: string;
}

export function getSessionCookie(): SessionData | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!cookie) {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as SessionData;
    } catch {
      return null;
    }
  }

  try {
    const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
    return JSON.parse(value) as SessionData;
  } catch {
    return null;
  }
}

export function setSessionCookie(role: UserRole, email: string) {
  const session: SessionData = { role, email };
  const serialized = JSON.stringify(session);

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
}

export function clearSessionCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function getRoleDashboard(role: UserRole) {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'LANDLORD':
      return '/provider';
    case 'TENANT':
    default:
      return '/dashboard';
  }
}
