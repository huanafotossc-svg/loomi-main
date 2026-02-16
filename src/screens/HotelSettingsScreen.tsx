import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Shield,
  Moon,
  Globe,
  ChevronRight,
  Mail,
  Smartphone,
  User,
  Lock,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { Button, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

export function HotelSettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    darkMode: false,
    language: 'pt-BR',
    profileVisible: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/auth');
  };

  const settingSections = [
    {
      title: 'Notificações',
      items: [
        {
          icon: Mail,
          label: 'Notificações por email',
          key: 'emailNotifications' as const,
          description: 'Receba atualizações sobre candidaturas e mensagens'
        },
        {
          icon: Smartphone,
          label: 'Notificações push',
          key: 'pushNotifications' as const,
          description: 'Alertas em tempo real no seu dispositivo'
        },
        {
          icon: Bell,
          label: 'Emails de marketing',
          key: 'marketingEmails' as const,
          description: 'Novidades, dicas e ofertas especiais'
        },
      ]
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: Moon,
          label: 'Modo escuro',
          key: 'darkMode' as const,
          description: 'Interface com cores mais escuras'
        },
        {
          icon: Globe,
          label: 'Idioma',
          type: 'select' as const,
          value: 'Português (Brasil)',
          onClick: () => { }
        },
        {
          icon: User,
          label: 'Perfil público',
          key: 'profileVisible' as const,
          description: 'Permitir que creators vejam seu perfil'
        },
      ]
    },
  ];

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
        <h1 className="text-xl font-bold text-ink">Configurações</h1>
      </div>

      {/* Settings Sections */}
      <div className="px-4 mt-4 space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className={cn(
                    'flex items-center gap-4 p-4',
                    itemIndex !== section.items.length - 1 && 'border-b border-warm-gray-100'
                  )}
                >
                  <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-coral" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{item.label}</p>
                    {'description' in item && (
                      <p className="text-sm text-warm-gray-500">{item.description}</p>
                    )}
                    {'value' in item && (
                      <p className="text-sm text-warm-gray-500">{item.value}</p>
                    )}
                  </div>
                  {'key' in item ? (
                    <button
                      onClick={() => toggleSetting(item.key as keyof typeof settings)}
                      className={cn(
                        'w-12 h-7 rounded-full transition-colors relative',
                        settings[item.key as keyof typeof settings] ? 'bg-coral' : 'bg-warm-gray-300'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform',
                          settings[item.key as keyof typeof settings] ? 'left-6' : 'left-1'
                        )}
                      />
                    </button>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-warm-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
            Segurança
          </h2>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center gap-4 p-4 border-b border-warm-gray-100 hover:bg-warm-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-coral" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-ink">Alterar senha</p>
                <p className="text-sm text-warm-gray-500">Atualize sua senha de acesso</p>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-gray-400" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-red-600">Excluir conta</p>
                <p className="text-sm text-red-400">Esta ação não pode ser desfeita</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-card text-red-500 font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </motion.div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-warm-gray-400">Loomi v1.0.0</p>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sair da conta"
      >
        <p className="text-warm-gray-600 mb-6">
          Tem certeza que deseja sair da sua conta?
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir conta"
      >
        <div className="space-y-4">
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-red-600 text-sm">
              Atenção: Esta ação é irreversível. Todos os seus dados, vagas e histórico serão permanentemente removidos.
            </p>
          </div>
          <p className="text-warm-gray-600">
            Para confirmar, digite "EXCLUIR" abaixo:
          </p>
          <input
            type="text"
            placeholder="EXCLUIR"
            className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                setShowDeleteModal(false);
                navigate('/auth');
              }}
            >
              Excluir conta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Change Password Modal Component
function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar senha"
    >
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none pr-12"
          />
          <button
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400"
          >
            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none pr-12"
          />
          <button
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none pr-12"
          />
          <button
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray-400"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
