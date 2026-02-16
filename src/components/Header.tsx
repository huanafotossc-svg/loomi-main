import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { cn } from '../utils/helpers';
import { Avatar } from './Avatar';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  avatar?: { src?: string; name: string };
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  className?: string;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  avatar,
  showNotification = false,
  notificationCount = 0,
  onNotificationClick,
  className,
  transparent = false,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 px-4 py-4',
        transparent ? 'bg-transparent' : 'bg-linen/95 backdrop-blur-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showBack && (
            <motion.button
              onClick={handleBack}
              className="p-2 -ml-2 text-ink hover:bg-warm-gray-100 rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          )}

          {avatar && (
            <Avatar src={avatar.src} name={avatar.name} size="md" />
          )}

          {(title || subtitle) && (
            <div>
              {title && (
                <h1 className="font-semibold text-ink text-lg">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-warm-gray-500">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showNotification && (
            <motion.button
              onClick={onNotificationClick}
              className="relative p-2 text-ink hover:bg-warm-gray-100 rounded-full transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-coral text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </motion.button>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  );
}

// Home Header (for feed/dashboard)
interface HomeHeaderProps {
  greeting: string;
  location?: string;
  avatar?: { src?: string; name: string };
  notificationCount?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

export function HomeHeader({
  greeting,
  location,
  avatar,
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  className,
}: HomeHeaderProps) {
  return (
    <header className={cn('px-4 py-4', className)}>
      <div className="flex items-center justify-between">
        {/* Left - Greeting */}
        <div>
          <p className="text-sm text-warm-gray-500">{greeting}</p>
          {location && (
            <div className="flex items-center gap-1 text-ink">
              <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{location}</span>
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onNotificationClick}
            className="relative p-2.5 text-ink hover:bg-warm-gray-100 rounded-full transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-coral text-white text-xs font-medium rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </motion.button>

          {avatar && (
            <motion.button
              onClick={onProfileClick}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar src={avatar.src} name={avatar.name} size="md" showStatus status="online" />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}

// Search Header
interface SearchHeaderProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onBack?: () => void;
  className?: string;
}

export function SearchHeader({
  value,
  onChange,
  placeholder = 'Buscar...',
  onBack,
  className,
}: SearchHeaderProps) {
  return (
    <header className={cn('px-4 py-4', className)}>
      <div className="flex items-center gap-3">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="p-2 -ml-2 text-ink hover:bg-warm-gray-100 rounded-full transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        )}

        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-stone/10 rounded-2xl text-ink',
              'placeholder:text-stone/40',
              'focus:outline-none focus:border-forest/20 focus:ring-2 focus:ring-forest/5'
            )}
            autoFocus
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-warm-gray-400 hover:text-ink"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
