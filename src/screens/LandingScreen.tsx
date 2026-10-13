import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Hotel,
  Camera,
  Video,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  Compass,
  Heart,
  Award,
  ArrowUpRight,
  Zap,
  Users,
  Building2,
  Gift,
  DollarSign,
  Shuffle,
  Menu,
  X,
  Play
} from 'lucide-react';
import { mockJobs, mockCreators } from '../data/mock';

export function LandingScreen() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState<'hotels' | 'creators'>('hotels');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredJobs = mockJobs.slice(0, 3);
  const featuredCreators = mockCreators.slice(0, 3);

  const faqs = [
    {
      question: 'Como funciona a garantia de entrega das fotos e vídeos para o hotel?',
      answer:
        'No Loomi, todas as parcerias contam com briefing detalhado de entregáveis (quantidade mínima de fotos editadas em alta resolução, reels e prazo de entrega). O criador faz o upload diretamente pela central de entregas da plataforma e o hotel revisa e aprova o material antes da conclusão do projeto.',
    },
    {
      question: 'Os hotéis têm direitos de uso comercial das imagens e vídeos?',
      answer:
        'Sim! Todas as propostas aceitas na plataforma incluem termo padrão de cessão de direitos de imagem para uso em redes sociais, sites oficiais, anúncios pagos e materiais promocionais do hotel, pousada ou anfitrião parceiro.',
    },
    {
      question: 'O criador precisa pagar para se cadastrar e se candidatar?',
      answer:
        'O cadastro inicial e as candidaturas a vagas abertas são gratuitos para criadores de conteúdo, fotógrafos e videomakers. Você cria seu portfólio, insere seus equipamentos e pode se candidatar diretamente a vagas de permuta, cachê ou híbridas.',
    },
    {
      question: 'Quem arca com o transporte e despesas de deslocamento?',
      answer:
        'As condições de deslocamento são transparentes em cada vaga. Muitas vagas cobrem alimentação e transfer local, enquanto o transporte aéreo ou rodoviário até a cidade pode ser negociado na proposta ou ser de responsabilidade do criador, dependendo do modelo (permuta ou cachê).',
    },
    {
      question: 'Quais tipos de hospedagens podem anunciar no Loomi?',
      answer:
        'Hotéis boutique, pousadas de charme, resorts, chalés de montanha, glampings e anfitriões profissionais de Airbnb/aluguel por temporada que buscam elevar a qualidade do seu material visual e atrair mais reservas diretas.',
    },
  ];

  return (
    <div className="min-h-screen bg-linen text-ink flex flex-col selection:bg-coral selection:text-white">
      {/* Top Floating / Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-linen/85 backdrop-blur-md border-b border-warm-gray-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-coral rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-2xl font-editorial">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-ink font-editorial">Loomi</span>
              <span className="text-[10px] uppercase font-semibold text-terracotta tracking-wider -mt-1">
                Creators & Hospitality
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone">
            <a href="#como-funciona" className="hover:text-coral transition-colors">
              Como Funciona
            </a>
            <a href="#modelos" className="hover:text-coral transition-colors">
              Modelos de Parceria
            </a>
            <a href="#vagas" className="hover:text-coral transition-colors">
              Vagas Abertas
            </a>
            <a href="#creators" className="hover:text-coral transition-colors">
              Criadores
            </a>
            <a href="#faq" className="hover:text-coral transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-ink hover:text-coral hover:bg-warm-gray-100 transition-all"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-coral text-white shadow-soft hover:bg-coral/90 hover:shadow-card hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-warm-gray-100 text-stone hover:text-ink transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-warm-gray-200 bg-porcelain px-6 py-6 shadow-floating"
            >
              <div className="flex flex-col gap-4 text-base font-medium text-stone">
                <a
                  href="#como-funciona"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-coral py-2 border-b border-warm-gray-100"
                >
                  Como Funciona
                </a>
                <a
                  href="#modelos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-coral py-2 border-b border-warm-gray-100"
                >
                  Modelos de Parceria
                </a>
                <a
                  href="#vagas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-coral py-2 border-b border-warm-gray-100"
                >
                  Vagas Abertas
                </a>
                <a
                  href="#creators"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-coral py-2 border-b border-warm-gray-100"
                >
                  Criadores
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-coral py-2"
                >
                  Dúvidas Frequentes
                </a>
                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full py-3 rounded-2xl border border-warm-gray-300 font-semibold text-ink text-center"
                  >
                    Entrar na Conta
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full py-3 rounded-2xl bg-coral text-white font-semibold text-center shadow-soft"
                  >
                    Cadastre-se Grátis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-coral/15 via-sunshine/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-forest/5 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-coral-100 border border-coral/20 text-coral text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                <Sparkles className="w-4 h-4 text-coral animate-pulse" />
                <span>O marketplace pioneiro de conteúdo para hospitalidade</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-ink tracking-tight leading-[1.15] mb-6">
                Conecte seu hotel aos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-terracotta to-coral">
                  melhores criadores
                </span>{' '}
                de conteúdo do Brasil.
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-warm-gray-600 leading-relaxed max-w-2xl mb-8">
                Pousadas, hotéis boutique e resorts encontram fotógrafos e videomakers qualificados.
                Produção audiovisual de alto impacto em modelos de{' '}
                <strong className="text-ink font-semibold">Permuta de Hospedagem</strong>,{' '}
                <strong className="text-ink font-semibold">Cachê</strong> ou{' '}
                <strong className="text-ink font-semibold">Híbrido</strong>.
              </p>

              {/* Dual CTA Buttons */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 rounded-2xl bg-coral text-white font-semibold text-base shadow-card hover:bg-coral/90 hover:shadow-floating hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
                >
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  <span>Sou Criador / Fotógrafo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 rounded-2xl bg-white border border-warm-gray-300 text-ink font-semibold text-base hover:bg-warm-gray-50 hover:border-warm-gray-400 hover:-translate-y-0.5 shadow-soft transition-all flex items-center justify-center gap-3"
                >
                  <Building2 className="w-5 h-5 text-forest" />
                  <span>Cadastrar meu Hotel / Pousada</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-warm-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta" />
                  <span>Sem burocracia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta" />
                  <span>Cessão de direitos inclusa</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta" />
                  <span>Criadores verificados</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Mockup / Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Main Visual Card */}
              <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-floating border border-warm-gray-200/80">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
                    alt="Pousada de Luxo"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-coral shadow-xs">
                      Vaga em Destaque
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-ink/70 backdrop-blur-md text-white flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Pousada Reserva do Mar</p>
                      <p className="text-xs text-warm-gray-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-coral" /> Trancoso, Bahia
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-permuta text-white text-xs font-semibold">
                      Permuta 3 Noites
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray-500">
                      Entregáveis Solicitados:
                    </span>
                    <span className="text-xs font-bold text-forest">12 vagas candidatas</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-linen border border-warm-gray-200/60 text-center">
                      <Camera className="w-4 h-4 text-coral mx-auto mb-1" />
                      <p className="text-xs font-semibold text-ink">40 Fotos</p>
                      <p className="text-[10px] text-warm-gray-500">Alta Resolução</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-linen border border-warm-gray-200/60 text-center">
                      <Video className="w-4 h-4 text-cache mx-auto mb-1" />
                      <p className="text-xs font-semibold text-ink">4 Reels</p>
                      <p className="text-[10px] text-warm-gray-500">Tendências 9:16</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-linen border border-warm-gray-200/60 text-center">
                      <Sparkles className="w-4 h-4 text-sunshine mx-auto mb-1" />
                      <p className="text-xs font-semibold text-ink">Drone 4K</p>
                      <p className="text-[10px] text-warm-gray-500">Aéreas do Mar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Creator Profile Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-floating border border-warm-gray-200 max-w-[260px] hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop"
                    alt="Criadora de conteúdo"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-coral"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-ink leading-tight">Ana Silva</h4>
                    <p className="text-xs text-warm-gray-500">Fotógrafa de Hotelaria</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-sunshine text-sunshine" />
                      <span className="text-xs font-bold text-ink">4.9</span>
                      <span className="text-[11px] text-warm-gray-400">(83 ensaios)</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Media Value Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 -right-4 sm:-right-6 bg-forest text-white rounded-2xl px-4 py-3 shadow-floating border border-forest/20 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-sunshine" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-warm-gray-300">
                    Retorno Estimado
                  </span>
                </div>
                <p className="text-lg font-bold leading-none font-editorial">R$ 18.500</p>
                <p className="text-[10px] text-warm-gray-300 mt-1">em valor de mídia gerada</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-porcelain border-y border-warm-gray-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold font-editorial text-ink mb-1">350+</span>
              <span className="text-xs sm:text-sm font-medium text-warm-gray-600">
                Pousadas, Hotéis & Resorts
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold font-editorial text-coral mb-1">1.200+</span>
              <span className="text-xs sm:text-sm font-medium text-warm-gray-600">
                Criadores & Fotógrafos Pro
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold font-editorial text-forest mb-1">
                R$ 2.4M+
              </span>
              <span className="text-xs sm:text-sm font-medium text-warm-gray-600">
                Em Economia & Valor de Mídia
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <span className="text-3xl sm:text-4xl font-bold font-editorial text-ink">4.9</span>
                <Star className="w-6 h-6 fill-sunshine text-sunshine inline-block" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-warm-gray-600">
                Avaliação Média dos Projetos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Modalities of Partnership */}
      <section id="modelos" className="py-20 md:py-28 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-4 py-1.5 rounded-full bg-soft-coral-100 text-coral text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Flexibilidade Total
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink mb-4">
              Três formatos pensados para a realidade de cada hospedagem.
            </h2>
            <p className="text-warm-gray-600 text-base sm:text-lg">
              Você escolhe como quer negociar. Sem modelos engessados, garantindo acordos ganha-ganha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Permuta Card */}
            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-card hover:shadow-floating transition-all flex flex-col relative group">
              <div className="w-14 h-14 rounded-2xl bg-permuta/10 text-permuta flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-permuta/10 text-permuta mb-3 self-start">
                100% Permuta
              </div>
              <h3 className="text-2xl font-editorial font-bold text-ink mb-3">
                Hospedagem por Conteúdo
              </h3>
              <p className="text-warm-gray-600 text-sm leading-relaxed mb-6 flex-1">
                O criador recebe diárias gratuitas com café da manhã e experiências no local,
                entregando fotos e vídeos de alta qualidade para o banco de imagens do hotel.
              </p>
              <ul className="space-y-2.5 text-xs text-warm-gray-700 border-t border-warm-gray-100 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta shrink-0" />
                  <span>Ideal para pousadas com diárias ociosas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta shrink-0" />
                  <span>Criadores viajam e expandem portfólio</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-permuta shrink-0" />
                  <span>Custo marginal quase zero para o hotel</span>
                </li>
              </ul>
            </div>

            {/* Híbrido Card */}
            <div className="bg-white rounded-3xl p-8 border-2 border-coral shadow-floating relative flex flex-col group scale-100 md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-soft">
                Mais Popular
              </div>
              <div className="w-14 h-14 rounded-2xl bg-hibrido/10 text-hibrido flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shuffle className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-hibrido/10 text-hibrido mb-3 self-start">
                Híbrido (Diárias + Cachê)
              </div>
              <h3 className="text-2xl font-editorial font-bold text-ink mb-3">
                O Melhor dos Dois Mundos
              </h3>
              <p className="text-warm-gray-600 text-sm leading-relaxed mb-6 flex-1">
                Combina a estadia de charme com uma remuneração financeira combinada para produções
                mais elaboradas, que exigem drone homologado ou equipes dedicadas.
              </p>
              <ul className="space-y-2.5 text-xs text-warm-gray-700 border-t border-warm-gray-100 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-hibrido shrink-0" />
                  <span>Atrai os criadores mais experientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-hibrido shrink-0" />
                  <span>Entregas completas: Reels + Drone + Still</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-hibrido shrink-0" />
                  <span>Cachê acessível complementado por diárias</span>
                </li>
              </ul>
            </div>

            {/* Cachê Card */}
            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-card hover:shadow-floating transition-all flex flex-col relative group">
              <div className="w-14 h-14 rounded-2xl bg-cache/10 text-cache flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cache/10 text-cache mb-3 self-start">
                Cachê Integral
              </div>
              <h3 className="text-2xl font-editorial font-bold text-ink mb-3">
                Produção Sob Demanda
              </h3>
              <p className="text-warm-gray-600 text-sm leading-relaxed mb-6 flex-1">
                Pagamento exclusivamente em dinheiro para campanhas comerciais fechadas, lançamentos
                de novas instalações ou fotos técnicas de cardápio e infraestrutura.
              </p>
              <ul className="space-y-2.5 text-xs text-warm-gray-700 border-t border-warm-gray-100 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cache shrink-0" />
                  <span>Sem necessidade de ceder hospedagem</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cache shrink-0" />
                  <span>Foco em entregas técnicas imediatas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cache shrink-0" />
                  <span>Profissionais locais ou regionais</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (Interactive Tabs: Para Hotéis vs Para Creators) */}
      <section id="como-funciona" className="py-20 md:py-28 bg-porcelain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-4 py-1.5 rounded-full bg-warm-gray-200 text-stone text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Passo a Passo
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink mb-4">
              Como funciona o Loomi
            </h2>
            <p className="text-warm-gray-600 text-base sm:text-lg mb-8">
              Um processo seguro e intuitivo, feito sob medida tanto para quem hospeda quanto para quem cria.
            </p>

            {/* Audience Tabs */}
            <div className="inline-flex p-1.5 bg-warm-gray-200/80 rounded-2xl">
              <button
                onClick={() => setActiveAudienceTab('hotels')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeAudienceTab === 'hotels'
                    ? 'bg-white text-ink shadow-soft'
                    : 'text-stone hover:text-ink'
                }`}
              >
                <Hotel className="w-4 h-4 text-coral" />
                <span>Para Hotéis & Pousadas</span>
              </button>
              <button
                onClick={() => setActiveAudienceTab('creators')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeAudienceTab === 'creators'
                    ? 'bg-white text-ink shadow-soft'
                    : 'text-stone hover:text-ink'
                }`}
              >
                <Camera className="w-4 h-4 text-coral" />
                <span>Para Creators & Fotógrafos</span>
              </button>
            </div>
          </div>

          {/* Steps Content */}
          <div className="mt-8">
            {activeAudienceTab === 'hotels' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Publique sua Oportunidade</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    Em menos de 3 minutos, crie sua vaga informando datas da estadia, requisitos
                    (ex: drone, 4K, fotos verticais) e comodidades inclusas.
                  </p>
                  <span className="text-xs font-semibold text-terracotta">Wizard guiado e simples</span>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Avalie Propostas e Portfólios</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    Receba candidaturas com histórico de avaliações, galeria de trabalhos anteriores
                    e equipamentos cadastrados. Aceite o criador que combina com seu estilo.
                  </p>
                  <span className="text-xs font-semibold text-terracotta">Chat integrado pós-aceite</span>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Receba e Aprove o Conteúdo</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    O creator envia os arquivos em alta resolução pela plataforma. Você aprova, faz o
                    download e já começa a alimentar suas redes sociais e site.
                  </p>
                  <span className="text-xs font-semibold text-terracotta">Contratos de cessão inclusos</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Monte seu Perfil de Destaque</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    Cadastre seus equipamentos (câmeras, lentes, drones), seus estilos preferidos
                    (lifestyle, gastronomia, arquitetura) e seu portfólio visual.
                  </p>
                  <span className="text-xs font-semibold text-coral">Destaque suas especialidades</span>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Candidate-se a Destinos Incríveis</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    Explore vagas em todo o Brasil filtrando por tipo de benefício (permuta com
                    acompanhante, cachê ou diárias de lazer) e mande sua proposta.
                  </p>
                  <span className="text-xs font-semibold text-coral">Notificações em tempo real</span>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
                  <div className="w-12 h-12 rounded-2xl bg-coral/10 text-coral font-bold text-xl flex items-center justify-center mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Viaje, Crie e Lucre</h3>
                  <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                    Viva a experiência da hospedagem, produza com liberdade criativa, entregue o material
                    pela plataforma e acumule avaliações 5 estrelas e ganhos.
                  </p>
                  <span className="text-xs font-semibold text-coral">Construa reputação no mercado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Jobs Showcase */}
      <section id="vagas" className="py-20 md:py-28 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="px-4 py-1.5 rounded-full bg-soft-coral-100 text-coral text-xs font-bold uppercase tracking-wider inline-block mb-3">
                Oportunidades em Aberto
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink">
                Vagas recentes publicadas por hotéis
              </h2>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-coral font-semibold hover:text-coral/80 transition-colors"
            >
              <span>Ver todas as oportunidades</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate('/auth')}
                className="bg-white rounded-3xl overflow-hidden border border-warm-gray-200 shadow-card hover:shadow-floating hover:-translate-y-1 transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={job.coverImage}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-xs ${
                        job.type === 'permuta'
                          ? 'bg-permuta'
                          : job.type === 'cache'
                          ? 'bg-cache'
                          : 'bg-hibrido'
                      }`}
                    >
                      {job.type === 'permuta'
                        ? 'Permuta'
                        : job.type === 'cache'
                        ? 'Cachê'
                        : 'Híbrido'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-ink/75 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coral" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-ink line-clamp-1 mb-2 group-hover:text-coral transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-warm-gray-600 text-xs line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>
                  </div>

                  <div className="border-t border-warm-gray-100 pt-4 flex items-center justify-between text-xs">
                    <span className="text-warm-gray-500">
                      {job.applicationsCount} candidatos interessados
                    </span>
                    <span className="font-semibold text-coral flex items-center gap-1">
                      Candidatar-se <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Why Loomi vs Instagram DMs */}
      <section className="py-20 md:py-28 bg-porcelain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-4 py-1.5 rounded-full bg-warm-gray-200 text-stone text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Comparativo Real
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink mb-4">
              Por que abandonar parcerias amadoras pelo Instagram?
            </h2>
            <p className="text-warm-gray-600 text-base sm:text-lg">
              Veja a diferença entre tentar negociar por mensagens diretas e usar a plataforma Loomi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-soft">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-warm-gray-100">
                <div className="w-10 h-10 rounded-xl bg-warm-gray-100 text-warm-gray-500 flex items-center justify-center font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="font-bold text-lg text-ink">Pelo Direct do Instagram</h3>
                  <p className="text-xs text-warm-gray-500">O jeito arriscado e amador</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-warm-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Mensagens perdidas no spam ou caixas lotadas de solicitações.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sem garantia de entrega do material após a hospedagem do criador.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sem termo de cessão de direitos autorais para anúncios ou site.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Impossível verificar a qualidade técnica dos equipamentos com antecedência.</span>
                </li>
              </ul>
            </div>

            {/* The Loomi Way */}
            <div className="bg-forest text-white rounded-3xl p-8 shadow-floating border border-forest/20 relative">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-sunshine text-ink flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Com a Plataforma Loomi</h3>
                  <p className="text-xs text-warm-gray-300">Profissional, seguro e transparente</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-warm-gray-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sunshine shrink-0" />
                  <span>Briefing claro com quantidade exata de fotos, vídeos e prazos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sunshine shrink-0" />
                  <span>Ambiente dedicado de upload, revisão e aprovação dos arquivos em alta.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sunshine shrink-0" />
                  <span>Termos de cessão de imagem pré-configurados e juridicamente alinhados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sunshine shrink-0" />
                  <span>Portfólio verificado com notas, histórico e lista técnica de equipamentos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-4 py-1.5 rounded-full bg-soft-coral-100 text-coral text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Depoimentos
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink mb-4">
              O que diz quem já usa o Loomi
            </h2>
            <p className="text-warm-gray-600 text-base sm:text-lg">
              Histórias reais de quem transformou sua presença digital ou viajou o país criando conteúdo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-sunshine mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sunshine" />
                  ))}
                </div>
                <p className="text-sm text-warm-gray-700 italic leading-relaxed mb-6">
                  "Renovamos todo o acervo visual da nossa pousada em Búzios. Em vez de contratar uma
                  agência por uma fortuna, fizemos duas permutas e um híbrido pelo Loomi. O retorno em
                  reservas diretas foi imediato!"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-warm-gray-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop"
                  alt="Vila Marítima"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-ink">Ricardo Mendes</h4>
                  <p className="text-xs text-warm-gray-500">Gerente, Vila Marítima (Búzios)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-sunshine mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sunshine" />
                  ))}
                </div>
                <p className="text-sm text-warm-gray-700 italic leading-relaxed mb-6">
                  "O Loomi mudou minha rotina profissional. Já viajei para Campos do Jordão e Trancoso,
                  fiquei em suítes maravilhosas e ainda recebi cachê de produção. É a união ideal de
                  trabalho e lazer."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-warm-gray-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Pedro Costa"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-ink">Pedro Costa</h4>
                  <p className="text-xs text-warm-gray-500">Videomaker & Criador de Conteúdo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-warm-gray-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-sunshine mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sunshine" />
                  ))}
                </div>
                <p className="text-sm text-warm-gray-700 italic leading-relaxed mb-6">
                  "A segurança de ter as entregas registradas e poder ver os equipamentos do fotógrafo
                  antes de fechar o acordo nos deu total tranquilidade. Uma ferramenta indispensável
                  para qualquer anfitrião."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-warm-gray-100 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=100&h=100&fit=crop"
                  alt="Refúgio na Montanha"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-ink">Mariana Salles</h4>
                  <p className="text-xs text-warm-gray-500">Proprietária, Refúgio na Montanha</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 md:py-28 bg-porcelain">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-warm-gray-200 text-stone text-xs font-bold uppercase tracking-wider inline-block mb-3">
              Tira-Dúvidas
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-ink mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-warm-gray-600 text-base">
              Tudo o que você precisa saber sobre parcerias, segurança e operação no Loomi.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-warm-gray-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left font-semibold text-ink flex items-center justify-between gap-4 hover:text-coral transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <span className="p-1 rounded-full bg-warm-gray-100 text-stone">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 text-sm text-warm-gray-600 leading-relaxed border-t border-warm-gray-100 pt-4"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Big Final CTA Banner */}
      <section className="py-16 md:py-24 bg-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest rounded-[36px] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden shadow-floating">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sunshine/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-sunshine text-xs font-bold uppercase tracking-wider inline-block mb-4 backdrop-blur-sm">
                Faça Parte da Revolução da Hospitalidade
              </span>
              <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-white mb-6 leading-tight">
                Pronto para transformar as imagens e os resultados da sua hospedagem?
              </h2>
              <p className="text-warm-gray-200 text-base sm:text-lg mb-10 leading-relaxed">
                Junte-se a centenas de pousadas e criadores apaixonados por viagens e boas histórias.
                Comece gratuitamente hoje mesmo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-coral text-white font-semibold text-base shadow-card hover:bg-coral/90 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Cadastrar Gratuitamente</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 text-white border border-white/20 font-semibold text-base hover:bg-white/20 transition-all"
                >
                  Entrar na Plataforma
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-porcelain border-t border-warm-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-coral rounded-2xl flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-xl font-editorial">L</span>
                </div>
                <span className="font-bold text-2xl text-ink font-editorial">Loomi</span>
              </div>
              <p className="text-xs text-warm-gray-600 leading-relaxed">
                O marketplace que conecta hotéis, pousadas e resorts a criadores de conteúdo e fotógrafos
                para produções de alto impacto.
              </p>
            </div>

            {/* Col 2: Para Hotéis */}
            <div>
              <h4 className="font-bold text-sm text-ink mb-4 uppercase tracking-wider">Para Hotéis</h4>
              <ul className="space-y-2.5 text-xs text-warm-gray-600">
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Publicar Nova Vaga
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Explorar Portfólio de Criadores
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Calculadora de Mídia
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Dashboard & Métricas
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Para Creators */}
            <div>
              <h4 className="font-bold text-sm text-ink mb-4 uppercase tracking-wider">Para Creators</h4>
              <ul className="space-y-2.5 text-xs text-warm-gray-600">
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Feed de Vagas Abertas
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Vagas de Permuta
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Vagas com Cachê
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Dicas de Portfólio de Hotelaria
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Institucional & Legal */}
            <div>
              <h4 className="font-bold text-sm text-ink mb-4 uppercase tracking-wider">Institucional</h4>
              <ul className="space-y-2.5 text-xs text-warm-gray-600">
                <li>
                  <button onClick={() => navigate('/terms')} className="hover:text-coral transition-colors">
                    Termos de Uso & Privacidade
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/help')} className="hover:text-coral transition-colors">
                    Central de Ajuda & Suporte
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/auth')} className="hover:text-coral transition-colors">
                    Acesso à Plataforma
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-warm-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Loomi Tecnologias para Hotelaria. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com carinho para o ecossistema de viagens e criadores de conteúdo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
