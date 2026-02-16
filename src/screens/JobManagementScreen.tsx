import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Pause, Play, X, Edit3, Users, Calendar, MapPin, Camera, Gift } from 'lucide-react';
import { Header, JobTypeBadge, Button, Modal } from '../components';
import { mockJobs } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { cn, formatRelativeTime, formatCurrency } from '../utils/helpers';
import type { Job, JobStatus } from '../types';

export function JobManagementScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('active');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Filter jobs by hotel and status
  const hotelJobs = mockJobs.filter(job => job.hotelId === user?.id);

  const filteredJobs = activeTab === 'all'
    ? hotelJobs
    : hotelJobs.filter(job => job.status === activeTab);

  const tabs = [
    { value: 'active', label: 'Ativas' },
    { value: 'all', label: 'Todas' },
    { value: 'paused', label: 'Pausadas' },
    { value: 'closed', label: 'Encerradas' },
  ];

  // Calculate counts for each tab
  const getCounts = () => ({
    active: hotelJobs.filter(j => j.status === 'active').length,
    all: hotelJobs.length,
    paused: hotelJobs.filter(j => j.status === 'paused').length,
    closed: hotelJobs.filter(j => j.status === 'closed').length,
  });

  const counts = getCounts();

  const handleStatusChange = (job: Job, newStatus: JobStatus) => {
    setIsActionsModalOpen(false);

    // In a real app, this would update the backend
    // For now, we'll simulate the status change and navigate to the appropriate tab

    // Update the job status (simulated)
    job.status = newStatus;

    // Navigate to the appropriate tab
    setTimeout(() => {
      setActiveTab(newStatus);
    }, 300);
  };

  const handleAction = (action: string, job: Job) => {
    setIsActionsModalOpen(false);

    switch (action) {
      case 'pause':
        handleStatusChange(job, 'paused');
        break;
      case 'resume':
        handleStatusChange(job, 'active');
        break;
      case 'close':
        handleStatusChange(job, 'closed');
        break;
      case 'edit':
        navigate(`/job/${job.id}/edit`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      <Header
        title="Minhas Vagas"
        subtitle={`${hotelJobs.length} ${hotelJobs.length === 1 ? 'vaga' : 'vagas'}`}
        showBack
        rightAction={
          <Button
            size="sm"
            onClick={() => navigate('/create-job')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova
          </Button>
        }
      />

      {/* Tabs */}
      <div className="px-4 py-3 overflow-x-auto hide-scrollbar border-b border-warm-gray-100">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const count = counts[tab.value as keyof typeof counts];
            return (
              <motion.button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as JobStatus | 'all')}
                className={cn(
                  'px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all flex items-center gap-2',
                  activeTab === tab.value
                    ? 'bg-coral text-white shadow-md'
                    : 'bg-white text-warm-gray-600 border border-warm-gray-200 hover:border-coral/30'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  activeTab === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-warm-gray-100 text-warm-gray-600'
                )}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-4 pt-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-warm-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              {activeTab === 'active' && 'Nenhuma vaga ativa'}
              {activeTab === 'paused' && 'Nenhuma vaga pausada'}
              {activeTab === 'closed' && 'Nenhuma vaga encerrada'}
              {activeTab === 'all' && 'Nenhuma vaga encontrada'}
            </h3>
            <p className="text-warm-gray-500 mb-6">
              {activeTab === 'active' && 'Crie sua primeira vaga para começar a receber candidaturas'}
              {activeTab === 'paused' && 'Você não tem vagas pausadas no momento'}
              {activeTab === 'closed' && 'Suas vagas encerradas aparecerão aqui'}
              {activeTab === 'all' && 'Crie sua primeira vaga para começar'}
            </p>
            {(activeTab === 'active' || activeTab === 'all') && (
              <Button onClick={() => navigate('/create-job')}>
                Criar Vaga
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedJob(job);
                  setIsDetailsModalOpen(true);
                }}
              >
                {/* Image */}
                <div className="relative h-40">
                  <img
                    src={job.coverImage}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <JobTypeBadge type={job.type} />
                  </div>

                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      job.status === 'active' && 'bg-green-100 text-green-700',
                      job.status === 'paused' && 'bg-yellow-100 text-yellow-700',
                      job.status === 'closed' && 'bg-warm-gray-100 text-warm-gray-600',
                    )}>
                      {job.status === 'active' && 'Ativa'}
                      {job.status === 'paused' && 'Pausada'}
                      {job.status === 'closed' && 'Encerrada'}
                    </span>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                      setIsActionsModalOpen(true);
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-ink mb-1">{job.title}</h3>
                  <p className="text-sm text-warm-gray-500 mb-3">{job.location}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-warm-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{job.applicationsCount} candidatos</span>
                      </div>
                      {job.deadline && (
                        <div className="text-warm-gray-500">
                          Até {formatRelativeTime(job.deadline)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${job.id}/applicants`);
                      }}
                      className="px-4 py-2 bg-coral/10 text-coral rounded-xl text-sm font-medium hover:bg-coral/20 transition-colors"
                    >
                      Ver candidatos
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Actions Modal */}
      <Modal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        title="Ações"
      >
        <div className="space-y-2">
          <button
            onClick={() => selectedJob && handleAction('edit', selectedJob)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-gray-50 rounded-xl transition-colors text-left"
          >
            <Edit3 className="w-5 h-5 text-warm-gray-600" />
            <span>Editar vaga</span>
          </button>

          {selectedJob?.status === 'active' && (
            <button
              onClick={() => selectedJob && handleAction('pause', selectedJob)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-gray-50 rounded-xl transition-colors text-left"
            >
              <Pause className="w-5 h-5 text-yellow-600" />
              <span>Pausar vaga</span>
            </button>
          )}

          {selectedJob?.status === 'paused' && (
            <button
              onClick={() => selectedJob && handleAction('resume', selectedJob)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-warm-gray-50 rounded-xl transition-colors text-left"
            >
              <Play className="w-5 h-5 text-green-600" />
              <span>Retomar vaga</span>
            </button>
          )}

          <button
            onClick={() => selectedJob && handleAction('close', selectedJob)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600"
          >
            <X className="w-5 h-5" />
            <span>Encerrar vaga</span>
          </button>
        </div>
      </Modal>

      {/* Job Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Detalhes da Vaga"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <JobTypeBadge type={selectedJob.type} />
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  selectedJob.status === 'active' && 'bg-green-100 text-green-700',
                  selectedJob.status === 'paused' && 'bg-yellow-100 text-yellow-700',
                  selectedJob.status === 'closed' && 'bg-warm-gray-100 text-warm-gray-600',
                )}>
                  {selectedJob.status === 'active' && 'Ativa'}
                  {selectedJob.status === 'paused' && 'Pausada'}
                  {selectedJob.status === 'closed' && 'Encerrada'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">{selectedJob.title}</h3>
              <p className="text-warm-gray-600 leading-relaxed">{selectedJob.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-warm-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-warm-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium">Localização</span>
                </div>
                <p className="text-sm font-medium text-ink">{selectedJob.location}</p>
              </div>

              <div className="bg-warm-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-warm-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Prazo</span>
                </div>
                <p className="text-sm font-medium text-ink">
                  {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                </p>
              </div>

              {(selectedJob.benefits.cashValue || selectedJob.type === 'permuta') && (
                <div className="bg-warm-gray-50 p-3 rounded-xl col-span-2">
                  <div className="flex items-center gap-2 text-warm-gray-500 mb-1">
                    <Gift className="w-4 h-4" />
                    <span className="text-xs font-medium">Recompensa</span>
                  </div>
                  <p className="text-sm font-medium text-ink">
                    {selectedJob.type === 'cache' && formatCurrency(selectedJob.benefits.cashValue || 0)}
                    {selectedJob.type === 'permuta' && `${selectedJob.benefits.stayNights} Diárias`}
                    {selectedJob.type === 'hibrido' && `${formatCurrency(selectedJob.benefits.cashValue || 0)} + ${selectedJob.benefits.stayNights} Diárias`}
                  </p>
                </div>
              )}
            </div>

            {/* Requirements Shortcut */}
            {selectedJob.requirements.deliverables.length > 0 && (
              <div>
                <h4 className="font-semibold text-ink mb-3 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-coral" />
                  Entregáveis
                </h4>
                <div className="bg-white border border-warm-gray-200 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedJob.requirements.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-warm-gray-600">
                        <div className="w-1.5 h-1.5 bg-coral rounded-full" />
                        {item.quantity}x {
                          item.type === 'photos' ? 'Fotos' :
                            item.type === 'reels' ? 'Reels' :
                              item.type === 'drone' ? 'Imagens Aéreas' : item.type
                        }
                        {item.description && <span className="text-warm-gray-400">- {item.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-warm-gray-100 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Fechar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  navigate(`/job/${selectedJob.id}/applicants`);
                  setIsDetailsModalOpen(false);
                }}
              >
                Ver {selectedJob.applicationsCount} Candidatos
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
