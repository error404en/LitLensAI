import { create } from "zustand"
import { ChatMessage } from "../lib/types"

interface ChatState {
  messagesByProject: Record<string, readonly ChatMessage[]>
  isTyping: boolean
  error: string | null

  // Actions
  addMessage: (projectId: string, message: ChatMessage) => void
  setMessages: (projectId: string, messages: readonly ChatMessage[]) => void
  setTyping: (isTyping: boolean) => void
  setError: (error: string | null) => void
  clearMessages: (projectId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByProject: {},
  isTyping: false,
  error: null,

  addMessage: (projectId, message) => 
    set((state) => {
      const existing = state.messagesByProject[projectId] || []
      return {
        messagesByProject: {
          ...state.messagesByProject,
          [projectId]: [...existing, message]
        }
      }
    }),
    
  setMessages: (projectId, messages) =>
    set((state) => ({
      messagesByProject: {
        ...state.messagesByProject,
        [projectId]: messages
      }
    })),

  setTyping: (isTyping) => set({ isTyping }),
  setError: (error) => set({ error }),
  
  clearMessages: (projectId) =>
    set((state) => {
      const newMessages = { ...state.messagesByProject }
      delete newMessages[projectId]
      return { messagesByProject: newMessages }
    }),
}))
