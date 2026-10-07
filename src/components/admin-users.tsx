'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard-shell';
import { adminApi, type AdminUser } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function AdminUsers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const search = searchParams.get('search') ?? '';
  const role = searchParams.get('role') ?? '';
  const query = useQuery({ queryKey: ['admin-users'], queryFn: adminApi.getUsers });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminUser['status'] }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: async () => {
      toast.success('User status updated.');
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update user status.'),
  });

  const visibleUsers = useMemo(
    () =>
      (query.data ?? []).filter((user) => {
        const name = user.landlordProfile?.name ?? user.tenantProfile?.name ?? '';
        const matchesSearch = `${name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && (!role || user.role === role);
      }),
    [query.data, role, search],
  );

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  return (
    <DashboardShell title="Manage users" role="admin">
      <div className="mb-8">
        <p className="pill">Administration</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">User management</h1>
        <p className="mt-2 text-slate-600">Accounts and status are loaded from the protected admin API.</p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          aria-label="Search users"
          value={search}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Search by name or email"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500"
        />
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(event) => updateFilter('role', event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="LANDLORD">Landlord</option>
          <option value="TENANT">Tenant</option>
        </select>
      </div>

      {query.isError && <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{query.error.message}</div>}
      <div className="glass-panel overflow-x-auto">
        {query.isLoading ? (
          <div className="space-y-3 p-5" aria-label="Loading users">
            {[0, 1, 2, 3].map((row) => <div key={row} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          </div>
        ) : visibleUsers.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No users match these filters.</p>
        ) : (
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => {
                const name = user.landlordProfile?.name ?? user.tenantProfile?.name ?? user.email;
                const canManage = user.role !== 'ADMIN' && user.status !== 'DELETED';
                return (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">{user.role}</td>
                    <td className="px-5 py-4">{user.status}</td>
                    <td className="px-5 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => mutation.mutate({ id: user.id, status: user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' })}
                            disabled={mutation.isPending}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                          >
                            {user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                          </button>
                        )}
                        {user.role === 'LANDLORD' && user.landlordProfile?.id && !user.landlordProfile.isVerifiedHost && (
                          <button
                            type="button"
                            onClick={() => adminApi.verifyLandlord(user.landlordProfile!.id!).then(async () => {
                              toast.success('Landlord verified.');
                              await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
                            }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : 'Could not verify landlord.'))}
                            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Verify landlord
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">{visibleUsers.length} matching accounts</p>
    </DashboardShell>
  );
}
