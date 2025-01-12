# IVI LAW - Sistema de Gestão de Processos

Sistema web para gestão de processos jurídicos desenvolvido com Next.js 13, TypeScript e Tailwind CSS.

## Funcionalidades

- 📋 Gestão completa de processos jurídicos
- 🔍 Busca e filtros avançados
- 📊 Exportação de dados para Excel
- 👥 Gerenciamento de clientes
- 📅 Controle de prazos
- 🔔 Sistema de notificações
- 📱 Interface responsiva

## Tecnologias

- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- TanStack Table
- Lucide Icons
- XLSX

## Instalação

# Clone o repositório
git clone https://github.com/seu-usuario/ivi-law.git

# Entre no diretório
cd ivi-law

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev

## Estrutura do Projeto
```
src/
  ├── app/              # Rotas e layouts
  ├── components/       # Componentes React
  │   ├── common/      # Componentes compartilhados
  │   ├── ui/          # Componentes de UI base
  │   └── processos/   # Componentes específicos
  ├── hooks/           # Custom hooks
  ├── lib/             # Bibliotecas e configurações
  └── utils/           # Funções utilitárias
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter

## Licença

Este projeto está sob a licença MIT.