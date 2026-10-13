import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageCircle, User, Briefcase, BarChart3, Plus } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { UserRole } from '../types';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface BottomNavProps {
  role: UserRole;
}

const creatorNavItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/feed' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const hotelNavItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: Briefcase, label: 'Vagas', path: '/jobs' },
  { icon: MessageCircle, label: 'Chat', path: '/hotel-chat' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
];

export function BottomNav({ role }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = role === 'creator' ? creatorNavItems : hotelNavItems;

  const isActive = (path: string) => {
    if (path === '/feed' || path === '/dashboard') {
      return location.pathname === path || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-linen/90 backdrop-blur-lg border-t border-stone/5 px-2 py-2 pb-[env(safe-area-inset-bottom,12px)] shadow-floating">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <motion.button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 min-w-[72px]',
                    active
                      ? 'text-forest'
                      : 'text-stone/40 hover:text-stone/60'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-6 h-6 transition-all duration-300',
                        active && 'stroke-[2px]'
                      )}
                      strokeWidth={active ? 2 : 1.5}
                    />
                    {/* Active indicator dot */}
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-terracotta rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span className={cn(
                    'text-[10px] font-medium transition-colors mt-0.5 tracking-wide',
                    active ? 'text-forest' : 'text-stone/40'
                  )}>
                    {item.label}
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// Floating Action Button for hotels
interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({ onClick, icon, label }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-coral text-white rounded-full shadow-lg hover:bg-opacity-90 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon || <Plus className="w-5 h-5" />}
      {label && <span className="font-medium text-sm">{label}</span>}
    </motion.button>
  );
}
