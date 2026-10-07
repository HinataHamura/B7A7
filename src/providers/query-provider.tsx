"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clearSessionCookie } from '@/lib/auth';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const router = useRouter();

  useEffect(() => {
    const handleExpiredSession = () => {
      clearSessionCookie();
      client.clear();
      toast.error('Your session expired. Please sign in again.');
      router.replace('/login');
    };
    window.addEventListener('roomly:auth-expired', handleExpiredSession);
    return () => window.removeEventListener('roomly:auth-expired', handleExpiredSession);
  }, [client, router]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
