import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Building2, Check, Video, Smartphone, Instagram, Upload, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';
import type { UserRole, CreatorType, VisualTag } from '../types';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { selectRole, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // New State for Multi-Select Tags and Profile Data
  const [selectedTags, setSelectedTags] = useState<VisualTag[]>([]);
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');
  const [portfolioUploaded, setPortfolioUploaded] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Both roles go to step 2 (name input)
    setStep(2);
  };

  const toggleTag = (tag: VisualTag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinishCreatorSetup = () => {
    // Default to 'creator' type, as specific persona is now handled by tags
    const type: CreatorType = 'creator';

    // Pass all collected data to selectRole
    updateUser({ name: userName, location: location });
    selectRole('creator', type, selectedTags);

    // Note: In a real backend integration, we would also trigger an update for location/portfolio here.
    // For now, these states (location, instagram) are collected but local to this flow until context is further expanded.

    setTimeout(() => navigate('/feed'), 500);
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-8">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              s <= step ? 'w-8 bg-coral' : 'w-4 bg-warm-gray-200'
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-ink mb-2">
                Qual é o seu perfil?
              </h1>
              <p className="text-warm-gray-500">
                Escolha como você quer usar o Loomi
              </p>
            </div>

            <div className="space-y-4 flex-1">
              {/* Creator Option */}
              <motion.button
                onClick={() => handleRoleSelect('creator')}
                className={cn(
                  'w-full p-6 rounded-3xl border-2 transition-all duration-200 text-left',
                  selectedRole === 'creator'
                    ? 'border-coral bg-coral/5'
                    : 'border-warm-gray-200 hover:border-coral/50 bg-white'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-coral/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-7 h-7 text-coral" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ink text-lg">Sou Creator</h3>
                      {selectedRole === 'creator' && (
                        <Check className="w-5 h-5 text-coral" />
                      )}
                    </div>
                    <p className="text-sm text-warm-gray-500 mb-3">
                      Sou fotógrafo, videomaker ou criador de conteúdo e quero encontrar oportunidades em hotéis
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Fotografia</span>
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Vídeo</span>
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Drone</span>
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Hotel Option */}
              <motion.button
                onClick={() => handleRoleSelect('hotel')}
                className={cn(
                  'w-full p-6 rounded-3xl border-2 transition-all duration-200 text-left',
                  selectedRole === 'hotel'
                    ? 'border-coral bg-coral/5'
                    : 'border-warm-gray-200 hover:border-coral/50 bg-white'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-sunshine/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-ink" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ink text-lg">Sou Hotel</h3>
                      {selectedRole === 'hotel' && (
                        <Check className="w-5 h-5 text-coral" />
                      )}
                    </div>
                    <p className="text-sm text-warm-gray-500 mb-3">
                      Sou hotel, pousada ou Airbnb e quero encontrar creators para produzir conteúdo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Fotos</span>
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Reels</span>
                      <span className="px-2 py-1 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-lg">Tour virtual</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Name Input (Both roles) */}
        {step === 2 && (
          <motion.div
            key="step2-name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-coral" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">
                {selectedRole === 'hotel' ? 'Qual o nome do seu hotel?' : 'Qual o seu nome?'}
              </h1>
              <p className="text-warm-gray-500">
                {selectedRole === 'hotel'
                  ? 'Esse será o nome exibido para os creators'
                  : 'Esse será o nome exibido para os hotéis'
                }
              </p>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={selectedRole === 'hotel' ? 'Ex: Hotel Fazenda Sol' : 'Ex: Maria Silva'}
                className="w-full px-5 py-4 text-lg bg-white border-2 border-warm-gray-200 rounded-2xl focus:border-coral focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedRole(null);
                }}
                className="px-6 py-4 text-warm-gray-600 font-medium rounded-2xl bg-warm-gray-100 hover:bg-warm-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  if (selectedRole === 'hotel') {
                    // Hotel goes directly to dashboard
                    updateUser({ name: userName });
                    selectRole('hotel');
                    setTimeout(() => navigate('/dashboard'), 500);
                  } else {
                    // Creator continues to skill selection
                    setStep(3);
                  }
                }}
                disabled={!userName.trim()}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-semibold transition-all duration-200",
                  userName.trim()
                    ? "bg-coral text-white shadow-lg shadow-coral/30"
                    : "bg-warm-gray-200 text-warm-gray-400"
                )}
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Skills (Creator only - was Step 2) */}
        {step === 3 && selectedRole === 'creator' && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-ink mb-2">
                O que você faz melhor?
              </h1>
              <p className="text-warm-gray-500">
                Selecione suas principais habilidades. Isso definirá quais vagas aparecem para você.
              </p>
            </div>

            <div className="space-y-3 flex-1">
              <motion.button
                onClick={() => toggleTag('photographer')}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center gap-4',
                  selectedTags.includes('photographer')
                    ? 'border-coral bg-coral/5 shadow-sm'
                    : 'border-warm-gray-200 hover:border-coral/30 bg-white'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedTags.includes('photographer') ? "bg-coral text-white" : "bg-warm-gray-100 text-warm-gray-400"
                )}>
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-ink text-lg">Fotografia</h3>
                    {selectedTags.includes('photographer') && <Check className="w-5 h-5 text-coral" />}
                  </div>
                  <p className="text-sm text-warm-gray-500">Fotos de arquitetura, comida, lifestyle.</p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => toggleTag('videomaker')}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center gap-4',
                  selectedTags.includes('videomaker')
                    ? 'border-coral bg-coral/5 shadow-sm'
                    : 'border-warm-gray-200 hover:border-coral/30 bg-white'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedTags.includes('videomaker') ? "bg-coral text-white" : "bg-warm-gray-100 text-warm-gray-400"
                )}>
                  <Video className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-ink text-lg">Vídeo & Drone</h3>
                    {selectedTags.includes('videomaker') && <Check className="w-5 h-5 text-coral" />}
                  </div>
                  <p className="text-sm text-warm-gray-500">Filmes institucionais, takes aéreos, 4K.</p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => toggleTag('creator')}
                className={cn(
                  'w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center gap-4',
                  selectedTags.includes('creator')
                    ? 'border-coral bg-coral/5 shadow-sm'
                    : 'border-warm-gray-200 hover:border-coral/30 bg-white'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  selectedTags.includes('creator') ? "bg-coral text-white" : "bg-warm-gray-100 text-warm-gray-400"
                )}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-ink text-lg">Content Creator</h3>
                    {selectedTags.includes('creator') && <Check className="w-5 h-5 text-coral" />}
                  </div>
                  <p className="text-sm text-warm-gray-500">Reels, TikTok, Stories, Criação de roteiro.</p>
                </div>
              </motion.button>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setStep(2);
                }}
                className="flex-1 py-3.5 text-warm-gray-500 font-medium hover:text-ink transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={nextStep}
                disabled={selectedTags.length === 0}
                className={cn(
                  "flex-[2] py-3.5 rounded-xl font-bold text-white transition-all shadow-lg shadow-coral/20",
                  selectedTags.length > 0 ? "bg-coral hover:bg-coral/90 transform hover:-translate-y-0.5" : "bg-warm-gray-300 cursor-not-allowed"
                )}
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-ink mb-2">Conecte seu Portfólio</h1>
              <p className="text-warm-gray-500">Mostre seu trabalho para aumentar suas chances de contratação.</p>
            </div>

            <div className="flex-1 space-y-4">
              {/* Instagram Connect */}
              <div className="p-5 bg-white rounded-3xl border border-warm-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Instagram</h3>
                    <p className="text-sm text-warm-gray-500">Conecte para puxar suas melhores fotos.</p>
                  </div>
                </div>
                {instagram ? (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">@{instagram} conectado</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setInstagram('usuario_exemplo')}
                    className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors"
                  >
                    Conectar Instagram
                  </button>
                )}
              </div>

              {/* Upload Photos */}
              <div className="p-5 bg-white rounded-3xl border border-warm-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Upload Manual</h3>
                    <p className="text-sm text-warm-gray-500">Selecione 3 a 5 fotos do seu trabalho.</p>
                  </div>
                </div>
                {portfolioUploaded ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-warm-gray-100 rounded-lg overflow-hidden relative">
                        <img src={`https://source.unsplash.com/random/200x200?sig=${i}`} className="w-full h-full object-cover" alt="Portfolio" />
                      </div>
                    ))}
                    <div className="aspect-square bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold border-2 border-green-200 border-dashed">
                      +3
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setPortfolioUploaded(true)}
                    className="w-full py-8 border-2 border-dashed border-warm-gray-300 rounded-xl flex flex-col items-center justify-center text-warm-gray-500 hover:border-coral hover:text-coral transition-colors"
                  >
                    <Upload className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Toque para selecionar fotos</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={prevStep} className="flex-1 py-3.5 text-warm-gray-500 font-medium hover:text-ink transition-colors">Voltar</button>
              <button
                onClick={nextStep}
                className="flex-[2] py-3.5 bg-coral text-white rounded-xl font-bold shadow-lg shadow-coral/20 hover:bg-coral/90 transition-all transform hover:-translate-y-0.5"
              >
                {instagram || portfolioUploaded ? 'Continuar' : 'Pular por enquanto'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-ink mb-2">Onde você está?</h1>
              <p className="text-warm-gray-500">Vamos mostrar vagas próximas a você.</p>
            </div>

            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cidade, Estado"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-warm-gray-200 rounded-2xl focus:border-coral focus:ring-4 focus:ring-coral/10 transition-all text-lg"
                />
              </div>
              <button
                onClick={() => setLocation('São Paulo, SP')}
                className="mt-4 flex items-center gap-2 text-coral font-medium text-sm px-2 py-1 hover:bg-coral/5 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Usar localização atual
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={prevStep} className="flex-1 py-3.5 text-warm-gray-500 font-medium hover:text-ink transition-colors">Voltar</button>
              <button
                onClick={handleFinishCreatorSetup}
                disabled={!location}
                className={cn(
                  "flex-[2] py-3.5 rounded-xl font-bold text-white transition-all shadow-lg shadow-coral/20",
                  location ? "bg-coral hover:bg-coral/90 transform hover:-translate-y-0.5" : "bg-warm-gray-300 cursor-not-allowed"
                )}
              >
                Finalizar Cadastro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
