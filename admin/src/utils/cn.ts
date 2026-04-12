import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M MAD`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K MAD`;
  return `${amount.toLocaleString('fr-MA')} MAD`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('fr-MA');
}

export function getChangeColor(type: 'increase' | 'decrease'): string {
  return type === 'increase' ? 'text-green-600' : 'text-red-600';
}
