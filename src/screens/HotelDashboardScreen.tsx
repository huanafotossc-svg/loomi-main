import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import { Button, Avatar, JobTypeBadge } from '../components';
import { useAuth } from '../context/AuthContext';
import { mockJobs, mockHotels, mockApplications, mockCreators } from '../data/mock';
import { cn, formatCurrency } from '../utils/helpers';
import type { Hotel } from '../types';

export function HotelDashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get hotel data
  const hotel = (user?.role === 'hotel' ? user : mockHotels[0]) as unknown as Hotel; // Force cast for mock/demo purposes

  // Get hotel's jobs
  const hotelJobs = mockJobs.filter(job => job.hotelId === hotel.id);
  const activeJobs = hotelJobs.filter(job => job.status === 'active');

  // Get applications
  const jobIds = hotelJobs.map(j => j.id);
  const applications = mockApplications.filter(app => jobIds.includes(app.jobId));
  const pendingApplications = applications.filter(app => app.status === 'sent' || app.status === 'under_review');

  // Stats
  const stats = [
    {
      icon: Briefcase,
      label: 'Vagas ativas',
      value: activeJobs.length,
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/jobs'),
    },
    {
      label: 'ROI Estimado',
      value: formatCurrency(hotel.mediaValue || 0),
      subtitle: `${hotel.mediaValue && hotel.estimatedSavings ? Math.round((hotel.mediaValue / hotel.estimatedSavings) * 100) : 0}% de retorno`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Economia',
      value: formatCurrency(hotel.estimatedSavings || 0),
      icon: DollarSign, // Added icon based on original structure
      color: 'bg-sunshine/30 text-ink',
    },
  ];

  return (
    <div className="min-h-screen bg-porcelain pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-warm-gray-500">Bem-vindo de volta</p>
            <h1 className="text-2xl font-bold text-ink capitalize">{hotel.name}</h1>
          </div>
          <Avatar src={hotel.avatar} name={hotel.name} size="lg" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-sunshine text-sunshine" />
            <span className="font-semibold text-ink">{hotel.rating}</span>
          </div>
          <span className="text-warm-gray-500">({hotel.reviewCount} avaliações)</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={stat.onClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-floating transition-shadow"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-warm-gray-500">{stat.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-ink mb-3">Ações rápidas</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/create-job')}
            leftIcon={<Plus className="w-5 h-5" />}
            className="flex-1"
          >
            Nova Vaga
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/applicants')}
            className="flex-1"
          >
            Ver Candidatos
          </Button>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink">Vagas ativas</h2>
          <button
            onClick={() => navigate('/jobs')}
            className="text-sm text-coral font-medium flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-warm-gray-500 mb-4">Você ainda não tem vagas ativas</p>
            <Button onClick={() => navigate('/create-job')} size="sm">
              Criar primeira vaga
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.slice(0, 3).map((job, index) => (
              <motion.button
                key={job.id}
                onClick={() => navigate(`/job/${job.id}/manage`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="w-full bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-floating transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-ink line-clamp-1">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <JobTypeBadge type={job.type} size="sm" />
                      <span className="text-sm text-warm-gray-500">
                        {job.applicationsCount} candidaturas
                      </span>
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-1 text-sm text-warm-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Até {new Date(job.deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications */}
      {pendingApplications.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-ink">Candidaturas recentes</h2>
            <button
              onClick={() => navigate('/applicants')}
              className="text-sm text-coral font-medium flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingApplications.slice(0, 3).map((app, index) => {
              const job = mockJobs.find(j => j.id === app.jobId);
              return (
                <motion.button
                  key={app.id}
                  onClick={() => navigate(`/applicants`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="w-full bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-floating transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-coral" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink">Nova candidatura</p>
                      <p className="text-sm text-warm-gray-500">
                        {job?.title}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-lg">
                      Nova
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Creators Disponíveis */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink">Creators disponíveis</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {mockCreators.slice(0, 5).map((creator, index) => (
            <motion.button
              key={creator.id}
              onClick={() => navigate(`/creator/${creator.id}`)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex-shrink-0 w-[160px] snap-start bg-white rounded-2xl p-4 shadow-card text-center hover:shadow-floating transition-shadow"
            >
              <Avatar
                src={creator.avatar}
                name={creator.name}
                size="lg"
                className="mx-auto mb-3"
              />
              <h3 className="font-medium text-ink text-sm line-clamp-1">{creator.name}</h3>
              <div className="flex items-center justify-center gap-1 text-xs text-warm-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{creator.location}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {creator.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-coral/10 text-coral text-[10px] rounded-md font-medium">
                    {tag === 'photographer' ? 'Foto' : tag === 'videomaker' ? 'Vídeo' : 'Creator'}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                <Star className="w-3 h-3 fill-sunshine text-sunshine" />
                <span className="font-medium text-ink">{creator.rating?.toFixed(1) || '5.0'}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Performance Card */}
      <div className="px-4 mt-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-ink to-warm-gray-800 rounded-3xl p-5 text-white"
        >
          <h3 className="font-semibold mb-4">Performance do mês</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{hotelJobs.length}</p>
              <p className="text-sm text-white/70">Vagas criadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-sm text-white/70">Candidaturas</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{hotel.reviewCount}</p>
              <p className="text-sm text-white/70">Avaliações</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="mt-4 w-full py-2.5 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Ver relatório completo
          </button>
        </motion.div>
      </div>
    </div>
  );
}
