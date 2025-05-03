"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type Conversation = {
  id: string
  title: string
  lastMessage?: string
  createdAt: Date
  updatedAt: Date
  promptId: string | null
}

export type Prompt = {
  id: string
  title: string
  description: string
  promptText: string
}

type ChatContextType = {
  conversations: Conversation[]
  prompts: Prompt[]
  activeConversation: string | null
  activePrompt: string | null
  createConversation: (promptId?: string) => void
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  setActivePrompt: (id: string | null) => void
  createPrompt: (title: string, description: string) => void
  updatePrompt: (id: string, title: string, description: string) => void
  deletePrompt: (id: string) => void
  clearAllConversationsAndThreads: () => void
  clearAllLocalStorage: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  // Sempre inicie com o estado vazio, sem carregar histórico antigo
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: "prompt_js_closure",
      title: "Explicar Closures em JavaScript",
      description: "Explique o conceito de closures em JavaScript com exemplos.",
      promptText: "Explique closures em JavaScript com exemplos de código."
    },
    {
      id: "prompt_python_async",
      title: "Como usar async/await em Python",
      description: "Demonstre como usar async/await em Python.",
      promptText: "Como funciona async/await em Python? Dê um exemplo simples."
    },
    {
      id: "prompt_sql_join",
      title: "Exemplo de JOIN em SQL",
      description: "Mostre um exemplo de JOIN entre duas tabelas em SQL.",
      promptText: "Me mostre um exemplo de JOIN entre duas tabelas em SQL."
    },
    {
      id: "prompt_git_rebase",
      title: "Como fazer rebase no Git",
      description: "Explique como funciona o rebase no Git.",
      promptText: "Explique como funciona o rebase no Git e quando devo usá-lo."
    },
    {
      id: "prompt_regex_email",
      title: "Regex para email",
      description: "Crie uma expressão regular para validar emails.",
      promptText: "Crie uma expressão regular para validar endereços de email."
    },


  ])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [activePrompt, setActivePrompt] = useState<string | null>(null)

  // Carregar conversas do localStorage ao iniciar
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations")
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Converter strings de data para objetos Date
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
        }))
        setConversations(conversationsWithDates)
      } catch (e) {
        console.error("Erro ao carregar conversas:", e)
      }
    }

    const savedPrompts = localStorage.getItem("prompts")
    if (savedPrompts) {
      try {
        setPrompts(JSON.parse(savedPrompts))
      } catch (e) {
        console.error("Erro ao carregar prompts:", e)
      }
    }
  }, [])

  // Salvar conversas no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }, [conversations])

  // Salvar prompts no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("prompts", JSON.stringify(prompts))
  }, [prompts])

  const createConversation = (promptId?: string) => {
    const now = new Date()
    const newId = `conv_${Date.now()}`
    const selectedPrompt = promptId ? prompts.find((p) => p.id === promptId) : null

    const newConversation: Conversation = {
      id: newId,
      title: selectedPrompt ? `Conversa com ${selectedPrompt.title}` : `Nova Conversa ${conversations.length + 1}`,
      createdAt: now,
      updatedAt: now,
      promptId: promptId || null,
    }

    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newId)

    // Sempre remova qualquer thread_id antigo deste chat
    localStorage.removeItem(`thread_id_${newId}`)

    // Se tiver um prompt selecionado, adicionar o texto do prompt como primeira mensagem do usuário
    if (selectedPrompt && selectedPrompt.promptText) {
      const userPromptMessage = {
        id: 1,
        content: selectedPrompt.promptText,
        isUser: true,
        timestamp: new Date(),
      }
      localStorage.setItem(`messages_${newId}`, JSON.stringify([userPromptMessage]))
      localStorage.setItem(`auto_send_${newId}`, "true") // Marcar para envio automático
    } else {
      // Iniciar com uma conversa vazia
      localStorage.setItem(`messages_${newId}`, JSON.stringify([]))
    }

    router.push(`/chat/${newId}`)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (activeConversation === id) {
      setActiveConversation(null)
      router.push("/chat")
    }
  }

  const createPrompt = (title: string, description: string, promptText: string = "") => {
    const newPrompt = {
      id: `prompt_${Date.now()}`,
      title,
      description,
      promptText: promptText || `Olá, preciso de ajuda com ${title}. [Insira sua solicitação aqui]`
    }
    setPrompts((prev) => [...prev, newPrompt])
  }

  const updatePrompt = (id: string, title: string, description: string, promptText?: string) => {
    setPrompts((prev) => prev.map((prompt) => {
      if (prompt.id === id) {
        return { 
          ...prompt, 
          title, 
          description,
          promptText: promptText !== undefined ? promptText : prompt.promptText 
        }
      }
      return prompt
    }))
  }

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
    if (activePrompt === id) {
      setActivePrompt(null)
    }
  }

  // Função para limpar todas as conversas, mensagens, threads e TUDO do localStorage
  const clearAllLocalStorage = () => {
    localStorage.clear()
    setConversations([])
    setActiveConversation(null)
    setPrompts([
      {
        id: "prompt_boas_praticas",
        title: "Boas práticas em prompt engineering",
        description: "Quais são as melhores práticas para criar prompts eficazes para LLMs?",
        promptText: "Quais são as melhores práticas para criar prompts claros e eficazes para grandes modelos de linguagem?"
      },
      {
        id: "prompt_exemplo_chain",
        title: "Exemplo de prompt em cadeia",
        description: "Como criar um prompt que faz o modelo responder em etapas?",
        promptText: "Como estruturar um prompt para que o modelo responda passo a passo, detalhando seu raciocínio?"
      },
      {
        id: "prompt_ajuste_output",
        title: "Ajuste de formato de resposta",
        description: "Como pedir para o modelo responder em JSON ou tabela?",
        promptText: "Como devo escrever um prompt para garantir que a resposta venha em formato JSON válido?"
      },
      {
        id: "prompt_erros_comuns",
        title: "Erros comuns em prompts",
        description: "Quais erros devo evitar ao projetar prompts para IA?",
        promptText: "Quais são os erros mais comuns ao criar prompts para LLMs e como evitá-los?"
      },
      {
        id: "prompt_exemplo_contexto",
        title: "Uso de contexto no prompt",
        description: "Como fornecer contexto extra para melhorar a resposta da IA?",
        promptText: "Como incluir contexto adicional em um prompt para obter respostas mais precisas de um modelo de linguagem?"
      },
      {
        id: "prompt_avaliacao",
        title: "Avaliação de prompts",
        description: "Como avaliar a qualidade de um prompt?",
        promptText: "Quais métricas ou métodos posso usar para avaliar se um prompt está realmente funcionando bem?"
      },
      {
        id: "prompt_personalizacao",
        title: "Personalização de prompts",
        description: "Como adaptar prompts para diferentes públicos ou domínios?",
        promptText: "Quais técnicas posso usar para personalizar prompts para necessidades específicas de diferentes áreas?"
      },
      {
        id: "prompt_automatizacao",
        title: "Automação da geração de prompts",
        description: "Como automatizar a criação de prompts para tarefas repetitivas?",
        promptText: "Existem ferramentas ou abordagens para automatizar a geração de prompts para grandes volumes de tarefas?"
      },
      {
        id: "prompt_tecnicas_avancadas",
        title: "Técnicas avançadas de prompt engineering",
        description: "Quais técnicas avançadas existem além do básico?",
        promptText: "Quais técnicas avançadas de prompt engineering podem ajudar a obter respostas mais precisas ou criativas de LLMs?"
      }  
    ])
    setActivePrompt(null)
  }

  // Função para limpar todas as conversas, mensagens e threads do localStorage e do estado
  const clearAllConversationsAndThreads = () => {
    // Limpa tudo do localStorage relacionado a conversas e threads
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith("messages_") ||
        key.startsWith("thread_id_") ||
        key.startsWith("auto_send_")
      ) {
        localStorage.removeItem(key)
      }
    })
    setConversations([])
    setActiveConversation(null)
    // (Opcional) Limpar prompts customizados do usuário aqui se desejar
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        prompts,
        activeConversation,
        activePrompt,
        createConversation,
        deleteConversation,
        setActiveConversation,
        setActivePrompt,
        createPrompt,
        updatePrompt,
        deletePrompt,
        clearAllConversationsAndThreads,
        clearAllLocalStorage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
