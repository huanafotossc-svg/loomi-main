import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { JobType, ApplicationStatus, EquipmentTag, StyleTag } from '../types';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return d.toLocaleDateString('pt-BR', options || defaultOptions);
}

// Format short date
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} d`;
  return formatShortDate(d);
}

// Format number
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

// Get job type label
export function getJobTypeLabel(type: JobType): string {
  const labels: Record<JobType, string> = {
    permuta: 'Permuta',
    cache: 'Cachê',
    hibrido: 'Híbrido',
  };
  return labels[type];
}

// Get job type color
export function getJobTypeColor(type: JobType): string {
  const colors: Record<JobType, string> = {
    permuta: 'bg-green-100 text-green-700',
    cache: 'bg-blue-100 text-blue-700',
    hibrido: 'bg-purple-100 text-purple-700',
  };
  return colors[type];
}

// Get job type dot color
export function getJobTypeDotColor(type: JobType): string {
  const colors: Record<JobType, string> = {
    permuta: 'bg-green-500',
    cache: 'bg-blue-500',
    hibrido: 'bg-purple-500',
  };
  return colors[type];
}

// Get application status label
export function getApplicationStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    sent: 'Enviado',
    under_review: 'Em análise',
    accepted: 'Aceito',
    rejected: 'Recusado',
    delivered: 'Entregue',
    approved: 'Aprovado',
  };
  return labels[status];
}

// Get application status color
export function getApplicationStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    sent: 'bg-gray-100 text-gray-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    delivered: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
  };
  return colors[status];
}

// Get equipment tag label
export function getEquipmentLabel(tag: EquipmentTag): string {
  const labels: Record<EquipmentTag, string> = {
    drone: 'Drone',
    '4k': '4K',
    gimbal: 'Gimbal',
    lighting: 'Iluminação',
    underwater: 'Subaquática',
    '360': '360°',
    dslr: 'DSLR',
  };
  return labels[tag];
}

// Get style tag label
export function getStyleLabel(tag: StyleTag): string {
  const labels: Record<StyleTag, string> = {
    hotelaria: 'Hotelaria',
    lifestyle: 'Lifestyle',
    arquitetura: 'Arquitetura',
    gastronomia: 'Gastronomia',
    natureza: 'Natureza',
    aereo: 'Aéreo',
  };
  return labels[tag];
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check for contact info in message (for chat blocking)
export function containsContactInfo(text: string): boolean {
  // Phone regex (Brazilian format)
  const phoneRegex = /\(\d{2}\)\s?\d{4,5}-?\d{4}|\d{2}\s?\d{4,5}-?\d{4}|\d{11,12}/;
  // Email regex
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  // URL regex
  const urlRegex = /(https?:\/\/)?(www\.)?[^\s]+\.[a-z]{2,}[^\s]*/i;
  // WhatsApp link
  const whatsappRegex = /wa\.me|whatsapp\.com/i;

  return phoneRegex.test(text) || emailRegex.test(text) || urlRegex.test(text) || whatsappRegex.test(text);
}

// Get contact block message
export function getContactBlockMessage(): string {
  return '⚠️ Não é permitido compartilhar telefone, email ou links antes do aceite da proposta.';
}

// Generate random ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
    }
  },
};

// Card hover animation
export const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

// Image zoom animation
export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.4 } },
};

// Bottom nav item animation
export const navItemAnimation = {
  rest: { scale: 1 },
  tap: { scale: 0.9 },
};
