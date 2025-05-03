# ChatPrompt

Uma aplicação web interativa para conversas com um assistente especializado em engenharia de prompt, desenvolvida com Next.js, React e TypeScript.

![ChatPrompt Screenshot](https://github.com/ryanlopesx2024/ChatPrompt/raw/main/public/screenshot.png)

## 📋 Sobre o Projeto

ChatPrompt é uma interface de chat moderna que permite aos usuários conversar com um assistente especializado em engenharia de prompt. A aplicação oferece pré-prompts úteis para iniciar conversas sobre técnicas, melhores práticas e estratégias de engenharia de prompt.

### ✨ Funcionalidades

- **Pré-prompts Especializados**: Inicie conversas com perguntas pré-definidas sobre engenharia de prompt
- **Histórico de Conversas**: Todas as conversas são salvas localmente para referência futura
- **Interface Responsiva**: Design moderno e adaptável para desktop e dispositivos móveis
- **Upload de Arquivos**: Envie arquivos para análise durante a conversa
- **Autenticação Simplificada**: Sistema de login para manter suas conversas seguras

## 🚀 Tecnologias Utilizadas

- **Frontend**:
  - Next.js 14
  - React
  - TypeScript
  - TailwindCSS
  - Shadcn UI

- **Backend**:
  - Python
  - FastAPI
  - OpenAI API

## 🛠️ Instalação e Uso

### Pré-requisitos

- Node.js 18+
- Python 3.9+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ryanlopesx2024/ChatPrompt.git
cd ChatPrompt
```

2. Instale as dependências do frontend:
```bash
npm install
# ou
yarn install
```

3. Instale as dependências do backend:
```bash
cd backend
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto para o frontend
   - Crie um arquivo `.env` na pasta backend para as configurações do backend

5. Inicie o servidor de desenvolvimento:
```bash
# Terminal 1 (Frontend)
npm run dev
# ou
yarn dev

# Terminal 2 (Backend)
cd backend
python main.py
```

6. Acesse a aplicação em `http://localhost:3000`

## 🧠 Engenharia de Prompt

O ChatPrompt é especialmente projetado para ajudar no aprendizado e prática de engenharia de prompt. Oferecemos pré-prompts sobre:

- Boas práticas em prompt engineering
- Técnicas de prompt em cadeia
- Ajuste de formato de resposta
- Erros comuns em prompts
- Uso de contexto no prompt
- Avaliação de prompts
- Personalização de prompts
- Automação da geração de prompts
- Técnicas avançadas de prompt engineering

## 📁 Estrutura do Projeto

```
ChatPrompt/
├── app/                  # Páginas da aplicação Next.js
│   ├── chat/             # Interface principal de chat
│   ├── login/            # Página de login
│   └── settings/         # Configurações do usuário
├── backend/              # API Python/FastAPI
├── components/           # Componentes React reutilizáveis
├── contexts/             # Contextos React (gerenciamento de estado)
├── lib/                  # Utilitários e funções auxiliares
├── public/               # Arquivos estáticos
└── styles/               # Estilos globais
```

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em token JWT. Para desenvolvimento, um usuário padrão é configurado:

- Email: ia@gmail.com
- Senha: senha123

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Ryan Lopes - [@ryanlopesx2024](https://github.com/ryanlopesx2024)

Link do projeto: [https://github.com/ryanlopesx2024/ChatPrompt](https://github.com/ryanlopesx2024/ChatPrompt)
