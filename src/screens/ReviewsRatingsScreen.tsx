import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Check,

  Camera,
  Send
} from 'lucide-react';
import { Button, Modal } from '../components';
import { mockCreators, mockJobs } from '../data/mock';
import { cn } from '../utils/helpers';

const ratingTags = [
  'Profissionalismo',
  'Qualidade do trabalho',
  'Cumpriu prazos',
  'Comunicação',
  'Criatividade',
  'Receptivo a feedback',
];

export function ReviewsRatingsScreen() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { jobId, creatorId } = location.state || {};

  // Mock data - na prática viria dos params ou state
  const creator = mockCreators[0];
  const job = mockJobs[0];

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
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
        <h1 className="text-xl font-bold text-ink">Avaliar creator</h1>
      </div>

      {/* Creator Info */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-coral">
                  {creator.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ink">{creator.name}</h2>
              <p className="text-sm text-warm-gray-500">{creator.location}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{creator.rating}</span>
                </div>
                <span className="text-sm text-warm-gray-400">
                  ({creator.reviewCount} avaliações)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-warm-gray-100">
            <div className="flex items-center gap-2 text-sm text-warm-gray-600">
              <Camera className="w-4 h-4" />
              <span>Job: {job.title}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rating Stars */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="text-center font-semibold text-ink mb-4">
            Como foi trabalhar com {creator.name.split(' ')[0]}?
          </h3>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'w-10 h-10 transition-colors',
                    (hoverRating ? star <= hoverRating : star <= rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-warm-gray-300'
                  )}
                />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-warm-gray-500 mt-3">
            {rating === 0 && 'Toque nas estrelas para avaliar'}
            {rating === 1 && 'Ruim'}
            {rating === 2 && 'Regular'}
            {rating === 3 && 'Bom'}
            {rating === 4 && 'Muito bom'}
            {rating === 5 && 'Excelente!'}
          </p>
        </motion.div>
      </div>

      {/* Tags */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-4"
        >
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-medium text-ink mb-3">
              O que destacaria? (opcional)
            </h3>
            <div className="flex flex-wrap gap-2">
              {ratingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedTags.includes(tag)
                      ? 'bg-coral text-white'
                      : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                  )}
                >
                  {selectedTags.includes(tag) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Comment */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-4"
        >
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-medium text-ink mb-3">
              Conte mais sobre sua experiência (opcional)
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="O que você gostou? O que poderia melhorar?"
              className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none resize-none"
              rows={4}
            />
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200"
        >
          <div className="app-container mx-auto">
            <Button
              className="w-full"
              onClick={handleSubmit}
              leftIcon={<Send className="w-5 h-5" />}
            >
              Enviar avaliação
            </Button>
          </div>
        </motion.div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        title="Avaliação enviada!"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h3 className="text-xl font-bold text-ink mb-2">
            Obrigado pela avaliação!
          </h3>

          <p className="text-warm-gray-600 mb-6">
            Sua avaliação ajuda outros hotéis a encontrarem os melhores creators.
          </p>

          <div className="bg-warm-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-warm-gray-500">
              {selectedTags.length > 0 && selectedTags.join(', ')}
            </p>
          </div>

          <Button
            className="w-full"
            onClick={handleCloseSuccess}
          >
            Voltar ao dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
}
