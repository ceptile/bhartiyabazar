export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + ' Cr';
  if (n >= 100000) return (n / 100000).toFixed(1) + ' L';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function getStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
}

export function timeAgo(date: string): string {
  return date;
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text;
}

export function getInitials(name: string): string {
  return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();
}
