'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi } from '@/lib/api';

export function NotificationInbox() {
  const queryClient = useQueryClient();
  const notificationQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getMine,
  });
  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update this notification.'),
  });
  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read.');
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not update notifications.'),
  });
  const notifications = notificationQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <section className="glass-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Inbox</h2>
          <p className="text-sm text-slate-500">
            {unreadCount === 0 ? 'You are all caught up.' : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-700 disabled:opacity-60"
          >
            {markAllMutation.isPending ? 'Updating…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {notificationQuery.isError ? (
        <div role="alert" className="p-8 text-center">
          <h3 className="font-semibold text-slate-900">Notifications could not be loaded.</h3>
          <p className="mt-2 text-sm text-slate-600">
            {notificationQuery.error instanceof Error ? notificationQuery.error.message : 'Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => void notificationQuery.refetch()}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : notificationQuery.isLoading ? (
        <div className="space-y-3 p-5" aria-label="Loading notifications">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-10 text-center">
          <h3 className="font-semibold text-slate-900">No notifications yet.</h3>
          <p className="mt-1 text-sm text-slate-500">Updates about your Roomly activity will appear here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {notifications.map((notification) => {
            const date = new Date(notification.createdAt);
            const timestamp = Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();

            return (
              <li key={notification.id} className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between ${notification.isRead ? '' : 'bg-primary-50/50'}`}>
                <div className="flex gap-3">
                  <span
                    aria-label={notification.isRead ? 'Read' : 'Unread'}
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${notification.isRead ? 'bg-slate-300' : 'bg-primary'}`}
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                    <time dateTime={notification.createdAt} className="mt-2 block text-xs text-slate-500">{timestamp}</time>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => markReadMutation.mutate(notification.id)}
                    disabled={markReadMutation.isPending}
                    className="self-start rounded-full px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 disabled:opacity-60 sm:shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
