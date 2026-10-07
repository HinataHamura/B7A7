import { setAccessToken } from '@/lib/auth';

export type UserRole = 'ADMIN' | 'LANDLORD' | 'TENANT';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://b7a6.onrender.com/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status?: string;
  landlordProfile?: Profile;
  tenantProfile?: Profile;
}

export interface Profile {
  id?: string;
  name?: string;
  phone?: string | null;
  profilePhoto?: string | null;
  bio?: string | null;
  occupation?: string | null;
  budgetMin?: number | string | null;
  budgetMax?: number | string | null;
  preferredAreas?: string[];
  isVerifiedHost?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResult<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ListingItem {
  id: string;
  title: string;
  type?: string;
  city: string;
  area: string;
  addressLine?: string;
  rentAmount: number | string;
  securityDeposit?: number | string;
  bedrooms: number;
  bathrooms?: number;
  maxOccupants?: number;
  status: string;
  description: string;
  images?: string[];
  amenities?: string[];
  genderPreference?: string | null;
  latitude?: number;
  longitude?: number;
  landlord?: Profile;
  createdAt?: string;
}

export interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  moveInDate: string;
  message?: string | null;
  createdAt: string;
  listing: ListingItem;
  payments?: Payment[];
  tenant?: Profile;
}

export interface Payment {
  id: string;
  transactionId: string;
  purpose: 'BOOKING_ADVANCE' | 'SECURITY_DEPOSIT';
  amount: number | string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paidAt?: string | null;
  createdAt: string;
  booking: {
    id: string;
    listing: ListingItem;
    tenant?: Profile;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalListings: number;
  publishedListings: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number | string;
  totalReviews: number;
}

export interface LandlordStats {
  totalListings: number;
  publishedListings: number;
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  totalRevenue: number | string;
  averageRating: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  provider: string;
  createdAt: string;
  landlordProfile?: Profile | null;
  tenantProfile?: Profile | null;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  actor?: { email?: string; role?: UserRole };
  metadata?: Record<string, unknown> | null;
}

export interface PaymentSession {
  paymentUrl: string;
  transactionId: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseApiMeta(value: unknown): ApiMeta | undefined {
  if (!isRecord(value)) return undefined;
  const { page, limit, total, totalPages } = value;
  if (
    typeof page !== 'number' ||
    typeof limit !== 'number' ||
    typeof total !== 'number' ||
    typeof totalPages !== 'number'
  ) {
    return undefined;
  }
  return { page, limit, total, totalPages };
}

let refreshRequest: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (typeof window === 'undefined') return null;
  if (!refreshRequest) {
    refreshRequest = (async () => {
      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
      } catch {
        return null;
      }

      if (!response.ok) return null;
      const payload: unknown = await response.json().catch(() => null);
      const data = isRecord(payload) && 'data' in payload ? payload.data : payload;
      const token = isRecord(data) && typeof data.accessToken === 'string' ? data.accessToken : null;
      if (token) setAccessToken(token);
      return token;
    })();
  }

  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retryUnauthorized = true,
): Promise<ApiResult<T>> {
  const accessToken =
    typeof window === 'undefined' ? null : localStorage.getItem('roomly_access_token');
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401 && retryUnauthorized && !path.startsWith('/auth/refresh-token')) {
    const freshToken = await refreshAccessToken();
    if (freshToken) return apiRequest<T>(path, options, false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('roomly:auth-expired'));
    }
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isRecord(payload)
      ? String(payload.message ?? payload.error ?? 'Request failed')
      : 'Request failed';
    throw new Error(message);
  }

  if (isRecord(payload) && 'data' in payload) {
    const meta = parseApiMeta(payload.meta);
    return { data: payload.data as T, meta };
  }

  return { data: payload as T };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return (await apiRequest<T>(path, options)).data;
}

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && String(value).length > 0) search.set(key, String(value));
  });
  return search.toString();
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: 'TENANT' | 'LANDLORD';
  }) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => apiFetch<AuthUser>('/auth/me'),
  logout: () => apiFetch<null>('/auth/logout', { method: 'POST' }),
};

export const listingsApi = {
  getAll: (params: Record<string, string | number | undefined> = {}) =>
    apiRequest<ListingItem[]>(`/listings?${queryString(params)}`),
  getById: (id: string) => apiFetch<ListingItem>(`/listings/${id}`),
  getMine: () => apiFetch<ListingItem[]>('/listings/my-listings'),
  getLandlordStats: () => apiFetch<LandlordStats>('/listings/dashboard-stats'),
  create: (payload: ListingPayload) =>
    apiFetch<ListingItem>('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ListingPayload> & { status?: string }) =>
    apiFetch<ListingItem>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    apiFetch<null>(`/listings/${id}`, {
      method: 'DELETE',
    }),
  toggleSaved: (id: string) =>
    apiFetch<{ saved: boolean }>(`/listings/${id}/save`, {
      method: 'POST',
    }),
};

export interface ListingPayload {
  title: string;
  description: string;
  type: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  rentAmount: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  addressLine: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  images: string[];
  genderPreference?: 'MALE' | 'FEMALE' | 'ANY';
  status?: 'DRAFT' | 'PUBLISHED' | 'UNAVAILABLE' | 'ARCHIVED';
}

export const uploadsApi = {
  uploadListingImages: async (files: File[]) => {
    const body = new FormData();
    files.forEach((file) => body.append('images', file));
    return apiFetch<string[]>('/upload/images?folder=listings', {
      method: 'POST',
      body,
    });
  },
};

export const bookingsApi = {
  getMine: () => apiFetch<Booking[]>('/bookings/my-bookings'),
  getLandlordBookings: () => apiFetch<Booking[]>('/bookings/landlord-bookings'),
  create: (payload: { listingId: string; moveInDate: string; message?: string }) =>
    apiFetch<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateStatus: (
    bookingId: string,
    status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED',
  ) =>
    apiFetch<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const paymentsApi = {
  getHistory: (page = 1, limit = 20) =>
    apiRequest<Payment[]>(`/payments/history?${queryString({ page, limit })}`),
  initiate: (payload: {
    bookingId: string;
    purpose: 'BOOKING_ADVANCE' | 'SECURITY_DEPOSIT';
  }) =>
    apiFetch<PaymentSession>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  getStats: () => apiFetch<AdminStats>('/admin/stats'),
  getUsers: () => apiFetch<AdminUser[]>('/admin/users'),
  updateUserStatus: (id: string, status: AdminUser['status']) =>
    apiFetch<AdminUser>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  verifyLandlord: (profileId: string) =>
    apiFetch<Profile>(`/admin/landlords/${profileId}/verify`, { method: 'PATCH' }),
  getAuditLogs: (page = 1, limit = 20) =>
    apiRequest<AuditLog[]>(`/admin/audit-logs?${queryString({ page, limit })}`),
};

export const usersApi = {
  updateProfile: (payload: Partial<Profile>) =>
    apiFetch<Profile>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
