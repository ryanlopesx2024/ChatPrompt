"use client"

import { cn } from "@/lib/utils"
import { MoreVertical, Plus } from "lucide-react"

interface ChatPromptProps {
  title: string
  description: string
  isSelected?: boolean
  isCreateNew?: boolean
  onClick?: () => void
}

export default function ChatPrompt({
  title,
  description,
  isSelected = false,
  isCreateNew = false,
  onClick,
}: ChatPromptProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col rounded-lg border p-4 transition-all shadow-sm",
        isSelected
          ? "border-primary bg-primary text-white"
          : "border-border-gray bg-white hover:border-primary hover:bg-blue-50",
        isCreateNew && !isSelected && "border-dashed",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          {isCreateNew ? (
            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
              <Plus className="h-3 w-3 text-text-secondary" />
            </div>
          ) : (
            <div
              className={cn("mr-2 h-5 w-5 rounded-full", isSelected ? "bg-white opacity-50" : "bg-primary opacity-30")}
            ></div>
          )}
          <h3 className={cn("text-sm font-semibold", isSelected ? "text-white" : "text-text-primary")}>{title}</h3>
        </div>
        {!isCreateNew && (
          <button
            className={cn(
              "text-text-secondary hover:text-text-primary",
              isSelected && "text-white hover:text-white/80",
            )}
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>
      {description && (
        <p className={cn("text-xs", isSelected ? "text-white/80" : "text-text-secondary")}>{description}</p>
      )}

      {/* Botões de editar/excluir que aparecem no hover (como no Frame 2) */}
      {!isSelected && !isCreateNew && (
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-xs bg-gray-200 px-2 py-0.5 rounded text-text-secondary hover:bg-gray-300">
            Editar
          </button>
          <button className="text-xs bg-gray-200 px-2 py-0.5 rounded text-red-600 hover:bg-gray-300">Excluir</button>
        </div>
      )}
    </div>
  )
}
