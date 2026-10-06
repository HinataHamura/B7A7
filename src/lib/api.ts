export type UserRole = 'ADMIN' | 'LANDLORD' | 'TENANT';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://b7a6.onrender.com/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export interface ListingItem {
  id: string;
  title?: string;
  city?: string;
  area?: string;
  rentAmount?: number | string;
  bedrooms?: number;
  status?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  landlord?: {
    name?: string;
    profilePhoto?: string;
    isVerifiedHost?: boolean;
  };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const finalOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${path}`, finalOptions);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Request failed';
    throw new Error(message);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return (payload as T) ?? ({} as T);
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: { name: string; email: string; password: string; role: 'TENANT' | 'LANDLORD' }) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const listingsApi = {
  getAll: async (params: Record<string, string> = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });

    const queryString = search.toString();
    const path = queryString ? `/listings?${queryString}` : '/listings';
    return apiFetch<ListingItem[]>(path, { method: 'GET' });
  },
};
