import { cn } from '../utils/helpers';
import type { JobType, ApplicationStatus } from '../types';
import { getJobTypeLabel, getApplicationStatusLabel, getApplicationStatusColor } from '../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className
}: BadgeProps) {
  const variants = {
    default: 'bg-warm-gray-100 text-stone',
    primary: 'bg-forest/10 text-forest',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full tracking-wide',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

// Job Type Badge — editorial minimal
interface JobTypeBadgeProps {
  type: JobType;
  size?: 'sm' | 'md';
  className?: string;
}

export function JobTypeBadge({ type, size = 'sm', className }: JobTypeBadgeProps) {
  const dotColors = {
    permuta: 'bg-green-400',
    cache: 'bg-blue-400',
    hibrido: 'bg-purple-400',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide',
      'bg-white/80 backdrop-blur-sm text-stone shadow-soft',
      size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full opacity-70', dotColors[type])} />
      {getJobTypeLabel(type)}
    </span>
  );
}

// Application Status Badge
interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function ApplicationStatusBadge({ status, size = 'sm', className }: ApplicationStatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full tracking-wide',
      getApplicationStatusColor(status),
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
      className
    )}>
      {getApplicationStatusLabel(status)}
    </span>
  );
}

// Equipment Tag
interface EquipmentTagProps {
  tag: string;
  className?: string;
}

export function EquipmentTag({ tag, className }: EquipmentTagProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 text-xs font-light tracking-wide',
      'bg-linen text-stone/60 rounded-lg',
      className
    )}>
      {tag}
    </span>
  );
}

// Style Tag
interface StyleTagProps {
  tag: string;
  className?: string;
}

export function StyleTag({ tag, className }: StyleTagProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 text-xs font-light tracking-wide',
      'bg-forest/8 text-forest rounded-lg',
      className
    )}>
      {tag}
    </span>
  );
}

// Rating Badge — capsule, editorial
interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function RatingBadge({ rating, reviewCount, size = 'sm', className }: RatingBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium',
      'bg-white/85 backdrop-blur-sm text-ink shadow-soft',
      size === 'sm' ? 'px-2 py-1 text-[11px] rounded-full' : 'px-3 py-1.5 text-xs rounded-full',
      className
    )}>
      <svg className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="currentColor" viewBox="0 0 20 20">
        <path className="text-amber-500" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating.toFixed(1)}
      {reviewCount !== undefined && (
        <span className="text-stone/40">({reviewCount})</span>
      )}
    </span>
  );
}
