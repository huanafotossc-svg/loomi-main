import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Search,
  Briefcase,
  Bookmark,
  MessageCircle,
  DollarSign,
  Camera,
  BarChart3,
  Users,
  CreditCard,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  RefreshCw,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { Avatar } from './Avatar';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../data/mock';
import { cn } from '../utils/helpers';
import type { UserRole } from '../types';

interface TopNavProps {
  role: UserRole;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const creatorNavItems: NavItem[] = [
  { icon: Home, label: 'Início', path: '/feed' },
  { icon: Search, label: 'Buscar', path: '/search' },
  { icon: Briefcase, label: 'Candidaturas', path: '/applications' },
  { icon: Bookmark, label: 'Salvos', path: '/saved' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: DollarSign, label: 'Ganhos', path: '/earnings' },
  { icon: Camera, label: 'Portfólio', path: '/portfolio' },
];

const hotelNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Vagas', path: '/jobs' },
  { icon: Users, label: 'Candidatos', path: '/applicants' },
  { icon: MessageCircle, label: 'Chat', path: '/hotel-chat' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'Equipe', path: '/team' },
  { icon: CreditCard, label: 'Faturamento', path: '/billing' },
];

export function TopNav({ role }: TopNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, selectRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = role === 'creator' ? creatorNavItems : hotelNavItems;

  // Unread notification count
  const unreadCount = mockNotifications.filter(
    (n) => n.userId === user?.id && !n.isRead
  ).length || 2;

  const isActive = (path: string) => {
    if (path === '/feed' || path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSwitchRole = () => {
    if (role === 'creator') {
      selectRole('hotel');
      navigate('/dashboard');
    } else {
      selectRole('creator');
      navigate('/feed');
    }
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      {/* Top Navbar Container */}
      <header className="sticky top-0 z-40 w-full bg-linen/95 backdrop-blur-md border-b border-stone/10 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Mobile Hamburger + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2.5 -ml-1 text-ink hover:text-forest hover:bg-black/5 active:bg-black/10 rounded-2xl transition-colors"
                aria-label="Abrir menu superior"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>

              {/* Logo / Brand */}
              <button
                onClick={() => navigate(role === 'creator' ? '/feed' : '/dashboard')}
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral to-terracotta flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-editorial font-bold text-xl leading-none">L</span>
                </div>
                <div className="text-left flex flex-col">
                  <span className="font-editorial text-2xl font-bold tracking-tight text-ink group-hover:text-forest transition-colors">
                    Loomi
                  </span>
                </div>
              </button>

              {/* Role Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-forest/10 text-forest border border-forest/15">
                <Sparkles className="w-3 h-3 text-terracotta" />
                {role === 'creator' ? 'Creator' : 'Hotel'}
              </span>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-forest text-white shadow-soft font-semibold'
                        : 'text-stone/70 hover:text-ink hover:bg-black/5'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', active ? 'stroke-[2.2px]' : 'stroke-[1.8px]')} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications Button */}
              <motion.button
                onClick={() => navigate('/notifications')}
                className="relative p-2.5 text-ink hover:bg-black/5 rounded-2xl transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5 text-stone stroke-[1.8]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-linen">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Desktop Profile Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl hover:bg-black/5 transition-colors border border-stone/10"
                >
                  <div className="text-right">
                    <p className="text-xs font-semibold text-ink leading-tight">
                      {user?.name?.split(' ')[0] || 'Usuário'}
                    </p>
                    <p className="text-[10px] text-stone/50 capitalize">
                      {role}
                    </p>
                  </div>
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                  <ChevronDown className="w-3.5 h-3.5 text-stone/60" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating border border-stone/10 py-2 z-40"
                      >
                        <div className="px-4 py-2 border-b border-stone/10">
                          <p className="text-sm font-semibold text-ink truncate">{user?.name || 'Usuário'}</p>
                          <p className="text-xs text-stone/50 truncate">{user?.email || ''}</p>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate(role === 'creator' ? '/profile' : '/hotel-profile');
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-stone/80 hover:text-ink hover:bg-porcelain text-left transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-stone/60" />
                            Meu Perfil
                          </button>

                          <button
                            onClick={() => {
                              navigate(role === 'creator' ? '/creator-settings' : '/hotel-settings');
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-stone/80 hover:text-ink hover:bg-porcelain text-left transition-colors"
                          >
                            <Settings className="w-4 h-4 text-stone/60" />
                            Configurações
                          </button>

                          <button
                            onClick={handleSwitchRole}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-stone/80 hover:text-ink hover:bg-porcelain text-left transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-stone/60" />
                            Alternar para {role === 'creator' ? 'Hotel' : 'Creator'}
                          </button>
                        </div>

                        <div className="pt-1 border-t border-stone/10">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair da Conta
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Profile Avatar Button */}
              <div className="sm:hidden">
                <button
                  onClick={() => navigate(role === 'creator' ? '/profile' : '/hotel-profile')}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Perfil"
                >
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Menu Superior Retrátil no Mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-[82%] max-w-xs bg-linen z-50 shadow-2xl flex flex-col md:hidden border-r border-stone/10"
            >
              {/* Drawer Header */}
              <div className="p-5 flex items-center justify-between border-b border-stone/10 bg-white/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral to-terracotta flex items-center justify-center shadow-soft">
                    <span className="text-white font-editorial font-bold text-lg leading-none">L</span>
                  </div>
                  <div>
                    <h2 className="font-editorial text-xl font-bold tracking-tight text-ink">
                      Loomi
                    </h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-forest">
                      Menu de Navegação
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-stone/70 hover:text-ink hover:bg-black/5 rounded-xl transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-4 mx-4 mt-4 bg-white/70 rounded-2xl border border-stone/10 shadow-soft">
                <div className="flex items-center gap-3">
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-stone/50 truncate">{user?.email || ''}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-forest/10 text-forest">
                      {role === 'creator' ? 'Conta Creator' : 'Conta Hotel'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <p className="px-3 text-[11px] font-semibold text-stone/40 uppercase tracking-wider mb-2">
                  Navegação Principal
                </p>
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        'w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all text-left',
                        active
                          ? 'bg-forest text-white shadow-soft font-semibold'
                          : 'text-stone/80 hover:text-ink hover:bg-white/60'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', active ? 'text-white' : 'text-stone/60')} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-3 pb-1">
                  <div className="h-px bg-stone/10 my-2" />
                  <p className="px-3 text-[11px] font-semibold text-stone/40 uppercase tracking-wider mb-2">
                    Conta & Opções
                  </p>
                </div>

                <button
                  onClick={() => handleNavClick(role === 'creator' ? '/profile' : '/hotel-profile')}
                  className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-stone/80 hover:text-ink hover:bg-white/60 transition-colors"
                >
                  <UserIcon className="w-5 h-5 text-stone/60" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => handleNavClick(role === 'creator' ? '/creator-settings' : '/hotel-settings')}
                  className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-stone/80 hover:text-ink hover:bg-white/60 transition-colors"
                >
                  <Settings className="w-5 h-5 text-stone/60" />
                  <span>Configurações</span>
                </button>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-stone/10 bg-white/40 space-y-2">
                <button
                  onClick={handleSwitchRole}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone/10 text-stone hover:bg-stone/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Alternar para {role === 'creator' ? 'Hotel' : 'Creator'}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
