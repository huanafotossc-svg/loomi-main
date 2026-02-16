import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Camera,
  Video,
  Plane,
  Check,
  Heart,
  Share2,
  ChevronLeft,
  Star
} from 'lucide-react';
import { Button, JobTypeBadge, Avatar, Toast, ApplyJobModal } from '../components';
import { mockJobs, getHotelById } from '../data/mock';
import { cn, formatCurrency, formatDate, truncateText } from '../utils/helpers';


export function JobDetailsScreen() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const job = mockJobs.find(j => j.id === jobId);
  const hotel = job ? getHotelById(job.hotelId) : null;

  if (!job || !hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mb-4">
          <Camera className="w-10 h-10 text-warm-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-ink mb-2">Vaga não encontrada</h2>
        <p className="text-warm-gray-500 text-center mb-6">
          Essa vaga não existe ou foi removida.
        </p>
        <Button onClick={() => navigate('/feed')}>
          Voltar ao feed
        </Button>
      </div>
    );
  }

  const handleApply = (amount: number, justification: string) => {
    // Simulate application submission with amount/justification
    console.log('Applied with:', { amount, justification });

    setIsApplied(true);
    setIsApplyModalOpen(false);
    setToastMessage('Proposta enviada com sucesso!');
    setShowToast(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setToastMessage(isSaved ? 'Vaga removida dos favoritos' : 'Vaga salva!');
    setShowToast(true);
  };

  const handleShare = () => {
    // Simulate share
    setToastMessage('Link copiado para a área de transferência!');
    setShowToast(true);
  };

  const deliverables = job.requirements.deliverables || [];
  const equipment = job.requirements.equipment || [];

  return (
    <div className="bg-porcelain pb-24">
      {/* Toast */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Image Header */}
      <div className="relative h-72">
        <motion.img
          src={job.coverImage}
          alt={job.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-ink"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-ink"
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleSave}
              className={cn(
                'p-2 rounded-full backdrop-blur-sm',
                isSaved ? 'bg-coral text-white' : 'bg-white/90 text-ink'
              )}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
            </motion.button>
          </div>
        </div>

        {/* Job Type Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <JobTypeBadge type={job.type} size="md" />
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            {truncateText(job.title, 60)}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{job.location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 relative z-10">
        {/* Hotel Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-4 shadow-card mb-4"
        >
          <div className="flex items-center gap-3">
            <Avatar src={hotel.avatar} name={hotel.name} size="lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-ink">{hotel.name}</h3>
              <div className="flex items-center gap-2 text-sm text-warm-gray-500">
                <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                <span>{hotel.rating}</span>
                <span>({hotel.reviewCount} avaliações)</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              className="px-4 py-2 bg-coral/10 text-coral rounded-xl text-sm font-medium hover:bg-coral/20 transition-colors"
            >
              Ver perfil
            </button>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-4"
        >
          <h2 className="font-semibold text-ink mb-4">O que você recebe</h2>
          <div className="grid grid-cols-2 gap-4">
            {job.benefits.cashValue && (
              <div className="p-4 bg-blue-50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">R$</span>
                </div>
                <p className="text-sm text-warm-gray-500">Cachê</p>
                <p className="font-semibold text-ink">{formatCurrency(job.benefits.cashValue)}</p>
              </div>
            )}

            {job.benefits.stayNights && (
              <div className="p-4 bg-green-50 rounded-2xl">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-warm-gray-500">Estadia</p>
                <p className="font-semibold text-ink">{job.benefits.stayNights} diárias</p>
              </div>
            )}

            {job.benefits.extras?.map((extra, index) => (
              <div key={index} className="p-4 bg-sunshine/20 rounded-2xl">
                <div className="w-10 h-10 bg-sunshine/40 rounded-xl flex items-center justify-center mb-2">
                  <Check className="w-5 h-5 text-ink" />
                </div>
                <p className="text-sm text-warm-gray-500">Benefício</p>
                <p className="font-semibold text-ink">{extra}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deliverables Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-4"
        >
          <h2 className="font-semibold text-ink mb-4">O que entregar</h2>
          <div className="space-y-3">
            {deliverables.map((del, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {del.type === 'photos' && <Camera className="w-5 h-5 text-coral" />}
                  {del.type === 'reels' && <Video className="w-5 h-5 text-coral" />}
                  {del.type === 'drone' && <Plane className="w-5 h-5 text-coral" />}
                  {(del.type === 'institutional' || del.type === 'tour') && <Video className="w-5 h-5 text-coral" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">
                    {del.quantity} {del.type === 'photos' ? 'fotos' : del.type === 'reels' ? 'reels' : del.type === 'drone' ? 'tomadas aéreas' : 'vídeos'}
                  </p>
                  {del.description && (
                    <p className="text-sm text-warm-gray-500">{del.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-4"
        >
          <h2 className="font-semibold text-ink mb-4">Requisitos</h2>

          {equipment.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-warm-gray-500 mb-2">Equipamentos necessários:</p>
              <div className="flex flex-wrap gap-2">
                {equipment.map((eq) => (
                  <span
                    key={eq}
                    className="px-3 py-1.5 bg-warm-gray-100 text-warm-gray-600 text-sm rounded-lg"
                  >
                    {eq.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.requirements.notes && (
            <div>
              <p className="text-sm text-warm-gray-500 mb-2">Observações:</p>
              <p className="text-sm text-ink">{job.requirements.notes}</p>
            </div>
          )}

          {job.deadline && (
            <div className="mt-4 pt-4 border-t border-warm-gray-100">
              <div className="flex items-center gap-2 text-warm-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Prazo: {formatDate(job.deadline)}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-5 shadow-card mb-6"
        >
          <h2 className="font-semibold text-ink mb-3">Sobre a vaga</h2>
          <p className="text-warm-gray-600 leading-relaxed">
            {job.description}
          </p>
        </motion.div>
      </div>

      {/* Apply Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200 z-40">
        {isApplied ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-2xl">
            <Check className="w-5 h-5" />
            <span className="font-medium">Proposta enviada!</span>
          </div>
        ) : (
          <Button
            fullWidth
            onClick={() => setIsApplyModalOpen(true)}
          >
            Enviar Proposta
          </Button>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={job.title}
        clientBudgetMin={job.benefits.budgetRange?.min || (job.benefits.cashValue ? job.benefits.cashValue * 0.8 : 0)}
        clientBudgetMax={job.benefits.budgetRange?.max || job.benefits.cashValue || 0}
        onSubmit={handleApply}
      />
    </div>
  );
}
