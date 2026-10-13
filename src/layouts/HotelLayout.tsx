import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  Home,
  Briefcase,
  MessageCircle,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  Plus
} from 'lucide-react';
import { TopNav } from '../components/TopNav';
import { BottomNav, FloatingActionButton } from '../components';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

// Sidebar for desktop
function HotelSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Vagas', path: '/jobs' },
    { icon: MessageCircle, label: 'Chat', path: '/hotel-chat' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Equipe', path: '/team' },
    { icon: CreditCard, label: 'Faturamento', path: '/billing' },
    { icon: Settings, label: 'Configurações', path: '/hotel-settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-warm-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="font-bold text-xl text-ink">Loomi</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    active
                      ? 'bg-coral/10 text-coral font-medium'
                      : 'text-warm-gray-600 hover:bg-warm-gray-100 hover:text-ink'
                  )}
                >
                  <Icon className={cn('w-5 h-5', active && 'stroke-[2.5px]')} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Create Job Button */}
      <div className="p-4">
        <button
          onClick={() => navigate('/create-job')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Vaga
        </button>
      </div>
    </aside>
  );
}

export function HotelLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-warm-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-porcelain flex-col lg:flex-row">
      {/* Menu Superior no Mobile */}
      <div className="lg:hidden">
        <TopNav role="hotel" />
      </div>

      <HotelSidebar />

      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full max-w-7xl">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden">
          <BottomNav role="hotel" />
        </div>

        {/* Mobile FAB */}
        <div className="lg:hidden">
          <FloatingActionButton
            onClick={() => navigate('/create-job')}
            icon={<Plus className="w-5 h-5" />}
            label="Nova Vaga"
          />
        </div>
      </div>
    </div>
  );
}
