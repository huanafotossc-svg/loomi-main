import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Crown,
  UserCog,
  Eye,
  Mail,
  X,
  Check,
} from 'lucide-react';
import { Button, Modal, Avatar } from '../components';
import { mockTeamMembers } from '../data/mock';
import { cn } from '../utils/helpers';
import type { TeamMember } from '../types';

const roleLabels: Record<string, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  manager: 'Gerente',
  viewer: 'Visualizador',
};

const roleColors: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  manager: 'bg-green-100 text-green-700',
  viewer: 'bg-warm-gray-100 text-warm-gray-600',
};

const permissionLabels: Record<string, string> = {
  jobs_create: 'Criar vagas',
  jobs_edit: 'Editar vagas',
  jobs_delete: 'Excluir vagas',
  applications_view: 'Ver candidaturas',
  applications_approve: 'Aprovar candidaturas',
  billing_view: 'Ver faturamento',
  billing_manage: 'Gerenciar faturamento',
  team_manage: 'Gerenciar equipe',
};

export function TeamManagementScreen() {
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'viewer'>('viewer');

  const handleInvite = () => {
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      hotelId: 'hotel-1',
      userId: `user-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      permissions: inviteRole === 'manager'
        ? ['jobs_create', 'jobs_edit', 'applications_view', 'applications_approve']
        : ['applications_view'],
      joinedAt: new Date(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    setShowMemberModal(false);
  };

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
          <h1 className="text-xl font-bold text-ink">Equipe</h1>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="p-2 bg-coral text-white rounded-full hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Team Info */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-br from-coral to-coral/80 rounded-2xl p-5 text-white">
          <h2 className="text-lg font-semibold mb-2">Gerencie sua equipe</h2>
          <p className="text-white/80 text-sm">
            {teamMembers.length} membro{teamMembers.length !== 1 ? 's' : ''} na equipe
          </p>
          <div className="flex gap-2 mt-4">
            <div className="px-3 py-1.5 bg-white/20 rounded-lg text-sm">
              {teamMembers.filter(m => m.role === 'owner').length} Proprietário
            </div>
            <div className="px-3 py-1.5 bg-white/20 rounded-lg text-sm">
              {teamMembers.filter(m => m.role === 'manager').length} Gerente
            </div>
          </div>
        </div>
      </div>

      {/* Team List */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Membros
        </h2>
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <Avatar src={member.avatar} name={member.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-ink truncate">{member.name}</h3>
                    {member.role === 'owner' && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-warm-gray-500 truncate">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', roleColors[member.role])}>
                      {roleLabels[member.role]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setShowMemberModal(true);
                  }}
                  className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-warm-gray-400" />
                </button>
              </div>

              {/* Permissions Preview */}
              <div className="mt-3 pt-3 border-t border-warm-gray-100">
                <div className="flex flex-wrap gap-1">
                  {member.permissions.slice(0, 3).map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 bg-warm-gray-100 rounded-lg text-xs text-warm-gray-600"
                    >
                      {permissionLabels[perm]}
                    </span>
                  ))}
                  {member.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-warm-gray-100 rounded-lg text-xs text-warm-gray-600">
                      +{member.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Convidar membro"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Email do convidado
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" />
              <input
                type="email"
                placeholder="nome@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Função
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setInviteRole('manager')}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left',
                  inviteRole === 'manager'
                    ? 'border-coral bg-coral/5'
                    : 'border-warm-gray-200 hover:border-coral/50'
                )}
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCog className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">Gerente</p>
                  <p className="text-sm text-warm-gray-500">Pode criar vagas e aprovar candidaturas</p>
                </div>
                {inviteRole === 'manager' && <Check className="w-5 h-5 text-coral" />}
              </button>

              <button
                onClick={() => setInviteRole('viewer')}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left',
                  inviteRole === 'viewer'
                    ? 'border-coral bg-coral/5'
                    : 'border-warm-gray-200 hover:border-coral/50'
                )}
              >
                <div className="w-10 h-10 bg-warm-gray-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-warm-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">Visualizador</p>
                  <p className="text-sm text-warm-gray-500">Apenas visualiza candidaturas</p>
                </div>
                {inviteRole === 'viewer' && <Check className="w-5 h-5 text-coral" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowInviteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleInvite}
              disabled={!inviteEmail}
            >
              Convidar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Member Actions Modal */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title={selectedMember?.name || 'Membro'}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-warm-gray-50 rounded-xl">
              <Avatar src={selectedMember.avatar} name={selectedMember.name} size="lg" />
              <div>
                <p className="font-medium text-ink">{selectedMember.name}</p>
                <p className="text-sm text-warm-gray-500">{selectedMember.email}</p>
                <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1', roleColors[selectedMember.role])}>
                  {roleLabels[selectedMember.role]}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-ink mb-2">Permissões</p>
              <div className="flex flex-wrap gap-2">
                {selectedMember.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-3 py-1.5 bg-warm-gray-100 rounded-lg text-sm text-warm-gray-600"
                  >
                    {permissionLabels[perm]}
                  </span>
                ))}
              </div>
            </div>

            {selectedMember.role !== 'owner' && (
              <button
                onClick={() => handleRemoveMember(selectedMember.id)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-xl text-red-600 font-medium hover:bg-red-100 transition-colors"
              >
                <X className="w-5 h-5" />
                Remover da equipe
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
