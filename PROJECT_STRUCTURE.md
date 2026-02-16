# Estrutura do Projeto Loomi

## Arquivos Criados

### Configuração
- `package.json` - Dependências e scripts
- `vite.config.ts` - Configuração do Vite
- `tsconfig.json` - Configuração TypeScript
- `tailwind.config.js` - Configuração Tailwind CSS
- `postcss.config.js` - Configuração PostCSS
- `index.html` - HTML principal
- `eslint.config.js` - Configuração ESLint

### Estilos Globais
- `src/index.css` - Estilos globais, fontes e variáveis CSS

### Tipos
- `src/types/index.ts` - Todos os tipos TypeScript (User, Job, Application, etc.)

### Mock Data
- `src/data/mock.ts` - Dados mockados (creators, hotéis, jobs, aplicações, chats, etc.)

### Utilitários
- `src/utils/helpers.ts` - Funções auxiliares (formatCurrency, formatDate, cn, etc.)

### Context
- `src/context/AuthContext.tsx` - Contexto de autenticação

### Componentes (`src/components/`)
- `Button.tsx` - Botões com variantes
- `Input.tsx` - Inputs, TextArea, Select
- `Badge.tsx` - Badges (JobType, ApplicationStatus, Rating)
- `Avatar.tsx` - Avatar e AvatarGroup
- `BottomNav.tsx` - Navegação inferior
- `Card.tsx` - JobCard, FeaturedJobCard, CreatorCard, HotelCard
- `Modal.tsx` - Modal, BottomSheet, Toast
- `Header.tsx` - Headers variados
- `FilterPills.tsx` - Filtros em pílulas
- `EmptyState.tsx` - Estados vazios
- `index.ts` - Exportações

### Layouts (`src/layouts/`)
- `CreatorLayout.tsx` - Layout para creators
- `HotelLayout.tsx` - Layout para hotéis
- `AuthLayout.tsx` - Layout para autenticação
- `index.ts` - Exportações

### Telas (`src/screens/`)

#### Auth
- `AuthScreen.tsx` - Login/Cadastro
- `OnboardingScreen.tsx` - Seleção de perfil

#### Creator
- `FeedScreen.tsx` - Feed de vagas
- `JobDetailsScreen.tsx` - Detalhes da vaga
- `ChatScreen.tsx` - Chat
- `CreatorProfileScreen.tsx` - Perfil do creator
- `SavedJobsScreen.tsx` - Vagas salvas
- `ApplicationsScreen.tsx` - Minhas candidaturas
- `SearchDiscoveryScreen.tsx` - Busca e descoberta
- `NotificationsScreen.tsx` - Notificações
- `EarningsScreen.tsx` - Meus ganhos

#### Hotel
- `HotelDashboardScreen.tsx` - Dashboard do hotel
- `CreateJobWizard.tsx` - Wizard de criação de vaga
- `JobManagementScreen.tsx` - Gerenciamento de vagas
- `ApplicantsListScreen.tsx` - Lista de candidatos

### App Principal
- `src/App.tsx` - Rotas principais
- `src/main.tsx` - Ponto de entrada

## Funcionalidades Implementadas

### Fluxo de Autenticação
- Login com email/senha
- Login social (Google, Apple - simulado)
- Onboarding com seleção de perfil (Creator/Hotel)
- Seleção de tipo de Creator (Creator/Pro)
- Persistência de sessão no localStorage

### Fluxo Creator
- Feed de vagas com filtros
- Cards de vagas com imagens, badges e informações
- Toggle entre visualização em lista e mapa
- Detalhes completos da vaga
- Envio de proposta com mensagem
- Sistema de chat (com bloqueio de contatos antes do aceite)
- Perfil com estatísticas e ganhos
- Lista de candidaturas com status
- Vagas salvas
- Notificações
- Busca por vagas, creators e hotéis

### Fluxo Hotel
- Dashboard com métricas e resumo
- Wizard de criação de vagas (6 passos)
- Gerenciamento de vagas (ativar, pausar, encerrar)
- Lista de candidatos com aceite/recusa
- Chat com creators aceitos

### Design System
- Paleta "Sunset Creator" implementada
- Cantos arredondados grandes (24-32px)
- Sombras suaves
- Bottom navigation com efeito vidro fosco
- Micro-interações em todos os elementos
- Animações com Framer Motion

### Acessibilidade
- Foco visível em elementos interativos
- Labels em botões e inputs
- Atributos ARIA em modais
- Contraste adequado

## Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173`

4. Use qualquer email e senha (mín. 4 caracteres) para login de demo

## Notas

- O projeto usa dados mockados para demonstração
- Todas as rotas estão configuradas e funcionais
- O design segue fielmente as referências visuais fornecidas
- O app é responsivo, com layout centralizado tipo "iPhone" no desktop
