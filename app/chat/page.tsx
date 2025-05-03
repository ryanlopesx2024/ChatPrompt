"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send, Paperclip, Edit, Trash } from "lucide-react"
import ChatSidebar from "@/components/chat-sidebar"
import ChatPrompt from "@/components/chat-prompt"
import { useChat } from "@/contexts/chat-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ChatPage() {
  const { prompts, createConversation, createPrompt, updatePrompt, deletePrompt, setActivePrompt } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [promptTitle, setPromptTitle] = useState("")
  const [promptDescription, setPromptDescription] = useState("")
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null)

  const handleSendMessage = () => {
    // Se houver prompt selecionado, iniciar conversa com ele
    if (selectedPrompt) {
      createConversation(selectedPrompt)
      setSelectedPrompt(null)
      setInputValue("")
      return
    }
    // Se não, só envia se houver texto
    if (inputValue.trim()) {
      createConversation()
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePromptSelect = (id: string) => {
    // Evita criar várias conversas para o mesmo prompt
    if (selectedPrompt === id) {
      setSelectedPrompt(null)
      setActivePrompt(null)
      return
    }
    setSelectedPrompt(id)
    setActivePrompt(id)
    createConversation(id)
  }

  const handleEditPrompt = () => {
    if (!selectedPrompt) return

    const prompt = prompts.find((p) => p.id === selectedPrompt)
    if (!prompt) return

    setPromptTitle(prompt.title)
    setPromptDescription(prompt.description)
    setEditingPromptId(prompt.id)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDeletePrompt = () => {
    if (!selectedPrompt) return

    if (confirm("Tem certeza que deseja excluir este prompt?")) {
      deletePrompt(selectedPrompt)
      setSelectedPrompt(null)
    }
  }

  const handleCreateNewPrompt = () => {
    setPromptTitle("")
    setPromptDescription("")
    setDialogMode("create")
    setIsDialogOpen(true)
  }

  const handleSavePrompt = () => {
    if (!promptTitle.trim()) return

    if (dialogMode === "create") {
      createPrompt(promptTitle, promptDescription)
    } else {
      if (editingPromptId) {
        updatePrompt(editingPromptId, promptTitle, promptDescription)
      }
    }

    setIsDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-light-gray-bg">
      <ChatSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-gray bg-white px-6 py-4">
          <div className="text-center w-full">
            <h1 className="text-xl font-semibold text-text-primary mb-1">Prompt Engenheiro Assistante</h1>
            <p className="text-sm text-text-secondary">Como eu posso te ajudar hoje?</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {prompts.map((prompt) => (
                <ChatPrompt
                  key={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  isSelected={selectedPrompt === prompt.id}
                  onClick={() => handlePromptSelect(prompt.id)}
                />
              ))}
              <ChatPrompt title="Crie um novo prompt" description="" isCreateNew onClick={handleCreateNewPrompt} />
            </div>

            {selectedPrompt && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  className="rounded-md bg-primary text-white hover:bg-primary-hover font-medium px-6"
                  onClick={handleEditPrompt}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="rounded-md border-red-600 text-red-600 hover:bg-red-50 font-medium px-6"
                  onClick={handleDeletePrompt}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border-gray bg-white p-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center">
              <button className="p-2 text-text-secondary hover:text-primary mr-2">
                <Paperclip size={20} />
              </button>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Como eu posso te ajudar hoje?"
                className="pr-12 py-2 rounded-lg border-border-gray bg-input-gray-bg focus:border-primary focus:ring-primary"
              />
              <div className="absolute right-3">
                <button
                  onClick={handleSendMessage}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    inputValue.trim() || selectedPrompt ? "bg-primary text-white" : "bg-gray-200 text-text-secondary",
                  )}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Criar novo prompt" : "Editar prompt"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                placeholder="Nome do prompt"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Input
                id="description"
                value={promptDescription}
                onChange={(e) => setPromptDescription(e.target.value)}
                placeholder="Descrição breve do prompt"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePrompt}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
