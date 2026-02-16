import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle, Star } from 'lucide-react';
import { Header, Avatar, Button, ApplicationStatusBadge, EmptyState } from '../components';
import { mockApplications, getJobById, getCreatorById } from '../data/mock';
import { cn, formatRelativeTime, truncateText } from '../utils/helpers';
import type { Application } from '../types';

export function ApplicantsListScreen() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const job = jobId ? getJobById(jobId) : null;

  // Get applications for this job (or all if no jobId)
  const applications = jobId
    ? mockApplications.filter(app => app.jobId === jobId)
    : mockApplications;

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'pending') return app.status === 'sent' || app.status === 'under_review';
    if (filter === 'accepted') return app.status === 'accepted' || app.status === 'delivered' || app.status === 'approved';
    if (filter === 'rejected') return app.status === 'rejected';
    return true;
  });

  const handleAccept = (application: Application) => {
    alert(`Candidatura de ${getCreatorById(application.creatorId)?.name} aceita!`);
  };

  const handleReject = () => {
    alert(`Candidatura rejeitada.`);
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      <Header
        title={job ? `Candidatos: ${truncateText(job.title, 30)}` : 'Candidaturas'}
        subtitle={`${filteredApplications.length} ${filteredApplications.length === 1 ? 'candidato' : 'candidatos'}`}
        showBack
      />

      {/* Filters */}
      <div className="px-4 py-2 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendentes' },
            { value: 'accepted', label: 'Aceitos' },
            { value: 'rejected', label: 'Recusados' },
          ].map((f) => (
            <motion.button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors',
                filter === f.value
                  ? 'bg-coral text-white'
                  : 'bg-white text-warm-gray-600 border border-warm-gray-200'
              )}
              whileTap={{ scale: 0.95 }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      <div className="px-4 pt-4">
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon={<UsersIcon />}
            title="Nenhum candidato"
            description="Ainda não há candidaturas para esta vaga."
          />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app, index) => {
              const creator = getCreatorById(app.creatorId);
              if (!creator) return null;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-5 shadow-card"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar src={creator.avatar} name={creator.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-ink">{creator.name}</h3>
                        <ApplicationStatusBadge status={app.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-warm-gray-500">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span>{creator.rating}</span>
                        <span>({creator.reviewCount} avaliações)</span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.equipment.slice(0, 4).map((eq) => (
                      <span
                        key={eq}
                        className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg"
                      >
                        {eq.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Message */}
                  <div className="bg-warm-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-warm-gray-600 line-clamp-3">
                      "{app.message}"
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-warm-gray-500 mb-4">
                    <span>{creator.completedJobs} jobs completos</span>
                    <span>•</span>
                    <span>{formatRelativeTime(app.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  {(app.status === 'sent' || app.status === 'under_review') && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={() => handleReject()}
                      >
                        Recusar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        leftIcon={<Check className="w-4 h-4" />}
                        onClick={() => handleAccept(app)}
                      >
                        Aceitar
                      </Button>
                    </div>
                  )}

                  {app.status === 'accepted' && (
                    <Button
                      fullWidth
                      leftIcon={<MessageCircle className="w-4 h-4" />}
                      onClick={() => navigate('/chat')}
                    >
                      Abrir Chat
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
