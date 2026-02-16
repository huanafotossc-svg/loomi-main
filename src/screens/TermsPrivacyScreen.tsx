import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  ChevronRight,
  Check,
  ExternalLink
} from 'lucide-react';
import { cn } from '../utils/helpers';

type TabType = 'terms' | 'privacy' | 'cookies' | 'gdpr';

const termsSections = [
  {
    id: 'acceptance',
    title: '1. Aceitação dos Termos',
    content: `Ao acessar e usar a plataforma Loomi, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não poderá usar nossos serviços.

A Loomi é uma plataforma que conecta criadores de conteúdo a estabelecimentos hoteleiros para produção de conteúdo visual. Ao usar nossa plataforma, você reconhece que leu, entendeu e aceita estar vinculado a estes termos.`
  },
  {
    id: 'definitions',
    title: '2. Definições',
    content: `- "Plataforma" refere-se ao website e aplicativos móveis da Loomi
- "Creator" é o profissional de criação de conteúdo registrado na plataforma
- "Hotel" ou "Pousada" é o estabelecimento hoteleiro registrado
- "Job" ou "Vaga" é uma oportunidade de trabalho publicada por um hotel
- "Aplicação" é a candidatura de um creator a uma vaga
- "Entrega" são os materiais produzidos pelo creator e entregues ao hotel`
  },
  {
    id: 'accounts',
    title: '3. Contas de Usuário',
    content: `Para usar a Loomi, você deve criar uma conta fornecendo informações precisas, completas e atualizadas. Você é responsável por:

- Manter a confidencialidade de sua senha
- Todas as atividades que ocorrem em sua conta
- Notificar imediatamente qualquer uso não autorizado
- Garantir que suas informações de perfil sejam verdadeiras

Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.`
  },
  {
    id: 'hotels',
    title: '4. Obrigações dos Hotéis',
    content: `Ao publicar vagas na Loomi, os hotéis concordam em:

- Fornecer descrições precisas das necessidades de conteúdo
- Cumprir com os benefícios oferecidos (estadia, cachê, etc.)
- Revisar e responder às candidaturas em tempo hábil
- Fornecer acesso adequado às instalações durante as datas acordadas
- Utilizar o conteúdo apenas conforme acordado com o creator
- Não solicitar trabalho adicional sem compensação adequada`
  },
  {
    id: 'creators',
    title: '5. Obrigações dos Creators',
    content: `Ao se candidatarem a vagas, os creators concordam em:

- Fornecer informações verdadeiras sobre suas habilidades e equipamentos
- Entregar o conteúdo conforme especificações da vaga
- Cumprir prazos acordados ou comunicar atrasos antecipadamente
- Manter profissionalismo durante as estadias
- Respeitar as regras e políticas do estabelecimento
- Garantir que possuem direitos sobre o conteúdo entregue`
  },
  {
    id: 'payments',
    title: '6. Pagamentos e Taxas',
    content: `A Loomi oferece planos de assinatura para hotéis e pode cobrar taxas sobre transações. Ao usar nossos serviços de pagamento:

- Hotéis com vagas de cachê devem fazer o pagamento através da plataforma
- Creators recebem pagamentos conforme cronograma estabelecido
- Taxas de serviço são deduzidas automaticamente
- Reembolsos são processados conforme nossa política de cancelamento
- Disputas de pagamento serão analisadas caso a caso`
  },
  {
    id: 'content',
    title: '7. Propriedade Intelectual',
    content: `Sobre o conteúdo produzido através da plataforma:

- Creators mantêm os direitos autorais até a aprovação final
- Após aprovação, os direitos de uso são transferidos conforme contrato
- Hotéis não podem revender ou sublicenciar o conteúdo sem autorização
- A Loomi pode usar conteúdo anônimo para marketing com permissão
- Conteúdo que viole direitos de terceiros será removido`
  },
  {
    id: 'liability',
    title: '8. Limitação de Responsabilidade',
    content: `A Loomi atua como intermediária e não é responsável por:

- Qualidade do conteúdo produzido (avaliações da comunidade servem como guia)
- Conduta dos usuários durante colaborações
- Danos a equipamentos ou propriedades durante produções
- Atrasos ou cancelamentos por parte dos usuários
- Perdas financeiras resultantes de transações entre usuários

Nossa responsabilidade máxima está limitada ao valor pago em taxas à plataforma.`
  },
  {
    id: 'termination',
    title: '9. Rescisão',
    content: `Qualquer parte pode rescindir sua relação com a Loomi:

- Usuários podem excluir suas contas a qualquer momento
- A Loomi pode suspender contas que violem estes termos
- Conteúdo pendente deve ser entregue antes da rescisão
- Pagamentos pendentes serão processados conforme calendário
- Algumas obrigações sobrevivem à rescisão (indemnização, confidencialidade)`
  },
  {
    id: 'changes',
    title: '10. Alterações nos Termos',
    content: `Podemos modificar estes termos a qualquer momento. Alterações significativas serão notificadas:

- Por email 30 dias antes da vigência
- Através de notificação na plataforma
- Publicação na seção de termos atualizada

O uso continuado da plataforma após alterações constitui aceitação dos novos termos.`
  }
];

const privacySections = [
  {
    id: 'collection',
    title: '1. Informações que Coletamos',
    content: `Coletamos os seguintes tipos de informações:

**Informações de Cadastro:**
- Nome, email, telefone
- Tipo de conta (creator ou hotel)
- Informações de perfil profissional

**Informações de Uso:**
- Log de atividades na plataforma
- Interações com outros usuários
- Preferências e configurações

**Informações de Pagamento:**
- Dados de cartões de crédito (processados de forma segura)
- Histórico de transações
- Informações fiscais quando necessário

**Informações do Dispositivo:**
- Endereço IP, tipo de navegador
- Sistema operacional
- Identificadores de dispositivo móvel`
  },
  {
    id: 'usage',
    title: '2. Como Usamos suas Informações',
    content: `Utilizamos suas informações para:

- Fornecer e melhorar nossos serviços
- Processar transações e pagamentos
- Conectar creators e hotéis adequadamente
- Enviar notificações relevantes sobre vagas e candidaturas
- Personalizar sua experiência na plataforma
- Analisar padrões de uso para melhorias
- Prevenir fraudes e atividades suspeitas
- Cumprir obrigações legais e regulatórias`
  },
  {
    id: 'sharing',
    title: '3. Compartilhamento de Informações',
    content: `Compartilhamos informações com:

**Entre Usuários:**
- Creators veem informações públicas de hotéis e vagas
- Hotéis veem informações de perfil de creators candidatos
- Informações de contato são compartilhadas após match

**Provedores de Serviço:**
- Processadores de pagamento
- Serviços de hospedagem em nuvem
- Ferramentas de análise

**Requisitos Legais:**
- Quando exigido por lei ou ordem judicial
- Para proteger nossos direitos legais
- Em caso de fusão ou aquisição

Nunca vendemos seus dados pessoais a terceiros.`
  },
  {
    id: 'security',
    title: '4. Segurança dos Dados',
    content: `Implementamos medidas de segurança robustas:

- Criptografia SSL/TLS para transmissão de dados
- Armazenamento criptografado em servidores seguros
- Autenticação de dois fatores disponível
- Monitoramento contínuo de segurança
- Backups regulares e redundantes
- Acesso restrito a funcionários autorizados

Embora nos esforcemos para proteger seus dados, nenhum sistema é 100% seguro. Notificaremos você em caso de violação de dados.`
  },
  {
    id: 'rights',
    title: '5. Seus Direitos',
    content: `Você tem os seguintes direitos sobre seus dados:

**Direito de Acesso:**
- Solicitar cópia dos dados que mantemos sobre você

**Direito de Retificação:**
- Corrigir informações imprecisas ou incompletas

**Direito de Exclusão:**
- Solicitar a exclusão de seus dados pessoais

**Direito de Portabilidade:**
- Receber seus dados em formato estruturado

**Direito de Oposição:**
- Optar por não receber comunicações de marketing

Para exercer esses direitos, entre em contato conosco através da seção de suporte.`
  },
  {
    id: 'retention',
    title: '6. Retenção de Dados',
    content: `Mantemos seus dados pelo tempo necessário:

- Contas ativas: enquanto a conta estiver ativa
- Contas excluídas: até 2 anos para obrigações legais
- Dados de transações: 5 anos (requisito fiscal)
- Logs de sistema: até 1 ano

Após esses períodos, os dados são anonimizados ou excluídos de forma segura.`
  },
  {
    id: 'cookies',
    title: '7. Cookies e Tecnologias Similares',
    content: `Usamos cookies para:

- Manter sua sessão de login
- Lembrar suas preferências
- Analisar uso da plataforma
- Personalizar conteúdo e anúncios

Você pode gerenciar cookies através das configurações do navegador. Note que desativar cookies pode afetar a funcionalidade da plataforma.`
  },
  {
    id: 'children',
    title: '8. Privacidade de Crianças',
    content: `Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente informações de crianças. Se você acredita que uma criança nos forneceu dados pessoais, entre em contato imediatamente para remoção.`
  },
  {
    id: 'international',
    title: '9. Transferências Internacionais',
    content: `Seus dados podem ser transferidos e processados em servidores localizados fora do seu país. Garantimos que tais transferências cumpram com as leis de proteção de dados aplicáveis, incluindo cláusulas contratuais padrão quando necessário.`
  },
  {
    id: 'contact',
    title: '10. Contato sobre Privacidade',
    content: `Para questões relacionadas à privacidade:

- Email: privacidade@loomi.com
- Endereço: Av. Paulista, 1000 - São Paulo, SP
- DPO: dpo@loomi.com

Responderemos às solicitações em até 30 dias.`
  }
];

const cookiePolicy = {
  title: 'Política de Cookies',
  sections: [
    {
      title: 'O que são Cookies?',
      content: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita websites. Eles nos ajudam a fornecer, proteger e melhorar nossos serviços.'
    },
    {
      title: 'Tipos de Cookies que Usamos',
      content: `- **Essenciais:** Necessários para o funcionamento básico da plataforma
- **Funcionais:** Lembram suas preferências e configurações
- **Analíticos:** Nos ajudam a entender como você usa a plataforma
- **Marketing:** Usados para personalizar comunicações (com seu consentimento)`
    },
    {
      title: 'Gerenciamento de Cookies',
      content: 'Você pode gerenciar suas preferências de cookies através do banner de cookies ou das configurações do navegador. Note que desativar cookies essenciais pode impedir o uso da plataforma.'
    }
  ]
};

const gdprInfo = {
  title: 'LGPD/GDPR',
  sections: [
    {
      title: 'Conformidade com a LGPD',
      content: 'A Loomi está em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil. Processamos dados pessoais com base em consentimento explícito, execução de contrato ou interesse legítimo.'
    },
    {
      title: 'Base Legal para Processamento',
      content: `- Execução de contrato (prestação de serviços)
- Consentimento explícito do titular
- Cumprimento de obrigação legal
- Interesse legítimo (segurança, prevenção de fraudes)`
    },
    {
      title: 'Seus Direitos sob a LGPD',
      content: `Você tem direito a:
- Confirmar a existência de tratamento
- Acessar seus dados
- Corrigir dados incompletos ou desatualizados
- Anonimizar, bloquear ou eliminar dados desnecessários
- Portabilidade dos dados
- Eliminação dos dados pessoais
- Informação sobre compartilhamento
- Revogar consentimento`
    },
    {
      title: 'Encarregado de Dados (DPO)',
      content: 'Nosso DPO pode ser contatado em dpo@loomi.com para questões relacionadas à proteção de dados pessoais, exercício de direitos ou reclamações.'
    }
  ]
};

export function TermsPrivacyScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('terms');
  const [expandedSection, setExpandedSection] = useState<string | null>('acceptance');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);

  const tabs = [
    { id: 'terms' as TabType, label: 'Termos de Serviço', icon: FileText },
    { id: 'privacy' as TabType, label: 'Privacidade', icon: Shield },
    { id: 'cookies' as TabType, label: 'Cookies', icon: FileText },
    { id: 'gdpr' as TabType, label: 'LGPD/GDPR', icon: Shield },
  ];

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'terms':
        return termsSections;
      case 'privacy':
        return privacySections;
      case 'cookies':
        return cookiePolicy.sections.map((s, i) => ({ id: `cookie-${i}`, title: s.title, content: s.content }));
      case 'gdpr':
        return gdprInfo.sections.map((s, i) => ({ id: `gdpr-${i}`, title: s.title, content: s.content }));
      default:
        return [];
    }
  };

  const handleAccept = () => {
    setAcceptedTerms(true);
    setShowAcceptanceModal(true);
    setTimeout(() => {
      setShowAcceptanceModal(false);
      navigate(-1);
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
        <h1 className="text-xl font-bold text-ink">Termos & Privacidade</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-1.5 shadow-card flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedSection(null);
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-coral text-white'
                    : 'text-warm-gray-600 hover:bg-warm-gray-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Last Updated */}
      <div className="px-4 mt-4">
        <p className="text-sm text-warm-gray-500 text-center">
          Última atualização: 15 de Janeiro de 2026
        </p>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-3">
        {getCurrentContent().map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
              className="w-full flex items-center justify-between p-4 hover:bg-warm-gray-50 transition-colors"
            >
              <span className="font-medium text-ink text-left">{section.title}</span>
              <ChevronRight className={cn(
                'w-5 h-5 text-warm-gray-400 transition-transform flex-shrink-0 ml-2',
                expandedSection === section.id && 'rotate-90'
              )} />
            </button>
            
            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-warm-gray-100"
              >
                <div className="p-4">
                  <p className="text-warm-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* External Links */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <h3 className="font-medium text-ink mb-3">Links úteis</h3>
          <div className="space-y-2">
            <a 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                alert('PDF download em breve');
              }}
            >
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-coral" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">Termos de Serviço (PDF)</p>
                <p className="text-sm text-warm-gray-500">Versão completa para download</p>
              </div>
              <ExternalLink className="w-5 h-5 text-warm-gray-400" />
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                alert('PDF download em breve');
              }}
            >
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-coral" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">Política de Privacidade (PDF)</p>
                <p className="text-sm text-warm-gray-500">Versão completa para download</p>
              </div>
              <ExternalLink className="w-5 h-5 text-warm-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Acceptance Button */}
      {!acceptedTerms && (
        <div className="px-4 mt-6">
          <button
            onClick={handleAccept}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-coral text-white rounded-2xl font-medium hover:bg-opacity-90 transition-colors"
          >
            <Check className="w-5 h-5" />
            Li e aceito os termos
          </button>
          <p className="text-center text-sm text-warm-gray-500 mt-3">
            Ao aceitar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showAcceptanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Termos aceitos!</h3>
            <p className="text-warm-gray-600">
              Obrigado por aceitar nossos termos. Você pode continuar usando a Loomi.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
