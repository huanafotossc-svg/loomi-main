import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Lock,
  User,
  Shield,
  AlertTriangle,
  ChevronRight,
  Globe,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Button, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: {
    id: string;
    label: string;
    description?: string;
    type: 'toggle' | 'link' | 'select' | 'action';
    value?: boolean;
    options?: string[];
    action?: () => void;
    danger?: boolean;
  }[];
}

export function CreatorSettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    messageAlerts: true,
    marketingEmails: false,

    // Privacy
    publicProfile: true,
    showEarnings: false,
    showLocation: true,
    allowMessages: true,

    // Preferences
    darkMode: false,
    autoTranslate: false,
    compactView: false,

    // Job Preferences
    acceptPermuta: true,
    acceptCache: true,
    acceptHibrido: true,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) return;
    setPasswordChanged(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordChanged(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    logout();
    navigate('/auth');
  };

  const settingSections: SettingSection[] = [
    {
      id: 'notifications',
      title: 'Notificações',
      icon: Bell,
      items: [
        { id: 'emailNotifications', label: 'Email', description: 'Receber notificações por email', type: 'toggle', value: settings.emailNotifications },
        { id: 'pushNotifications', label: 'Push', description: 'Notificações no celular', type: 'toggle', value: settings.pushNotifications },
        { id: 'jobAlerts', label: 'Alertas de vagas', description: 'Novas vagas compatíveis', type: 'toggle', value: settings.jobAlerts },
        { id: 'messageAlerts', label: 'Mensagens', description: 'Quando receber mensagens', type: 'toggle', value: settings.messageAlerts },
        { id: 'marketingEmails', label: 'Marketing', description: 'Novidades e promoções', type: 'toggle', value: settings.marketingEmails },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: Shield,
      items: [
        { id: 'publicProfile', label: 'Perfil público', description: 'Qualquer pessoa pode ver seu perfil', type: 'toggle', value: settings.publicProfile },
        { id: 'showEarnings', label: 'Mostrar ganhos', description: 'Exibir ganhos no perfil', type: 'toggle', value: settings.showEarnings },
        { id: 'showLocation', label: 'Mostrar localização', description: 'Exibir cidade no perfil', type: 'toggle', value: settings.showLocation },
        { id: 'allowMessages', label: 'Permitir mensagens', description: 'Hotéis podem iniciar conversas', type: 'toggle', value: settings.allowMessages },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferências de Job',
      icon: User,
      items: [
        { id: 'acceptPermuta', label: 'Permuta', description: 'Aceitar vagas de permuta (estadia)', type: 'toggle', value: settings.acceptPermuta },
        { id: 'acceptCache', label: 'Cachê', description: 'Aceitar vagas com pagamento', type: 'toggle', value: settings.acceptCache },
        { id: 'acceptHibrido', label: 'Híbrido', description: 'Aceitar vagas mistas', type: 'toggle', value: settings.acceptHibrido },
      ],
    },
    {
      id: 'app',
      title: 'Aplicativo',
      icon: User,
      items: [
        { id: 'darkMode', label: 'Modo escuro', description: 'Tema escuro do app', type: 'toggle', value: settings.darkMode },
        { id: 'compactView', label: 'Visual compacto', description: 'Cards menores no feed', type: 'toggle', value: settings.compactView },
      ],
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
      <div className="px-4 mt-4 space-y-4">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
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
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between px-5 py-4',
                    itemIndex !== section.items.length - 1 && 'border-b border-warm-gray-100'
                  )}
                >
                  <div className="flex-1">
                    <p className="font-medium text-ink">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-warm-gray-500">{item.description}</p>
                    )}
                  </div>

                  {item.type === 'toggle' && (
                    <button
                      onClick={() => toggleSetting(item.id as keyof typeof settings)}
                      className={cn(
                        'w-12 h-7 rounded-full transition-colors relative',
                        item.value ? 'bg-coral' : 'bg-warm-gray-300'
                      )}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full absolute top-1"
                        animate={{ left: item.value ? 'calc(100% - 1.5rem)' : '0.25rem' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
            Conta
          </h2>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-warm-gray-100 hover:bg-warm-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-ink">Alterar senha</p>
                  <p className="text-sm text-warm-gray-500">Atualize sua senha de acesso</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-gray-400" />
            </button>

            <button
              onClick={() => navigate('/terms')}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-warm-gray-100 hover:bg-warm-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-ink">Termos e privacidade</p>
                  <p className="text-sm text-warm-gray-500">Leia os termos de uso</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-gray-400" />
            </button>

            <button
              onClick={() => navigate('/help')}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-warm-gray-100 hover:bg-warm-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-coral" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-ink">Ajuda e suporte</p>
                  <p className="text-sm text-warm-gray-500">Central de ajuda</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-gray-400" />
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-warm-gray-100 hover:bg-warm-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warm-gray-100 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-warm-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-ink">Sair da conta</p>
                  <p className="text-sm text-warm-gray-500">Desconectar do app</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-gray-400" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-500">Excluir conta</p>
                  <p className="text-sm text-red-400">Remover permanentemente</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-sm text-warm-gray-400">Loomi v1.0.0</p>
          <p className="text-xs text-warm-gray-300 mt-1">2026 Loomi Technologies</p>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Alterar senha"
      >
        {!passwordChanged ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Senha atual
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none pr-12"
                />
                <button
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  {passwordVisible ? (
                    <EyeOff className="w-5 h-5 text-warm-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-warm-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Nova senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-gray-600 mb-2">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handlePasswordChange}
                disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              >
                Alterar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Senha alterada!</h3>
            <p className="text-warm-gray-600">Sua senha foi atualizada com sucesso.</p>
          </div>
        )}
      </Modal>

      {/* Logout Confirmation */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Sair da conta?"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-warm-gray-600" />
          </div>
          <p className="text-warm-gray-600 mb-6">
            Tem certeza que deseja sair da sua conta?
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowLogoutConfirm(false)}
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
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir conta?"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">Atenção!</h3>
          <p className="text-warm-gray-600 mb-4">
            Esta ação não pode ser desfeita. Todos os seus dados, incluindo portfólio, candidaturas e histórico serão permanentemente removidos.
          </p>
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600">
              Digite "EXCLUIR" para confirmar:
            </p>
            <input
              type="text"
              placeholder="EXCLUIR"
              className="w-full mt-2 px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-500 focus:outline-none text-center"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleDeleteAccount}
            >
              Excluir minha conta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
