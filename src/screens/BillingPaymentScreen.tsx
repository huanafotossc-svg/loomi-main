import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Check,
  Download,
  FileText,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { Button, Modal } from '../components';
import { mockInvoices } from '../data/mock';
import { cn, formatCurrency, formatDate } from '../utils/helpers';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Para começar',
    features: [
      '1 vaga ativa',
      '5 candidaturas/mês',
      'Suporte por email',
      'Perfil básico',
    ],
    color: 'bg-warm-gray-100',
    textColor: 'text-warm-gray-600',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    description: 'Mais popular',
    features: [
      'Vagas ilimitadas',
      'Candidaturas ilimitadas',
      'Suporte prioritário',
      'Perfil destacado',
      'Analytics básico',
      'Chat integrado',
    ],
    color: 'bg-coral',
    textColor: 'text-white',
    badge: 'Seu plano',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 799,
    description: 'Para grandes operações',
    features: [
      'Tudo do Pro',
      'Múltiplos usuários',
      'API access',
      'Analytics avançado',
      'Gerente dedicado',
      'Integrações',
    ],
    color: 'bg-ink',
    textColor: 'text-white',
  },
];

export function BillingPaymentScreen() {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [invoices] = useState(mockInvoices);
  const currentPlan = 'pro';

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    alert(`Upgrade para o plano ${selectedPlan} simulado!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-warm-gray-100 text-warm-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return status;
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
        <h1 className="text-xl font-bold text-ink">Faturamento</h1>
      </div>

      {/* Current Plan */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-coral to-coral/80 rounded-2xl p-5 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="text-white/80 text-sm">Plano atual</span>
              </div>
              <h2 className="text-2xl font-bold">Pro</h2>
              <p className="text-white/80">{formatCurrency(299)}/mês</p>
            </div>
            <div className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
              Ativo
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Próxima cobrança</span>
              <span>01/01/2025</span>
            </div>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="mt-4 w-full py-3 bg-white text-coral rounded-xl font-medium hover:bg-opacity-90 transition-colors"
          >
            Alterar plano
          </button>
        </motion.div>
      </div>

      {/* Payment Method */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Forma de pagamento
        </h2>
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">Visa terminando em 4242</p>
              <p className="text-sm text-warm-gray-500">Expira 12/26</p>
            </div>
            <button className="text-coral text-sm font-medium">
              Alterar
            </button>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Histórico de faturas
        </h2>
        <div className="space-y-2">
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warm-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-warm-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">{invoice.description}</p>
                    <p className="text-sm text-warm-gray-500">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink">{formatCurrency(invoice.amount)}</p>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(invoice.status))}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>
              </div>
              {invoice.status === 'paid' && (
                <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-coral text-sm font-medium hover:bg-coral/5 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Uso do plano
        </h2>
        <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-warm-gray-600">Vagas ativas</span>
              <span className="text-sm font-medium text-ink">3 / Ilimitado</span>
            </div>
            <div className="h-2 bg-warm-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-coral rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-warm-gray-600">Candidaturas este mês</span>
              <span className="text-sm font-medium text-ink">12 / Ilimitado</span>
            </div>
            <div className="h-2 bg-warm-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/5 bg-coral rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-warm-gray-600">Membros da equipe</span>
              <span className="text-sm font-medium text-ink">3 / Ilimitado</span>
            </div>
            <div className="h-2 bg-warm-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-coral rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Escolha seu plano"
        size="lg"
      >
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                'relative p-4 rounded-2xl border-2 cursor-pointer transition-all',
                selectedPlan === plan.id
                  ? 'border-coral bg-coral/5'
                  : 'border-warm-gray-200 hover:border-coral/50',
                plan.popular && 'ring-2 ring-coral ring-offset-2'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-coral text-white text-xs font-medium rounded-full">
                  Mais popular
                </div>
              )}
              {plan.id === currentPlan && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-coral rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', plan.color)}>
                  {plan.id === 'starter' && <Building2 className={cn('w-6 h-6', plan.textColor)} />}
                  {plan.id === 'pro' && <Zap className={cn('w-6 h-6', plan.textColor)} />}
                  {plan.id === 'enterprise' && <Sparkles className={cn('w-6 h-6', plan.textColor)} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{plan.name}</h3>
                    {plan.id === currentPlan && (
                      <span className="px-2 py-0.5 bg-coral/10 text-coral text-xs font-medium rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warm-gray-500">{plan.description}</p>
                  <p className="text-lg font-bold text-ink mt-1">
                    {plan.price === 0 ? 'Grátis' : formatCurrency(plan.price) + '/mês'}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-warm-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowUpgradeModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleUpgrade}
              disabled={!selectedPlan || selectedPlan === currentPlan}
            >
              {selectedPlan === currentPlan ? 'Plano atual' : 'Confirmar upgrade'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
