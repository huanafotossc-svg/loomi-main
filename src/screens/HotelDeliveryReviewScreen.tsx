import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  X,
  MessageSquare,
  Download,
  Image as ImageIcon,
  Film,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Button, Modal, Avatar } from '../components';
import { mockJobs, mockDeliveries, getJobById, getCreatorById } from '../data/mock';
import { cn, formatDate } from '../utils/helpers';
import type { DeliveryStatus } from '../types';

export function HotelDeliveryReviewScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  // Se não tiver jobId na URL, usa o primeiro job com entrega pendente
  const job = jobId ? getJobById(jobId) : mockJobs[0];
  const creator = job ? getCreatorById('creator-1') : null;
  const delivery = mockDeliveries[0];

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionComment, setRevisionComment] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(delivery?.status || 'pending');


  if (!job || !creator || !delivery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-porcelain">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-ink mb-4">Entrega não encontrada</h1>
          <Button onClick={() => navigate('/jobs')}>Voltar para vagas</Button>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    setDeliveryStatus('approved');
    setShowApproveModal(false);
  };

  const handleRequestRevision = () => {
    if (!revisionComment.trim()) return;
    setDeliveryStatus('needs_revision');
    setShowRevisionModal(false);
  };

  const handleReviewCreator = () => {
    navigate('/reviews', { state: { jobId: job.id, creatorId: creator.id } });
  };

  const getStatusBadge = () => {
    switch (deliveryStatus) {
      case 'pending':
        return { label: 'Aguardando revisão', color: 'bg-yellow-100 text-yellow-700' };
      case 'in_review':
        return { label: 'Em revisão', color: 'bg-blue-100 text-blue-700' };
      case 'approved':
        return { label: 'Aprovado', color: 'bg-green-100 text-green-700' };
      case 'needs_revision':
        return { label: 'Ajustes solicitados', color: 'bg-orange-100 text-orange-700' };
      default:
        return { label: 'Pendente', color: 'bg-warm-gray-100 text-warm-gray-600' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-porcelain pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink">Revisar entrega</h1>
            <p className="text-sm text-warm-gray-500">{job.title}</p>
          </div>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusBadge.color)}>
          {statusBadge.label}
        </span>
      </div>

      {/* Creator Info */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Avatar src={creator.avatar} name={creator.name} size="lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-ink">{creator.name}</h3>
              <p className="text-sm text-warm-gray-500">Creator</p>
            </div>
            <button
              onClick={() => navigate('/hotel-chat')}
              className="p-2 bg-coral/10 rounded-full text-coral hover:bg-coral/20 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">Detalhes da entrega</h3>
            <div className="flex items-center gap-1 text-sm text-warm-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(delivery.submittedAt)}</span>
            </div>
          </div>

          {delivery.notes && (
            <div className="bg-warm-gray-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-warm-gray-600">
                <span className="font-medium text-ink">Mensagem do creator:</span>
                <br />
                {delivery.notes}
              </p>
            </div>
          )}

          {/* File Count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-coral" />
              <span className="text-sm text-warm-gray-600">
                {delivery.previews.filter(p => p.type === 'image').length} fotos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-coral" />
              <span className="text-sm text-warm-gray-600">
                {delivery.previews.filter(p => p.type === 'video').length} vídeos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Prévias
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {delivery.previews.map((preview, index) => (
            <motion.div
              key={preview.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-warm-gray-100 group"
            >
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="p-2 bg-white rounded-full">
                  <Download className="w-5 h-5 text-ink" />
                </button>
              </div>
              {preview.type === 'video' && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-white text-xs">
                  Vídeo
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* External Link */}
      {deliveryStatus === 'approved' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-4"
        >
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">Link do pacote completo</p>
                <p className="text-sm text-green-600">Arquivos em alta resolução</p>
              </div>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feedback History */}
      {deliveryStatus === 'needs_revision' && delivery.feedback && (
        <div className="px-4 mt-4">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="font-medium text-orange-800 mb-2">Ajustes solicitados</p>
            <p className="text-sm text-orange-600">{delivery.feedback}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {deliveryStatus !== 'approved' && deliveryStatus !== 'needs_revision' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200">
          <div className="app-container mx-auto flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              leftIcon={<X className="w-5 h-5" />}
              onClick={() => setShowRevisionModal(true)}
            >
              Pedir ajustes
            </Button>
            <Button
              className="flex-1"
              leftIcon={<Check className="w-5 h-5" />}
              onClick={() => setShowApproveModal(true)}
            >
              Aprovar
            </Button>
          </div>
        </div>
      )}

      {/* Review CTA */}
      {deliveryStatus === 'approved' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200">
          <div className="app-container mx-auto">
            <Button
              className="w-full"
              onClick={handleReviewCreator}
            >
              Avaliar creator
            </Button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Aprovar entrega"
      >
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-800 text-sm">
              Ao aprovar, você confirma que o conteúdo atende aos requisitos e
              libera o pagamento/crédito para o creator.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">O que acontece:</p>
            <ul className="space-y-2 text-sm text-warm-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Link do pacote completo será liberado
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Creator recebe o pagamento/crédito
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Você poderá avaliar o creator
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowApproveModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleApprove}
            >
              Confirmar aprovação
            </Button>
          </div>
        </div>
      </Modal>

      {/* Request Revision Modal */}
      <Modal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        title="Solicitar ajustes"
      >
        <div className="space-y-4">
          <p className="text-warm-gray-600 text-sm">
            Descreva detalhadamente o que precisa ser ajustado. Seja específico
            para facilitar as correções.
          </p>

          <textarea
            value={revisionComment}
            onChange={(e) => setRevisionComment(e.target.value)}
            placeholder="Ex: Preciso que ajuste a iluminação das fotos do quarto principal..."
            className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none resize-none"
            rows={5}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowRevisionModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleRequestRevision}
              disabled={!revisionComment.trim()}
            >
              Enviar solicitação
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
