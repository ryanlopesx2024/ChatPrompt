"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import ChatSidebar from "@/components/chat-sidebar";
import ChatPage from "./chat/page";

export default function HomePage() {
  // Exibe diretamente a interface de prompts estruturados igual à /chat
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1 overflow-y-auto">
        <ChatPage />
      </main>
    </div>
  );
}
