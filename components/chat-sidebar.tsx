"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, Settings, Trash2, LogOut } from "lucide-react"
import Link from "next/link"
import { useChat } from "@/contexts/chat-context"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ChatSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, createConversation, deleteConversation, clearAllConversationsAndThreads, clearAllLocalStorage } = useChat()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Verificar autenticação quando o componente for montado
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token && pathname !== '/login') {
      // Redirecionar para a página de login se não estiver autenticado
      router.push('/login')
    } else if (token) {
      setIsAuthenticated(true)
    }
  }, [pathname, router])

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNewConversation = () => {
    createConversation()
  }
  
  const handleLogout = () => {
    // Remover token de autenticação
    localStorage.removeItem('authToken')
    // Redirecionar para a página de login
    router.push('/login')
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (confirm("Tem certeza que deseja excluir esta conversa?")) {
      deleteConversation(id)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border-gray bg-white">
      <div className="flex items-center justify-center border-b border-border-gray p-4">
        <h2 className="text-lg font-semibold text-text-primary">LOGO</h2>
      </div>

      <div className="flex items-center p-4">
        <Button
          onClick={handleNewConversation}
          className="w-full justify-start gap-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium"
        >
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>

      <div className="px-4 py-2">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-border-gray bg-input-gray-bg py-1.5 pl-8 pr-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="border-b border-border-gray px-4 py-2">
        <h3 className="mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Histórico de Conversas
        </h3>
        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <li key={conversation.id} className="group">
                <Link
                  href={`/chat/${conversation.id}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-2 text-sm",
                    pathname === `/chat/${conversation.id}`
                      ? "bg-primary/10 text-primary"
                      : "text-text-primary hover:bg-light-gray-bg",
                  )}
                >
                  <div className="flex items-center overflow-hidden">
                    <span className="mr-2 text-text-secondary">•</span>
                    <span className="truncate">{conversation.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-sm text-text-secondary italic px-2 py-2">
              {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto border-t border-border-gray p-4 space-y-2">
        <Link href="/settings">
          <Button
            variant="outline"
            className="w-full justify-center text-text-secondary border-border-gray hover:bg-light-gray-bg"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </Link>

        <Button
          variant="outline"
          className="w-full justify-center text-red-500 border-border-gray hover:bg-red-50"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
      <div className="p-4 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-center text-red-500 border-border-gray hover:bg-red-50"
          size="sm"
          onClick={() => {
            if (confirm('Tem certeza que deseja limpar TODO o localStorage? Isso irá desconectar e apagar todas as conversas e prompts.')) {
              clearAllLocalStorage()
              window.location.reload()
            }
          }}
        >
          Limpar LocalStorage
        </Button>
      </div>
    </div>
  )
}
