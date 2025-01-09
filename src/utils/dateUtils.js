import { format, startOfMonth, endOfMonth } from 'date-fns';

export function formatDate(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function getMonthRange(date) {
  const start = startOfMonth(new Date(date));
  const end = endOfMonth(new Date(date));
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}