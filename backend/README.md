# ChatPrompt Backend

Este é o backend da aplicação ChatPrompt, desenvolvido com FastAPI e pronto para ser implantado no Railway.

## Implantação no Railway

### Pré-requisitos

Para implantar este backend no Railway, você precisará:

1. Uma conta no [Railway](https://railway.app/)
2. Uma conta na OpenAI com acesso à API

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Railway:

- `OPENAI_API_KEY`: Sua chave da API OpenAI
- `OPENAI_ASSISTANT_ID`: ID do assistente OpenAI
- `APP_EMAIL`: Email para login (padrão: ia@gmail.com)
- `APP_PASSWORD`: Senha para login (padrão: senha123)

### Passos para Implantação

1. Faça login no Railway
2. Crie um novo projeto
3. Selecione "Deploy from GitHub"
4. Conecte seu repositório GitHub
5. Selecione a pasta `/backend` como diretório raiz
6. Configure as variáveis de ambiente mencionadas acima
7. Implante o projeto

O Railway detectará automaticamente o `Procfile` e executará o servidor usando Uvicorn.

## Desenvolvimento Local

Para executar o backend localmente:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

O servidor estará disponível em `http://localhost:8000`.

## Endpoints da API

- `POST /login`: Autenticação de usuário
- `POST /chat`: Envio de mensagens para o assistente
- `POST /attachments`: Upload de arquivos para análise

## Configuração do Frontend

Após a implantação, atualize as URLs de API no frontend para apontar para o backend implantado:

```typescript
// Exemplo: Atualizar de http://localhost:8000 para https://seu-backend.railway.app
const API_URL = "https://seu-backend.railway.app";
```
