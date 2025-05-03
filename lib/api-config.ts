// Configuração da API
// Altere esta URL quando implantar o backend no Railway
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Funções de API reutilizáveis
export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
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
}

export async function sendChatMessage(message: string, threadId?: string, token?: string) {
  const response = await fetch(`${API_URL}/chat`, {
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
}

export async function uploadAttachment(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_URL}/attachments`, {
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
}
