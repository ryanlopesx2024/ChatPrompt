import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatMessageProps {
  content: string
  isUser?: boolean
  timestamp?: string
}

export default function ChatMessage({ content, isUser = false, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-xl", isUser ? "flex-row-reverse" : "flex-row")}>
        {!isUser && (
          <div className="mr-4 flex-shrink-0">
            <Avatar className="h-8 w-8 bg-primary text-white">
              <span className="text-xs">AI</span>
            </Avatar>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {!isUser && <span className="text-sm font-medium text-text-primary">Assistente</span>}
            {timestamp && <span className="text-xs text-text-secondary">{timestamp}</span>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-text-secondary hover:text-text-primary">
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? "end" : "start"}>
                <DropdownMenuItem>Copiar</DropdownMenuItem>
                <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className={cn(
              "rounded-lg px-4 py-2 text-sm shadow-sm",
              isUser ? "bg-primary text-white" : "bg-white text-text-primary",
            )}
          >
            {/* Melhor formatação: suporta múltiplos parágrafos */}
            {typeof content === "string"
              ? content.split(/\n\n+/).map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '0.5em', whiteSpace: 'pre-line' }}>{para.trim()}</p>
                ))
              : content}
            
          </div>
        </div>

        {isUser && (
          <div className="ml-4 flex-shrink-0">
            <Avatar className="h-8 w-8 bg-gray-300">
              <span className="text-xs">U</span>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  )
}
