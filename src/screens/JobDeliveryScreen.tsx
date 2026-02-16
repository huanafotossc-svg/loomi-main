import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  File,
  Send,
  Check,
  Clock,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Button, Modal } from '../components';
import { mockJobs } from '../data/mock';
import { cn } from '../utils/helpers';

interface UploadFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  preview: string;
  progress: number;
}

type DeliveryStatus = 'preparing' | 'sent_previews' | 'changes_requested' | 'final_sent' | 'approved';

export function JobDeliveryScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Mock data
  const job = mockJobs.find(j => j.id === jobId) || mockJobs[0];


  const [files, setFiles] = useState<UploadFile[]>([]);
  const [notes, setNotes] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('preparing');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const statusSteps = [
    { id: 'preparing', label: 'Preparando', icon: Clock },
    { id: 'sent_previews', label: 'Prévias enviadas', icon: ImageIcon },
    { id: 'changes_requested', label: 'Ajustes solicitados', icon: MessageSquare },
    { id: 'final_sent', label: 'Final enviado', icon: Send },
    { id: 'approved', label: 'Aprovado', icon: Check },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.id === deliveryStatus);

  const processFiles = useCallback((newFiles: File[]) => {
    newFiles.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadFile: UploadFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: isImage ? 'image' : 'video',
          size: file.size,
          preview: reader.result as string,
          progress: 0,
        };
        setFiles(prev => [...prev, uploadFile]);
        simulateUpload(uploadFile.id);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };



  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
      ));
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSendPreviews = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setDeliveryStatus('sent_previews');
    setShowSuccessModal(true);
  };

  const handleSendFinal = async () => {
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setDeliveryStatus('final_sent');
    setShowSuccessModal(true);
  };

  const handleCopyLink = () => {
    if (externalLink) {
      navigator.clipboard.writeText(externalLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const getStatusMessage = () => {
    switch (deliveryStatus) {
      case 'preparing':
        return 'Prepare suas prévias para envio';
      case 'sent_previews':
        return 'Prévias enviadas! Aguardando feedback do hotel';
      case 'changes_requested':
        return 'Ajustes solicitados. Faça as correções e reenvie';
      case 'final_sent':
        return 'Arquivos finais enviados! Aguardando aprovação';
      case 'approved':
        return 'Entrega aprovada! Obrigado pelo trabalho';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-porcelain pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink">Enviar entrega</h1>
          <p className="text-sm text-warm-gray-500">{job.title}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    isActive ? 'bg-coral text-white' : 'bg-warm-gray-100 text-warm-gray-400',
                    isCurrent && 'ring-4 ring-coral/20'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    'text-xs mt-1 text-center max-w-[60px]',
                    isActive ? 'text-ink font-medium' : 'text-warm-gray-400'
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-warm-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-coral rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-center text-sm text-warm-gray-600 mt-3">
            {getStatusMessage()}
          </p>
        </motion.div>
      </div>

      {/* Upload Zone - Only show if preparing or changes requested */}
      {(deliveryStatus === 'preparing' || deliveryStatus === 'changes_requested') && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                isDragging
                  ? 'border-coral bg-coral/5'
                  : 'border-warm-gray-300 hover:border-coral hover:bg-warm-gray-50'
              )}
            >
              <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-coral" />
              </div>
              <p className="font-medium text-ink mb-1">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-warm-gray-500">
                Fotos e vídeos até 100MB cada
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mt-4"
          >
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-medium text-ink mb-3">
                Arquivos ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-gray-200 flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-6 h-6 text-warm-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink truncate">{file.name}</p>
                      <p className="text-sm text-warm-gray-500">{formatFileSize(file.size)}</p>
                      {file.progress < 100 && (
                        <div className="mt-1 h-1.5 bg-warm-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-coral rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 hover:bg-warm-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-warm-gray-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* External Link */}
      {(deliveryStatus === 'preparing' || deliveryStatus === 'changes_requested') && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-card"
          >
            <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-coral" />
              Link externo (opcional)
            </h3>
            <p className="text-sm text-warm-gray-500 mb-3">
              Se preferir, pode enviar um link para Google Drive, Dropbox, WeTransfer, etc.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
              />
              {externalLink && (
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-warm-gray-100 rounded-xl hover:bg-warm-gray-200 transition-colors"
                >
                  {linkCopied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-warm-gray-600" />
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Notes */}
      {(deliveryStatus === 'preparing' || deliveryStatus === 'changes_requested') && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-card"
          >
            <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-coral" />
              Notas para o hotel
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione informações sobre os arquivos, direitos de uso, ou qualquer observação importante..."
              rows={4}
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors resize-none"
            />
          </motion.div>
        </div>
      )}

      {/* Deliverables Checklist */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="font-medium text-ink mb-4">Entregáveis esperados</h3>
          <div className="space-y-3">
            {job.requirements.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  files.length >= deliverable.quantity
                    ? 'bg-green-100 text-green-600'
                    : 'bg-warm-gray-100 text-warm-gray-400'
                )}>
                  {files.length >= deliverable.quantity ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">
                    {deliverable.quantity}x {deliverable.type === 'photos' ? 'Fotos' :
                      deliverable.type === 'reels' ? 'Reels' :
                        deliverable.type === 'drone' ? 'Vídeos de drone' :
                          deliverable.type === 'tour' ? 'Tour virtual' : 'Vídeo institucional'}
                  </p>
                  {deliverable.description && (
                    <p className="text-sm text-warm-gray-500">{deliverable.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      {(deliveryStatus === 'preparing' || deliveryStatus === 'changes_requested') && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200">
          <div className="app-container mx-auto flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
            <Button
              className="flex-1"
              onClick={deliveryStatus === 'changes_requested' ? handleSendFinal : handleSendPreviews}
              disabled={files.length === 0 || isUploading}
              leftIcon={isUploading ? undefined : <Send className="w-5 h-5" />}
            >
              {isUploading
                ? 'Enviando...'
                : deliveryStatus === 'changes_requested'
                  ? 'Enviar final'
                  : 'Enviar prévias'}
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Envio realizado!"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h3 className="text-xl font-bold text-ink mb-2">
            {deliveryStatus === 'sent_previews'
              ? 'Prévias enviadas com sucesso!'
              : 'Arquivos finais enviados!'}
          </h3>

          <p className="text-warm-gray-600 mb-6">
            {deliveryStatus === 'sent_previews'
              ? 'O hotel revisará suas prévias e poderá solicitar ajustes ou aprovar a entrega.'
              : 'O hotel revisará os arquivos finais e confirmará a aprovação.'}
          </p>

          <Button
            className="w-full"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/applications');
            }}
          >
            Ver minhas candidaturas
          </Button>
        </div>
      </Modal>
    </div>
  );
}
