import { BadgeCheck } from 'lucide-react';
import { cn } from '../utils/helpers';

interface PremiumBadgeProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function PremiumBadge({ className, size = 'md', showLabel = true }: PremiumBadgeProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <div className="relative">
                <div className="absolute inset-0 bg-coral blur-[2px] opacity-30 rounded-full" />
                <BadgeCheck className={cn('text-coral relative z-10', sizeClasses[size])} strokeWidth={2.5} />
            </div>
            {showLabel && (
                <span className={cn(
                    'font-semibold text-coral',
                    size === 'sm' && 'text-xs',
                    size === 'md' && 'text-sm',
                    size === 'lg' && 'text-base',
                )}>
                    Premium
                </span>
            )}
        </div>
    );
}
