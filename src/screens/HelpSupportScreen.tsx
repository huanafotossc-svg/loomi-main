import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  Shield,
  CreditCard,
  User,
  Send
} from 'lucide-react';
import { Button, Modal } from '../components';
import { cn } from '../utils/helpers';

const faqCategories = [
  {
    id: 'getting-started',
    icon: FileText,
    title: 'Primeiros passos',
    questions: [
      { q: 'Como criar minha primeira vaga?', a: 'Acesse o Dashboard e clique em "Nova Vaga". Siga o wizard para configurar os detalhes da vaga.' },
      { q: 'Como escolher o tipo de pagamento?', a: 'Você pode oferecer Permuta (estadia), Cachê (dinheiro) ou Híbrido (ambos). Cada tipo atrai creators diferentes.' },
      { q: 'Quanto tempo leva para receber candidaturas?', a: 'Geralmente você começa a receber candidaturas nas primeiras 24-48 horas após publicar a vaga.' },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Pagamentos e faturamento',
    questions: [
      { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartões de crédito, boleto bancário e PIX para assinaturas.' },
      { q: 'Como funciona o pagamento para creators?', a: 'Para vagas com cachê, o pagamento é processado pela plataforma após a aprovação da entrega.' },
      { q: 'Posso cancelar minha assinatura?', a: 'Sim, você pode cancelar a qualquer momento. O acesso continua até o final do período pago.' },
    ],
  },
  {
    id: 'creators',
    icon: User,
    title: 'Trabalhando com creators',
    questions: [
      { q: 'Como avaliar um creator?', a: 'Analise o portfólio, equipamentos, avaliações anteriores e mensagem de proposta.' },
      { q: 'O que fazer se a entrega não atender?', a: 'Você pode solicitar ajustes diretamente na tela de revisão, explicando o que precisa ser corrigido.' },
      { q: 'Posso trabalhar com o mesmo creator novamente?', a: 'Sim! Após a primeira colaboração, você pode convidar o creator diretamente para novas vagas.' },
    ],
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Segurança e privacidade',
    questions: [
      { q: 'Meus dados estão seguros?', a: 'Sim, utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança.' },
      { q: 'Quem pode ver meu perfil?', a: 'Seu perfil é visível para creators apenas após você aceitar uma candidatura.' },
      { q: 'Como denunciar um comportamento inadequado?', a: 'Use o botão de denúncia no chat ou entre em contato com nosso suporte.' },
    ],
  },
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Chat ao vivo',
    description: 'Resposta em até 5 minutos',
    action: 'Iniciar chat',
    available: true,
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'suporte@loomi.com',
    action: 'Enviar email',
    available: true,
  },
  {
    icon: Phone,
    title: 'Telefone',
    description: '(11) 4000-1234',
    action: 'Ligar',
    available: false,
  },
];

export function HelpSupportScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0);

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setShowTicketModal(false);
      setTicketSubject('');
      setTicketMessage('');
      setTicketSubmitted(false);
    }, 2000);
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
        <h1 className="text-xl font-bold text-ink">Ajuda & Suporte</h1>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-400" />
          <input
            type="text"
            placeholder="Buscar ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-warm-gray-200 rounded-2xl focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      {/* Contact Methods */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-6"
        >
          <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
            Fale conosco
          </h2>
          <div className="space-y-3">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    method.available ? 'bg-coral/10' : 'bg-warm-gray-100'
                  )}>
                    <method.icon className={cn(
                      'w-6 h-6',
                      method.available ? 'text-coral' : 'text-warm-gray-400'
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-ink">{method.title}</h3>
                    <p className="text-sm text-warm-gray-500">{method.description}</p>
                  </div>
                  <button
                    onClick={() => method.title === 'Email' && setShowTicketModal(true)}
                    disabled={!method.available}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      method.available
                        ? 'bg-coral/10 text-coral hover:bg-coral/20'
                        : 'bg-warm-gray-100 text-warm-gray-400 cursor-not-allowed'
                    )}
                  >
                    {method.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FAQ Categories */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
                className="w-full flex items-center gap-4 p-4 hover:bg-warm-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-coral" />
                </div>
                <span className="flex-1 font-medium text-ink text-left">{category.title}</span>
                <ChevronRight className={cn(
                  'w-5 h-5 text-warm-gray-400 transition-transform',
                  expandedCategory === category.id && 'rotate-90'
                )} />
              </button>

              {expandedCategory === category.id && (
                <div className="border-t border-warm-gray-100">
                  {category.questions.map((item, index) => (
                    <div key={index} className="border-b border-warm-gray-100 last:border-0">
                      <button
                        onClick={() => setExpandedQuestion(
                          expandedQuestion === `${category.id}-${index}` ? null : `${category.id}-${index}`
                        )}
                        className="w-full p-4 text-left hover:bg-warm-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-ink">{item.q}</span>
                          <ChevronRight className={cn(
                            'w-4 h-4 text-warm-gray-400 transition-transform flex-shrink-0 ml-2',
                            expandedQuestion === `${category.id}-${index}` && 'rotate-90'
                          )} />
                        </div>
                      </button>
                      {expandedQuestion === `${category.id}-${index}` && (
                        <div className="px-4 pb-4">
                          <p className="text-warm-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Abrir chamado"
      >
        {!ticketSubmitted ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Assunto
              </label>
              <input
                type="text"
                placeholder="Ex: Problema com pagamento"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Mensagem
              </label>
              <textarea
                placeholder="Descreva seu problema em detalhes..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none resize-none"
                rows={5}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowTicketModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitTicket}
                disabled={!ticketSubject || !ticketMessage}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Enviar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Chamado enviado!</h3>
            <p className="text-warm-gray-600">
              Responderemos em até 24 horas úteis.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
