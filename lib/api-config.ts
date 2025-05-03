// Configuração da API
// Altere esta URL quando implantar o backend no Railway
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Função para normalizar URLs e evitar barras duplas
export const normalizeUrl = (baseUrl: string, path: string): string => {
  // Remove barras do final da baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/*$/, '');
  // Remove barras do início do path
  const cleanPath = path.replace(/^\/+/, '');
  // Junta com uma única barra
  return `${cleanBaseUrl}/${cleanPath}`;
};

// Verificar se o backend está disponível
export const isBackendAvailable = async (): Promise<boolean> => {
  try {
    // Tenta fazer uma requisição OPTIONS para verificar se o backend está respondendo
    // Usa a função normalizeUrl para evitar barras duplas
    const loginUrl = normalizeUrl(API_URL, 'login');
    console.log('Verificando disponibilidade do backend em:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Aceita 200 OK, 404 Not Found ou 405 Method Not Allowed como sinais de que o servidor está rodando
    // (404 pode acontecer se o endpoint não existe, 405 se o método OPTIONS não é suportado)
    return response.ok || response.status === 404 || response.status === 405;
    
  } catch (error) {
    console.warn('Backend não disponível, usando dados mockados:', error);
    return false;
  }
};

// Dados mockados para quando o backend não estiver disponível
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8xIiwiZW1haWwiOiJpYUBnbWFpbC5jb20ifQ.8ZxuiCN4NpTLXYiQrPHQYDYjdWCzQOYASJQXCXAwrmQ";

// Função para simular atraso em respostas mockadas
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Funções de API reutilizáveis
export async function loginUser(email: string, password: string) {
  // Verifica se o backend está disponível
  const backendAvailable = await isBackendAvailable();
  
  if (backendAvailable) {
    try {
      const loginUrl = normalizeUrl(API_URL, 'login');
      console.log('Fazendo login em:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }
      
      return response.json();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Fallback para dados mockados se houver erro na requisição
      await mockDelay();
      return { token: MOCK_TOKEN, user_id: "user_1" };
    }
  } else {
    // Usar dados mockados quando o backend não estiver disponível
    await mockDelay();
    if (email === "ia@gmail.com" && password === "senha123") {
      return { token: MOCK_TOKEN, user_id: "user_1" };
    } else {
      throw new Error("Credenciais inválidas");
    }
  }
}

export async function sendChatMessage(message: string, threadId?: string, token?: string) {
  // Verifica se o backend está disponível
  const backendAvailable = await isBackendAvailable();
  
  if (backendAvailable) {
    try {
      const chatUrl = normalizeUrl(API_URL, 'chat');
      console.log('Enviando mensagem para:', chatUrl);
      
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          thread_id: threadId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Fallback para dados mockados
      await mockDelay(1000);
      return {
        response: `Resposta simulada para: "${message}". O backend não está disponível no momento, então estou gerando uma resposta local. Por favor, verifique se o servidor backend está rodando em ${API_URL} ou atualize a variável de ambiente NEXT_PUBLIC_API_URL para apontar para o backend correto.`,
        thread_id: threadId || "mock_thread_" + Date.now(),
        message_id: "mock_msg_" + Date.now()
      };
    }
  } else {
    // Usar dados mockados quando o backend não estiver disponível
    await mockDelay(1000);
    return {
      response: `Resposta simulada para: "${message}". O backend não está disponível no momento, então estou gerando uma resposta local. Por favor, verifique se o servidor backend está rodando em ${API_URL} ou atualize a variável de ambiente NEXT_PUBLIC_API_URL para apontar para o backend correto.`,
      thread_id: threadId || "mock_thread_" + Date.now(),
      message_id: "mock_msg_" + Date.now()
    };
  }
}

export async function uploadAttachment(file: File, token: string) {
  // Verifica se o backend está disponível
  const backendAvailable = await isBackendAvailable();
  
  if (backendAvailable) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const attachmentsUrl = normalizeUrl(API_URL, 'attachments');
      console.log('Enviando arquivo para:', attachmentsUrl);
      
      const response = await fetch(attachmentsUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      // Fallback para dados mockados
      await mockDelay(800);
      return {
        file_id: "mock_file_" + Date.now(),
        filename: file.name,
        size: file.size,
        content_type: file.type
      };
    }
  } else {
    // Usar dados mockados quando o backend não estiver disponível
    await mockDelay(800);
    return {
      file_id: "mock_file_" + Date.now(),
      filename: file.name,
      size: file.size,
      content_type: file.type
    };
  }
}
