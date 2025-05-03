"use client"

import { useState, useEffect, useRef, use } from "react"
import * as React from "react"
import { useRouter } from "next/navigation"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip } from "lucide-react"
import ChatSidebar from "@/components/chat-sidebar"
import ChatMessage from "@/components/chat-message"
import { cn } from "@/lib/utils"
import { API_URL, sendChatMessage, uploadAttachment } from "@/lib/api-config"

type Message = {
  id: number
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { conversations, prompts, activePrompt } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Unwrap params with React.use() for Next.js 15+
  const { id: chatId } = React.use(params)

  // Verificar se a conversa existe
  useEffect(() => {
    if (conversations.length === 0) return; // Aguarda carregar conversas do contexto
    const conversation = conversations.find((c) => c.id === chatId)
    if (!conversation) {
      router.push("/chat")
    }
  }, [conversations, chatId, router])

  // Função para enviar mensagem automaticamente
  const sendMessageAutomatically = async (messageContent: string) => {
    setIsLoading(true)

    try {
      // Obter token do localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Não autenticado')
      }

      // Enviar mensagem para o backend usando o módulo de API
      const threadId = localStorage.getItem(`thread_id_${chatId}`) || undefined
      const data = await sendChatMessage(messageContent, threadId, token)
      
      // Salvar thread_id para uso futuro
      localStorage.setItem(`thread_id_${chatId}`, data.thread_id)

      // Criar mensagem do assistente
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      // Remover flag de envio automático
      localStorage.removeItem(`auto_send_${chatId}`)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: messages.length + 2,
        content: 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fazer login
    handleLogin()
    
    // Carregar mensagens do localStorage para esta conversa específica
    const savedMessages = localStorage.getItem(`messages_${chatId}`)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Converter strings de data para objetos Date
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(messagesWithDates)
        
        // Verificar se há flag para envio automático
        const shouldAutoSend = localStorage.getItem(`auto_send_${chatId}`) === "true"
        
        // Verificar se a última mensagem já é do assistente (para evitar duplicação)
        const lastMessage = messagesWithDates[messagesWithDates.length - 1]
        const hasAssistantResponse = !lastMessage.isUser
        
        if (shouldAutoSend && messagesWithDates.length > 0 && messagesWithDates[0].isUser && !hasAssistantResponse) {
          // Esperar um pouco para garantir que o login foi concluído
          setTimeout(() => {
            sendMessageAutomatically(messagesWithDates[0].content)
          }, 1000)
        }
      } catch (e) {
        console.error("Erro ao carregar mensagens:", e)
      }
    } else {
      // Verificar se há um prompt associado à conversa atual
      const conversation = conversations.find((c) => c.id === chatId)
      if (conversation && conversation.promptId) {
        const prompt = prompts.find(p => p.id === conversation.promptId)
        if (prompt && prompt.promptText) {
          // Criar uma mensagem do usuário com o texto do prompt
          const userPromptMessage = {
            id: 1,
            content: prompt.promptText,
            isUser: true,
            timestamp: new Date(),
          }
          setMessages([userPromptMessage])
          localStorage.setItem(`messages_${chatId}`, JSON.stringify([userPromptMessage]))
          
          // Definir flag para envio automático
          localStorage.setItem(`auto_send_${chatId}`, "true")
          
          // Enviar a mensagem automaticamente
          setTimeout(() => {
            sendMessageAutomatically(prompt.promptText)
          }, 1000)
        } else {
          // Inicializar com array vazio
          setMessages([])
          localStorage.setItem(`messages_${chatId}`, JSON.stringify([]))
        }
      } else {
        // Inicializar com array vazio
        setMessages([])
        localStorage.setItem(`messages_${chatId}`, JSON.stringify([]))
      }
    }
  }, [chatId, conversations, prompts])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages))
    }
  }, [messages, chatId])



  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Criar mensagem do usuário
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Obter token do localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Não autenticado')
      }

      // Enviar mensagem para o backend usando o módulo de API
      const threadId = localStorage.getItem(`thread_id_${chatId}`) || undefined
      const data = await sendChatMessage(userMessage.content, threadId, token)
      
      // Salvar thread_id para uso futuro
      localStorage.setItem(`thread_id_${chatId}`, data.thread_id)

      // Criar mensagem do assistente
      const assistantMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: messages.length + 2,
        content: 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Função para fazer login (chamada quando a página carrega)
  const handleLogin = async () => {
    try {
      // Verificar se já existe um token
      if (localStorage.getItem('authToken')) {
        return
      }

      // Fazer login com o backend usando o módulo de API
      try {
        const data = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'ia@gmail.com',
            password: 'senha123'
          })
        }).then(res => {
          if (!res.ok) throw new Error('Falha no login')
          return res.json()
        })
        
        localStorage.setItem('authToken', data.token)
      } catch (error) {
        console.error('Erro no login:', error)
      }
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Encontrar a conversa atual
  const currentConversation = conversations.find((c) => c.id === chatId) || { id: chatId, title: 'Nova Conversa', promptId: null }
  
  // Encontrar o prompt associado à conversa, se houver
  const conversationPrompt = currentConversation.promptId ? 
    prompts.find((p: { id: string }) => p.id === currentConversation.promptId) : null
  
  const currentPrompt = conversationPrompt ? 
    `Você está utilizando: ${conversationPrompt.title}` : 
    (activePrompt ? `Você está utilizando o ${activePrompt}` : "Conversa padrão")

  return (
    <div className="flex h-screen bg-light-gray-bg">
      <ChatSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-gray bg-white px-6 py-4">
          <div className="text-center w-full">
            <h1 className="text-xl font-semibold text-text-primary mb-1">{currentConversation.title}</h1>
            <p className="text-sm text-text-secondary">Prompt Engenheiro Assistante</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="mb-4">
              <span className="text-xs bg-gray-200 text-text-secondary px-2 py-1 rounded-full">{currentPrompt}</span>
            </div>

            {messages.map((message, idx) => (
              <ChatMessage
                key={`${message.id}_${typeof message.timestamp === 'string' ? message.timestamp : (message.timestamp?.toISOString?.() || idx)}`}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              />
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-text-secondary">
                <div className="animate-bounce h-2 w-2 bg-text-secondary rounded-full"></div>
                <div
                  className="animate-bounce h-2 w-2 bg-text-secondary rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="animate-bounce h-2 w-2 bg-text-secondary rounded-full"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border-gray bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center">
              <label htmlFor="file-upload" className="p-2 text-text-secondary hover:text-primary mr-2 cursor-pointer">
                <Paperclip size={20} />
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    
                    try {
                      setIsLoading(true);
                      const file = e.target.files[0];
                      const token = localStorage.getItem('authToken');
                      
                      if (!token) {
                        throw new Error('Não autenticado');
                      }
                      
                      // Criar FormData para upload
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      // Enviar arquivo para o backend usando o módulo de API
                      const response = await uploadAttachment(file, token);
                      
                      if (!response.ok) {
                        throw new Error(`Erro no upload: ${response.status}`);
                      }
                      
                      const data = await response.json();
                      
                      // Adicionar mensagem sobre o arquivo
                      const fileMessage: Message = {
                        id: messages.length + 1,
                        content: `Arquivo anexado: ${file.name}`,
                        isUser: true,
                        timestamp: new Date(),
                      };
                      
                      setMessages(prev => [...prev, fileMessage]);
                      
                      // Enviar mensagem com o arquivo anexado
                      const threadId = localStorage.getItem(`thread_id_${chatId}`) || undefined;
                      
                      // Enviar mensagem com anexo usando o módulo de API
                      // Usar sendChatMessage com parâmetros adicionais para anexos
                      const chatResponse = await fetch(`${API_URL}/chat`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          message: `Analisando o arquivo: ${file.name}`,
                          thread_id: threadId,
                          attachment_ids: [data.file_id]
                        })
                      });
                      
                      if (!chatResponse.ok) {
                        throw new Error(`Erro na API: ${chatResponse.status}`);
                      }
                      
                      const chatData = await chatResponse.json();
                      
                      // Salvar thread_id
                      localStorage.setItem(`thread_id_${chatId}`, chatData.thread_id);
                      
                      // Adicionar resposta do assistente
                      const assistantMessage: Message = {
                        id: messages.length + 2,
                        content: chatData.response,
                        isUser: false,
                        timestamp: new Date(),
                      };
                      
                      setMessages(prev => [...prev, assistantMessage]);
                    } catch (error) {
                      console.error('Erro ao processar arquivo:', error);
                      const errorMessage: Message = {
                        id: messages.length + 1,
                        content: 'Ocorreu um erro ao processar o arquivo. Por favor, tente novamente.',
                        isUser: false,
                        timestamp: new Date(),
                      };
                      setMessages(prev => [...prev, errorMessage]);
                    } finally {
                      setIsLoading(false);
                      // Limpar o input de arquivo
                      if (e.target) e.target.value = '';
                    }
                  }}
                />
              </label>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="pr-12 py-2 rounded-lg border-border-gray bg-input-gray-bg focus:border-primary focus:ring-primary"
                disabled={isLoading}
              />
              <div className="absolute right-3">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    inputValue.trim() && !isLoading ? "bg-primary text-white" : "bg-gray-200 text-text-secondary",
                  )}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
