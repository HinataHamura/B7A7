export function formatCurrency(amount: number | string | null | undefined) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(date);
}
