import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header, ApplicationStatusBadge, Avatar, EmptyApplications } from '../components';
import { mockApplications, getJobById, getHotelById } from '../data/mock';
import { cn, formatRelativeTime, truncateText } from '../utils/helpers';
import type { ApplicationStatus } from '../types';

export function ApplicationsScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'all'>('all');

  const filters: { value: ApplicationStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'sent', label: 'Enviadas' },
    { value: 'under_review', label: 'Em análise' },
    { value: 'accepted', label: 'Aceitas' },
    { value: 'delivered', label: 'Entregues' },
    { value: 'approved', label: 'Aprovadas' },
  ];

  const filteredApplications = mockApplications.filter(app =>
    activeFilter === 'all' || app.status === activeFilter
  );

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      <Header
        title="Minhas Candidaturas"
        subtitle={`${filteredApplications.length} ${filteredApplications.length === 1 ? 'candidatura' : 'candidaturas'}`}
        showBack
      />

      {/* Filters */}
      <div className="px-4 py-2 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors',
                activeFilter === filter.value
                  ? 'bg-coral text-white'
                  : 'bg-white text-warm-gray-600 border border-warm-gray-200 hover:border-coral'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="px-4 pt-4">
        {filteredApplications.length === 0 ? (
          <EmptyApplications onAction={() => navigate('/feed')} />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app, index) => {
              const job = getJobById(app.jobId);
              const hotel = job ? getHotelById(job.hotelId) : null;

              if (!job || !hotel) return null;

              return (
                <motion.button
                  key={app.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full bg-white rounded-3xl p-4 shadow-card text-left hover:shadow-floating transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={hotel.avatar} name={hotel.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-ink line-clamp-1">
                          {job.title}
                        </h3>
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-sm text-warm-gray-500">{hotel.name}</p>

                      <p className="text-sm text-warm-gray-600 mt-2 line-clamp-2">
                        {truncateText(app.message, 100)}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-gray-100">
                        <span className="text-xs text-warm-gray-400">
                          {formatRelativeTime(app.createdAt)}
                        </span>

                        {app.status === 'accepted' && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/chat`);
                              }}
                              className="text-xs text-coral font-medium hover:underline"
                            >
                              Chat →
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/job/${job.id}/delivery`);
                              }}
                              className="text-xs text-green-600 font-medium hover:underline"
                            >
                              Enviar →
                            </button>
                          </div>
                        )}

                        {app.status === 'delivered' && (
                          <span className="text-xs text-orange-500 font-medium">
                            Aguardando aprovação
                          </span>
                        )}

                        {app.status === 'approved' && (
                          <span className="text-xs text-green-600 font-medium">
                            Aprovado ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
