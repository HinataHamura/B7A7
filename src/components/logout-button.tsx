'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { clearSessionCookie } from '@/lib/auth';

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    clearSessionCookie();
    try {
      await authApi.logout();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not contact the Roomly API.');
    } finally {
      router.replace('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
    >
      <LogOut size={16} />
      {isLoggingOut ? 'Signing out…' : 'Logout'}
    </button>
  );
}
