import { cn, getInitials } from '../utils/helpers';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away';
}

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  showStatus = false,
  status = 'offline'
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-warm-gray-400',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover bg-warm-gray-200',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-coral/15 text-coral flex items-center justify-center font-medium',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}

// Avatar Group
interface AvatarGroupProps {
  avatars: { src?: string; name: string }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  className
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const spacing = {
    xs: '-space-x-1',
    sm: '-space-x-2',
    md: '-space-x-3',
    lg: '-space-x-4',
  };

  return (
    <div className={cn('flex items-center', spacing[size], className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-warm-gray-200 text-warm-gray-600 flex items-center justify-center font-medium border-2 border-white',
            size === 'xs' && 'w-6 h-6 text-xs',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
            size === 'lg' && 'w-14 h-14 text-base',
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
