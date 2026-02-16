import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  MapPin,
  User,
  Mail,
  Phone,
  Briefcase,
  Check
} from 'lucide-react';
import { Button, Avatar } from '../components';
import { mockCreators } from '../data/mock';
import { cn } from '../utils/helpers';
import type { EquipmentTag, StyleTag } from '../types';

const equipmentOptions: EquipmentTag[] = ['drone', '4k', 'gimbal', 'lighting', 'underwater', '360', 'dslr'];
const styleOptions: StyleTag[] = ['hotelaria', 'lifestyle', 'arquitetura', 'gastronomia', 'natureza', 'aereo'];

export function EditProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const creator = mockCreators[0];

  const [formData, setFormData] = useState({
    name: creator.name,
    bio: creator.bio,
    location: creator.location,
    email: creator.email,
    phone: creator.phone,
    avatar: creator.avatar,
  });

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentTag[]>(creator.equipment);
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>(creator.styles);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEquipment = (item: EquipmentTag) => {
    setSelectedEquipment(prev =>
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const toggleStyle = (style: StyleTag) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/profile');
    }, 2000);
  };

  const isFormValid = formData.name && formData.bio && formData.location;

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
          <h1 className="text-xl font-bold text-ink">Editar Perfil</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!isFormValid || isSaving}
          className={cn(
            'px-4 py-2 rounded-xl font-medium transition-colors',
            isFormValid && !isSaving
              ? 'bg-coral text-white hover:bg-opacity-90'
              : 'bg-warm-gray-200 text-warm-gray-400 cursor-not-allowed'
          )}
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <Avatar
              src={formData.avatar}
              name={formData.name}
              size="xl"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-coral text-white rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-warm-gray-500 mt-3">
            Toque no ícone para trocar foto
          </p>
        </motion.div>
      </div>

      {/* Form Sections */}
      <div className="px-4 mt-6 space-y-4">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-coral" />
            Informações Básicas
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Conte um pouco sobre você e seu trabalho..."
                rows={3}
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors resize-none"
              />
              <p className="text-xs text-warm-gray-400 mt-1">
                {formData.bio?.length || 0}/300 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-coral" />
            Contato
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-coral" />
            Equipamentos
          </h3>
          <p className="text-sm text-warm-gray-500 mb-4">
            Selecione os equipamentos que você possui
          </p>

          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((item) => (
              <button
                key={item}
                onClick={() => toggleEquipment(item)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedEquipment.includes(item)
                    ? 'bg-coral text-white'
                    : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                )}
              >
                {selectedEquipment.includes(item) && (
                  <Check className="w-3 h-3 inline mr-1" />
                )}
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Styles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-card"
        >
          <h3 className="font-semibold text-ink mb-4">Estilos de Trabalho</h3>
          <p className="text-sm text-warm-gray-500 mb-4">
            Selecione seus estilos principais
          </p>

          <div className="flex flex-wrap gap-2">
            {styleOptions.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all capitalize',
                  selectedStyles.includes(style)
                    ? 'bg-sunshine text-ink'
                    : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
                )}
              >
                {selectedStyles.includes(style) && (
                  <Check className="w-3 h-3 inline mr-1" />
                )}
                {style}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <div className="px-4 mt-8 mb-8">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSave}
          disabled={!isFormValid || isSaving}
          leftIcon={isSaving ? undefined : <Check className="w-5 h-5" />}
        >
          {isSaving ? 'Salvando alterações...' : 'Salvar alterações'}
        </Button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 z-50"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Perfil atualizado!</p>
            <p className="text-sm text-white/80">Suas alterações foram salvas.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
