import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Edit3,
  MapPin,
  Star,
  Briefcase,
  Camera,
  Award,
  TrendingUp,
  ChevronRight,
  LogOut,
  Instagram,
  Zap,
  Calendar,
  Check,
  Package,
  Video,
  Sparkles,
  Share2
} from 'lucide-react';
import { Button, Avatar, PremiumBadge, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import { cn, formatCurrency } from '../utils/helpers';
import type { Creator } from '../types';

export function CreatorProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const creator = user as Creator;

  // Derive visual tags from user data
  const hasPhotoTag = creator?.tags?.includes('photographer');
  const hasVideoTag = creator?.tags?.includes('videomaker');

  const isHotelViewer = user?.role === 'hotel';
  const isOwnProfile = user?.role === 'creator';

  // Service Packages
  interface ServicePackage {
    id: string;
    title: string;
    price: number;
    deliverables: string[];
    icon: 'camera' | 'video' | 'full';
  }

  const servicePackages: ServicePackage[] = [
    {
      id: 'pkg-a',
      title: 'Sessão Express',
      price: 400,
      deliverables: ['10 Fotos Editadas', 'Entrega em 24h'],
      icon: 'camera'
    },
    {
      id: 'pkg-b',
      title: 'Reels Maker',
      price: 600,
      deliverables: ['1 Vídeo Editado', '5 Stories Adaptados'],
      icon: 'video'
    },
    {
      id: 'pkg-c',
      title: 'Diária Completa',
      price: 1500,
      deliverables: ['Fotos Ilimitadas', 'Drone Aéreo', 'Vídeo Institucional'],
      icon: 'full'
    }
  ];

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [bookingDate, setBookingDate] = useState('');

  const handleRequestBooking = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = () => {
    console.log('Booking submitted:', { package: selectedPackage, date: bookingDate });
    setShowBookingModal(false);
    setSelectedPackage(null);
    setBookingDate('');
  };

  const getPackageIcon = (iconType: string) => {
    switch (iconType) {
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'full': return <Sparkles className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const isPremium = creator?.creatorType === 'pro';

  // Editorial Stats - cleaner icons
  const stats = [
    { label: 'Jobs', value: creator?.completedJobs || 0 },
    { label: 'Rating', value: creator?.rating?.toFixed(1) || '5.0', icon: Star },
    { label: 'Projetos', value: creator?.portfolio?.length || 0 },
  ];

  const menuItems = [
    { icon: Edit3, label: 'Editar perfil', onClick: () => navigate('/edit-profile') },
    { icon: Briefcase, label: 'Minhas candidaturas', onClick: () => navigate('/applications'), badge: '3' },
    { icon: TrendingUp, label: 'Meus ganhos', onClick: () => navigate('/earnings') },
    { icon: Award, label: 'Portfólio', onClick: () => navigate('/portfolio') },
    { icon: Settings, label: 'Configurações', onClick: () => navigate('/creator-settings') },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!creator) return null;

  return (
    <div className="min-h-screen bg-linen pb-32">
      {/* Editorial Header */}
      <div className="px-5 py-6 flex items-center justify-between sticky top-0 z-20 bg-linen/95 backdrop-blur-md">
        <h1 className="font-serif text-xl text-ink">Meu Perfil</h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-stone/5 rounded-full transition-colors text-stone/60">
            <Share2 className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button
            onClick={() => navigate('/creator-settings')}
            className="p-2 hover:bg-stone/5 rounded-full transition-colors text-stone/60"
          >
            <Settings className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <div className="px-5">
        {/* Profile Hero — Editorial Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="relative mb-4">
            <div className="p-1 rounded-full border border-stone/10 bg-white shadow-soft">
              <Avatar src={creator.avatar} name={creator.name} size="xl" />
            </div>
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <PremiumBadge size="sm" showLabel={false} />
              </div>
            )}
          </div>

          <h2 className="font-serif text-3xl text-ink mb-1">{creator.name}</h2>

          <div className="flex items-center gap-1.5 text-sm text-stone/50 font-light mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{creator.location}</span>
          </div>

          <p className="text-stone/70 text-sm leading-relaxed max-w-xs mx-auto font-light mb-5">
            {creator.bio}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {creator.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/60 border border-stone/10 rounded-full text-stone/60 text-xs font-medium tracking-wide">
                {tag === 'photographer' ? 'Fotografia' : tag === 'videomaker' ? 'Filmmaking' : 'Creator'}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Minimal Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center py-6 border-y border-stone/10 gap-12 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-serif text-2xl text-ink">{stat.value}</span>
                {stat.icon && <stat.icon className="w-3 h-3 text-amber-500 fill-current" />}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-stone/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Packages Section — Editorial Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-serif text-xl text-ink">Pacotes</h3>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/manage-packages')}
                className="text-xs font-medium text-forest hover:text-forest/80 transition-colors"
              >
                + Gerenciar
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
            {servicePackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex-shrink-0 w-[240px] snap-center bg-white/60 backdrop-blur-md border border-stone/5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest">
                    {getPackageIcon(pkg.icon)}
                  </div>
                  <h4 className="font-medium text-ink text-sm">{pkg.title}</h4>
                </div>

                <div className="mb-4">
                  <span className="font-serif text-2xl text-forest block mb-1">
                    {formatCurrency(pkg.price)}
                  </span>
                  <div className="h-px w-full bg-stone/10" />
                </div>

                <ul className="space-y-2 mb-5">
                  {pkg.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone/60 font-light">
                      <Check className="w-3 h-3 text-forest/60 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => isOwnProfile ? navigate('/manage-packages') : handleRequestBooking(pkg)}
                  className="w-full py-2.5 rounded-xl border border-stone/10 text-stone/60 text-xs font-medium hover:bg-forest hover:text-white hover:border-forest transition-all duration-300"
                >
                  {isOwnProfile ? 'Editar' : 'Reservar'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium Banner — Organic Gradient */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 rounded-2xl p-6 bg-gradient-to-br from-terracotta to-[#A85D4A] text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-xs font-medium uppercase tracking-widest text-white/80">Loomi Pro</span>
              </div>
              <h3 className="font-serif text-xl mb-2">Eleve sua carreira</h3>
              <p className="text-sm text-white/90 font-light mb-4 max-w-[200px]">
                Acesso antecipado a vagas e propostas ilimitadas.
              </p>
              <button className="px-5 py-2 bg-white text-terracotta rounded-full text-sm font-medium hover:bg-linen transition-colors">
                Ver planos
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          </motion.div>
        )}

        {/* Menu Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-1 mb-10"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-3.5 bg-white/40 hover:bg-white/80 transition-colors rounded-xl group"
            >
              <item.icon className="w-4 h-4 text-stone/40 group-hover:text-forest transition-colors stroke-[1.5]" />
              <span className="flex-1 text-left text-sm text-ink group-hover:text-forest transition-colors">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-forest/10 text-forest text-[10px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-stone/20 group-hover:text-forest/40" />
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-stone/40 hover:text-terracotta hover:bg-white/40 transition-colors rounded-xl mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair</span>
          </button>
        </motion.div>
      </div>

      {/* Booking Modal — Keeping logic, updating style */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedPackage(null);
          setBookingDate('');
        }}
        title="Solicitar Reserva"
      >
        {selectedPackage && (
          <div className="space-y-6">
            <div className="bg-linen rounded-2xl p-5 border border-stone/5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-serif text-lg text-ink">{selectedPackage.title}</h4>
                  <p className="text-forest font-medium">{formatCurrency(selectedPackage.price)}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest shadow-sm">
                  {getPackageIcon(selectedPackage.icon)}
                </div>
              </div>
              <p className="text-xs text-stone/50">
                Solicitação para <span className="font-medium text-ink">{creator.name}</span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-ink mb-3">Incluso no pacote:</p>
              <ul className="space-y-2">
                {selectedPackage.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-stone/60">
                    <Check className="w-3.5 h-3.5 text-forest/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Data preferida
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white border border-stone/10 rounded-xl focus:border-forest/30 focus:outline-none transition-colors text-stone/80"
              />
            </div>

            <Button
              onClick={handleSubmitBooking}
              disabled={!bookingDate}
              className="w-full bg-forest hover:bg-forest/90 text-white rounded-xl py-3"
            >
              Confirmar Solicitação
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
