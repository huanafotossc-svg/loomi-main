import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Camera,
  Star,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Bed,
  Gift,
  TrendingUp,
  Check,
  Wifi,
  Coffee,
  Monitor,
  Wind,
  Sun,
  Umbrella,
} from 'lucide-react';
import { Button, Input, TextArea, Toast, DatePicker, HotelBudgetInput } from '../components';
import { cn, formatCurrency } from '../utils/helpers';
import { mockJobs } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import type { Job } from '../types';

type ComboType = 'social' | 'booking' | 'complete' | '';
type PaymentType = 'permuta' | 'cache' | 'hibrido' | '';

interface FormData {
  // Step 1
  combo: ComboType;
  // Step 2
  scenes: string[];
  notes: string;
  // Step 3
  paymentType: PaymentType;
  cashValue: string;
  stayNights: string;
  roomType: string;
  validDays: string;
  // Step 4
  title: string;
  description: string;
  checkIn: string;
  checkOut: string;
  deadline: string;
  minBudget: string;
  maxBudget: string;
  accommodationCategory: string;
  amenities: string[];
}

const accommodationCategories = [
  "Quarto Standard",
  "Suíte",
  "Bangalô",
  "Chalé",
  "Studio",
  "Casa Inteira"
];

const amenitiesList = [
  { id: 'view', label: 'Vista Mar', icon: Sun },
  { id: 'bath', label: 'Banheira', icon: Umbrella }, // Placeholder icon
  { id: 'ac', label: 'Ar Condicionado', icon: Wind },
  { id: 'wifi', label: 'Wi-Fi Rápido', icon: Wifi },
  { id: 'desk', label: 'Mesa de Trabalho', icon: Monitor },
  { id: 'breakfast', label: 'Café da Manhã', icon: Coffee },
  { id: 'balcony', label: 'Varanda', icon: Sun },
  { id: 'pet', label: 'Pet Friendly', icon: Star },
];

export function CreateJobWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    combo: '',
    scenes: [],
    notes: '',
    paymentType: '',
    cashValue: '',
    stayNights: '',
    roomType: '',
    validDays: '',
    title: '',
    description: '',
    checkIn: '',
    checkOut: '',
    deadline: '',
    minBudget: '',
    maxBudget: '',
    accommodationCategory: '',
    amenities: [],
  });

  const totalSteps = 4;

  const stepTitles = [
    '',
    'Qual o foco da produção?',
    'O que é prioridade mostrar?',
    'Como será a recompensa?',
    'Resumo & Publicação',
  ];

  // Validation
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.combo !== '';
      case 2:
        return formData.scenes.length > 0;
      case 3:
        if (formData.paymentType === '') return false;
        if (formData.paymentType === 'cache') {
          return formData.minBudget !== '' && formData.maxBudget !== '';
        }
        if (formData.paymentType === 'permuta') {
          return formData.stayNights !== '' && parseInt(formData.stayNights) > 0 && formData.accommodationCategory !== '' && formData.checkIn && formData.checkOut;
        }
        if (formData.paymentType === 'hibrido') {
          return (
            formData.cashValue !== '' &&
            parseInt(formData.cashValue) > 0 &&
            formData.stayNights !== '' &&
            parseInt(formData.stayNights) > 0 &&
            formData.accommodationCategory !== '' &&
            formData.checkIn &&
            formData.checkOut
          );
        }
        return false;
      case 4:
        return formData.title && formData.description && formData.deadline;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Create new job
      const newJob: Job = {
        id: `job-${Date.now()}`,
        hotelId: user?.id || 'hotel-1',
        title: formData.title,
        description: formData.description,
        type: formData.paymentType as 'permuta' | 'cache' | 'hibrido',
        status: 'active',
        location: user?.location || 'São Paulo, SP',
        createdAt: new Date(),
        deadline: formData.deadline ? new Date(formData.deadline + 'T12:00:00') : undefined,
        applicationsCount: 0,
        coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', // Placeholder
        gallery: [],
        requirements: {
          equipment: [],
          deliverables: [],
          notes: formData.notes
        },
        stayDates: (formData.paymentType === 'permuta' || formData.paymentType === 'hibrido') && formData.checkIn && formData.checkOut ? {
          checkIn: new Date(formData.checkIn + 'T12:00:00'),
          checkOut: new Date(formData.checkOut + 'T12:00:00')
        } : undefined,
        benefits: {
          cashValue: formData.paymentType === 'cache' ? parseInt(formData.maxBudget) : (formData.cashValue ? parseInt(formData.cashValue) : undefined),
          budgetRange: formData.paymentType === 'cache' ? {
            min: parseInt(formData.minBudget),
            max: parseInt(formData.maxBudget)
          } : undefined,
          stayNights: formData.stayNights ? parseInt(formData.stayNights) : undefined,
          extras: formData.validDays ? [`Dias válidos: ${formData.validDays}`, formData.roomType && `Nome Acomodação: ${formData.roomType}`].filter(Boolean) as string[] : [],
          accommodationDetails: (formData.paymentType === 'permuta' || formData.paymentType === 'hibrido') ? {
            category: formData.accommodationCategory,
            customName: formData.roomType,
            amenities: formData.amenities
          } : undefined
        }
      };

      // Add to mock data
      mockJobs.unshift(newJob);

      // Submit - navigate to jobs page
      setShowToast(true);
      setTimeout(() => navigate('/jobs'), 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const toggleScene = (scene: string) => {
    setFormData((prev) => ({
      ...prev,
      scenes: prev.scenes.includes(scene)
        ? prev.scenes.filter((s) => s !== scene)
        : [...prev.scenes, scene],
    }));
  };

  // ROI Calculation
  const calculateROI = () => {
    const baseValues = {
      social: 800,
      booking: 1200,
      complete: 2500,
    };
    const sceneValues = {
      aerial: 400,
      rooms: 200,
      breakfast: 150,
      lifestyle: 300,
      pet: 100,
      nature: 200,
    };

    let total = baseValues[formData.combo as keyof typeof baseValues] || 0;
    formData.scenes.forEach((scene) => {
      total += sceneValues[scene as keyof typeof sceneValues] || 0;
    });

    return total;
  };

  const combos = [
    {
      id: 'social',
      icon: Smartphone,
      title: 'Reels & Stories',
      desc: 'Vídeos verticais curtos focados em atrair hóspedes pelo Instagram/TikTok',
      badge: 'Favorito',
      color: 'from-pink-500 to-coral',
    },
    {
      id: 'booking',
      icon: Camera,
      title: 'Fotos Institucionais',
      desc: 'Atualize a galeria do seu site e Booking.com com fotos de alta qualidade',
      badge: 'Básico',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'complete',
      icon: Star,
      title: 'Experiência Total',
      desc: 'O pacote completo: Vídeos, Fotos e Tour da propriedade',
      badge: 'Premium',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const scenes = [
    { id: 'aerial', emoji: '🚁', label: 'Vista Aérea', desc: 'Drone e tomadas panorâmicas' },
    { id: 'rooms', emoji: '🏨', label: 'Tour dos Quartos', desc: 'Detalhes das acomodações' },
    { id: 'breakfast', emoji: '☕', label: 'Café & Gastronomia', desc: 'Comidas e experiências' },
    { id: 'lifestyle', emoji: '✨', label: 'Lifestyle/Pessoas', desc: 'Hóspedes aproveitando' },
    { id: 'pet', emoji: '🐶', label: 'Pet Friendly', desc: 'Foco em animais' },
    { id: 'nature', emoji: '🌊', label: 'Natureza/Arredores', desc: 'Paisagens e outdoor' },
  ];

  return (
    <div className="bg-porcelain pb-24">
      <Toast
        message="Vaga publicada com sucesso!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-warm-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-ink text-lg">{stepTitles[step]}</h1>
              <p className="text-sm text-warm-gray-500">Passo {step} de {totalSteps}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 rounded-full flex-1 transition-all duration-300',
                  i < step ? 'bg-coral' : 'bg-warm-gray-200'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Combos */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {combos.map((combo) => {
                  const Icon = combo.icon;
                  const isSelected = formData.combo === combo.id;

                  return (
                    <motion.button
                      key={combo.id}
                      onClick={() => setFormData((prev) => ({ ...prev, combo: combo.id as ComboType }))}
                      className={cn(
                        'w-full p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden',
                        isSelected
                          ? 'border-coral bg-coral/5 shadow-lg shadow-coral/20'
                          : 'border-warm-gray-200 bg-white hover:border-coral/50 hover:shadow-md'
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium text-white',
                          `bg-gradient-to-r ${combo.color}`
                        )}>
                          {combo.badge}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
                          isSelected ? 'bg-coral text-white' : 'bg-warm-gray-100 text-warm-gray-500'
                        )}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1 pr-20">
                          <h3 className="font-bold text-xl text-ink mb-2">{combo.title}</h3>
                          <p className="text-warm-gray-600 leading-relaxed">{combo.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* Step 2: Scenes */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <p className="text-warm-gray-600">
                    Selecione os diferenciais que não podem faltar
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {scenes.map((scene) => {
                    const isSelected = formData.scenes.includes(scene.id);

                    return (
                      <motion.button
                        key={scene.id}
                        onClick={() => toggleScene(scene.id)}
                        className={cn(
                          'p-5 rounded-2xl border-2 text-center transition-all',
                          isSelected
                            ? 'border-coral bg-coral/5'
                            : 'border-warm-gray-200 bg-white hover:border-coral/50'
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-4xl mb-2">{scene.emoji}</div>
                        <h4 className="font-semibold text-ink text-sm mb-1">{scene.label}</h4>
                        <p className="text-xs text-warm-gray-500">{scene.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl p-4 mt-6">
                  <label className="block text-sm font-medium text-ink mb-2">
                    Algum detalhe especial sobre sua propriedade?
                  </label>
                  <TextArea
                    placeholder="Ex: Temos uma piscina infinita com vista para o mar..."
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-warm-gray-100 rounded-2xl">
                  {[
                    { id: 'permuta', label: 'Permuta', icon: Bed },
                    { id: 'cache', label: 'Cachê', icon: DollarSign },
                    { id: 'hibrido', label: 'Híbrido', icon: Gift },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = formData.paymentType === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, paymentType: tab.id as PaymentType }))
                        }
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all',
                          isActive
                            ? 'bg-white text-coral shadow-sm'
                            : 'text-warm-gray-600 hover:text-ink'
                        )}
                      >
                        <TabIcon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Permuta Form */}
                {formData.paymentType === 'permuta' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-white rounded-2xl p-4">
                      <label className="block text-sm font-medium text-ink mb-2">
                        Quantas diárias?
                      </label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={formData.stayNights}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, stayNights: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      {/* Category Select */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-2">
                          Categoria da Acomodação <span className="text-coral">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {accommodationCategories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, accommodationCategory: cat }))}
                              className={cn(
                                "px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border",
                                formData.accommodationCategory === cat ? "border-coral bg-coral/5 text-coral" : "border-warm-gray-200 hover:border-coral/30 text-warm-gray-600"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Name */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-2">
                          Nome Personalizado <span className="text-warm-gray-400 font-normal">(Opcional)</span>
                        </label>
                        <Input
                          placeholder="Ex: Suíte Master Presidencial"
                          value={formData.roomType}
                          onChange={(e) => setFormData((prev) => ({ ...prev, roomType: e.target.value }))}
                        />
                      </div>

                      {/* Amenities */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-3">
                          Diferenciais do Quarto
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {amenitiesList.map(item => {
                            const Icon = item.icon;
                            const isSelected = formData.amenities.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    amenities: isSelected
                                      ? prev.amenities.filter(a => a !== item.id)
                                      : [...prev.amenities, item.id]
                                  }));
                                }}
                                className={cn(
                                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24",
                                  isSelected ? "border-coral bg-coral/5 text-coral" : "border-warm-gray-100 hover:border-warm-gray-200 text-warm-gray-500"
                                )}
                              >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium text-center">{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4">
                      <label className="block text-sm font-medium text-ink mb-3">
                        Dias válidos (opcional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => {
                          const isSelected = formData.validDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    validDays: prev.validDays
                                      .split(', ')
                                      .filter((d) => d !== day)
                                      .join(', '),
                                  }));
                                } else {
                                  const newDays = formData.validDays
                                    ? `${formData.validDays}, ${day}`
                                    : day;
                                  setFormData((prev) => ({ ...prev, validDays: newDays }));
                                }
                              }}
                              className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                isSelected
                                  ? 'bg-coral text-white shadow-sm'
                                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      {formData.validDays && (
                        <p className="mt-2 text-xs text-warm-gray-500">
                          Selecionados: {formData.validDays}
                        </p>
                      )}
                    </div>

                    {/* Check-in/Check-out Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl p-4">
                        <DatePicker
                          label="Check-in"
                          value={formData.checkIn}
                          onChange={(date) =>
                            setFormData((prev) => ({ ...prev, checkIn: date }))
                          }
                          placeholder="Selecione a data"
                        />
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <DatePicker
                          label="Check-out"
                          value={formData.checkOut}
                          onChange={(date) =>
                            setFormData((prev) => ({ ...prev, checkOut: date }))
                          }
                          placeholder="Selecione a data"
                          minDate={formData.checkIn}
                        />
                      </div>
                    </div>

                    {/* Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                      <div className="text-2xl flex-shrink-0">🛡️</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Segurança Total Loomi</h4>
                        <p className="text-sm text-blue-800">
                          O creator faz o check-in para produzir, mas a sua Avaliação 5 Estrelas e o
                          Desbloqueio do Caução só acontecem após você aprovar a entrega das prévias.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Cachê Form */}
                {formData.paymentType === 'cache' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6"
                  >
                    <HotelBudgetInput
                      minBudget={parseFloat(formData.minBudget) || 0}
                      maxBudget={parseFloat(formData.maxBudget) || 0}
                      onChange={(min, max) => setFormData(prev => ({
                        ...prev,
                        minBudget: min.toString(),
                        maxBudget: max.toString()
                      }))}
                    />
                  </motion.div>
                )}

                {/* Híbrido Form */}
                {formData.paymentType === 'hibrido' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-white rounded-2xl p-4">
                      <label className="block text-sm font-medium text-ink mb-2">
                        Valor do cachê (R$)
                      </label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={formData.cashValue}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cashValue: e.target.value }))
                        }
                      />
                    </div>

                    <div className="bg-white rounded-2xl p-4">
                      <label className="block text-sm font-medium text-ink mb-2">
                        Quantas diárias?
                      </label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={formData.stayNights}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, stayNights: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      {/* Category Select */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-2">
                          Categoria da Acomodação <span className="text-coral">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {accommodationCategories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, accommodationCategory: cat }))}
                              className={cn(
                                "px-4 py-3 rounded-xl text-sm font-medium transition-all text-left border",
                                formData.accommodationCategory === cat ? "border-coral bg-coral/5 text-coral" : "border-warm-gray-200 hover:border-coral/30 text-warm-gray-600"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Name */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-2">
                          Nome Personalizado <span className="text-warm-gray-400 font-normal">(Opcional)</span>
                        </label>
                        <Input
                          placeholder="Ex: Suíte Master Presidencial"
                          value={formData.roomType}
                          onChange={(e) => setFormData((prev) => ({ ...prev, roomType: e.target.value }))}
                        />
                      </div>

                      {/* Amenities */}
                      <div className="bg-white rounded-2xl p-4">
                        <label className="block text-sm font-medium text-ink mb-3">
                          Diferenciais do Quarto
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {amenitiesList.map(item => {
                            const Icon = item.icon;
                            const isSelected = formData.amenities.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    amenities: isSelected
                                      ? prev.amenities.filter(a => a !== item.id)
                                      : [...prev.amenities, item.id]
                                  }));
                                }}
                                className={cn(
                                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24",
                                  isSelected ? "border-coral bg-coral/5 text-coral" : "border-warm-gray-100 hover:border-warm-gray-200 text-warm-gray-500"
                                )}
                              >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium text-center">{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4">
                      <label className="block text-sm font-medium text-ink mb-3">
                        Dias válidos (opcional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => {
                          const isSelected = formData.validDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    validDays: prev.validDays
                                      .split(', ')
                                      .filter((d) => d !== day)
                                      .join(', '),
                                  }));
                                } else {
                                  const newDays = formData.validDays
                                    ? `${formData.validDays}, ${day}`
                                    : day;
                                  setFormData((prev) => ({ ...prev, validDays: newDays }));
                                }
                              }}
                              className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                isSelected
                                  ? 'bg-coral text-white shadow-sm'
                                  : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      {formData.validDays && (
                        <p className="mt-2 text-xs text-warm-gray-500">
                          Selecionados: {formData.validDays}
                        </p>
                      )}
                    </div>

                    {/* Check-in/Check-out Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl p-4">
                        <DatePicker
                          label="Check-in"
                          value={formData.checkIn}
                          onChange={(date) =>
                            setFormData((prev) => ({ ...prev, checkIn: date }))
                          }
                          placeholder="Selecione a data"
                        />
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <DatePicker
                          label="Check-out"
                          value={formData.checkOut}
                          onChange={(date) =>
                            setFormData((prev) => ({ ...prev, checkOut: date }))
                          }
                          placeholder="Selecione a data"
                          minDate={formData.checkIn}
                        />
                      </div>
                    </div>

                    {/* Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                      <div className="text-2xl flex-shrink-0">🛡️</div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Segurança Total Loomi</h4>
                        <p className="text-sm text-blue-800">
                          O creator faz o check-in para produzir, mas a sua Avaliação 5 Estrelas e o
                          Desbloqueio do Caução só acontecem após você aprovar a entrega das prévias.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Summary & ROI */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* ROI Card */}
                <div className="bg-gradient-to-br from-coral to-coral/80 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Valor Estimado</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Você oferece</p>
                      <p className="font-bold text-xl">
                        {formData.paymentType === 'permuta' && `${formData.stayNights} Diárias`}
                        {formData.paymentType === 'cache' && `${formatCurrency(parseInt(formData.minBudget) || 0)} - ${formatCurrency(parseInt(formData.maxBudget) || 0)}`}
                        {formData.paymentType === 'hibrido' &&
                          `${formatCurrency(parseInt(formData.cashValue) || 0)} + ${formData.stayNights} Diárias`}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm mb-1">Valor de mercado</p>
                      <p className="font-bold text-xl">{formatCurrency(calculateROI())}</p>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-3">
                    <p className="text-sm">
                      ✨ {formData.paymentType === 'permuta' ? 'Ótimo negócio fazendo permuta!' : 'Excelente investimento em marketing!'}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Título da vaga
                    </label>
                    <Input
                      placeholder="Ex: Ensaio fotográfico de verão"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-4">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Descrição
                    </label>
                    <TextArea
                      placeholder="Descreva o que você espera deste material..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      rows={4}
                    />
                  </div>



                  <div className="bg-white rounded-2xl p-4">
                    <DatePicker
                      label="Prazo para entrega"
                      value={formData.deadline}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, deadline: date }))
                      }
                      placeholder="Selecione a data"
                      minDate={formData.checkOut}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-warm-gray-200 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
            {step === totalSteps ? 'Publicar Vaga' : 'Continuar'}
            {step !== totalSteps && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
