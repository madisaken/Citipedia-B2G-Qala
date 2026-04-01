import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, lang: 'en' | 'ru') {
  return new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getQualityStatus(score: number, lang: 'en' | 'ru') {
  if (score >= 85) return lang === 'en' ? 'High' : 'Высокое';
  if (score >= 60) return lang === 'en' ? 'Medium' : 'Среднее';
  return lang === 'en' ? 'Low' : 'Низкое';
}

export function getFormatBadgeClass(format: string) {
  switch (format) {
    case 'SHP':
    case 'GeoJSON':
    case 'GeoTIFF':
    case 'PostGIS':
      return 'bg-purple-500/10 text-purple-500';
    case 'CSV':
    case 'Excel':
    case 'JSON':
      return 'bg-blue-500/10 text-blue-500';
    case 'API':
    case 'GTFS':
    case 'Stream':
      return 'bg-emerald-500/10 text-emerald-500';
    case 'PDF':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}
