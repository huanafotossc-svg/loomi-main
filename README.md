# Loomi - Marketplace de Creators

Loomi é uma plataforma que conecta hotéis, pousadas e Airbnbs a fotógrafos, videomakers e creators para produção de conteúdo profissional.

## Funcionalidades

### Para Creators
- **Feed de Vagas**: Descubra oportunidades filtradas por tipo (permuta, cachê, híbrido), localização e equipamentos
- **Candidaturas**: Envie propostas com mensagem personalizada
- **Chat**: Comunique-se com hotéis após aceite da proposta
- **Portfólio**: Gerencie seus trabalhos e tags de estilo
- **Ganhos**: Acompanhe rendimentos em dinheiro e economia de viagens

### Para Hotéis
- **Dashboard**: Visão geral de vagas, candidaturas e métricas
- **Criação de Vagas**: Wizard guiado para publicar oportunidades
- **Gestão de Candidatos**: Aceite, recuse e converse com creators
- **Analytics**: Acompanhe valor de mídia gerado e economia estimada
- **Revisão de Entregas**: Aprove ou solicite ajustes nas entregas

## Stack Tecnológica

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **React Router** (navegação)
- **Tailwind CSS** (estilos)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

## Design System

### Paleta "Sunset Creator"
- **Fundo**: Warm Porcelain `#FAFAF9`
- **Texto**: Ink Black `#18181B`
- **Primária**: Spicy Coral `#FF5A5F`
- **Destaque**: Sunshine Yellow `#FBBF24`
- **Semânticas**:
  - Permuta: Verde suave `#22C55E`
  - Cachê: Azul suave `#3B82F6`
  - Híbrido: Roxo suave `#A855F7`

### Características Visuais
- Cantos arredondados grandes (24px-32px)
- Cards com sombra suave
- Bottom navigation com efeito vidro fosco
- Micro-interações em todos os elementos clicáveis

## Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
├── screens/          # Páginas da aplicação
├── layouts/          # Layouts por tipo de usuário
├── context/          # Contextos React (auth, etc)
├── data/             # Dados mockados
├── types/            # Tipos TypeScript
└── utils/            # Helpers e utilitários
```

## Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd loomi

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Acesso
- Abra `http://localhost:5173` no navegador
- Use qualquer email e senha (mín. 4 caracteres) para login de demo
- Escolha o perfil (Creator ou Hotel) no onboarding

## Páginas Principais

### Institucional
- `/` - Landing Page institucional e conversão

### Fluxo Creator
- `/auth` - Login/Cadastro
- `/onboarding` - Seleção de perfil
- `/feed` - Feed de vagas
- `/job/:id` - Detalhes da vaga
- `/chat` - Conversas
- `/profile` - Perfil do creator
- `/applications` - Minhas candidaturas
- `/saved` - Vagas salvas
- `/earnings` - Meus ganhos

### Fluxo Hotel
- `/dashboard` - Dashboard do hotel
- `/create-job` - Criar nova vaga
- `/jobs` - Gerenciar vagas
- `/applicants` - Lista de candidatos
- `/analytics` - Relatórios

## Mock Data

O projeto inclui dados mockados para demonstração:
- 6 creators com diferentes estilos e equipamentos
- 6 hotéis com diversas características
- 8 vagas com variações de tipo (permuta, cachê, híbrido)
- Candidaturas, chats e notificações de exemplo

## Recursos de Acessibilidade

- Foco visível em todos os elementos interativos
- Labels em botões e inputs
- Atributos ARIA em modais
- Contraste adequado de cores

## Licença

MIT
