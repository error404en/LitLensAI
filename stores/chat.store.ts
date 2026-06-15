import { create } from "zustand";
import { AIChatMessage, AIConversation, AIContext, AISuggestedQuestion } from "../lib/types/ai";

interface ChatState {
  // Data
  conversations: AIConversation[];
  messages: AIChatMessage[];
  selectedConversationId: string | null;
  selectedContext: AIContext | null;
  suggestions: AISuggestedQuestion[];
  promptHistory: string[];

  // UI State
  isStreaming: boolean;
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions: Data
  setConversations: (conversations: AIConversation[]) => void;
  addConversation: (conversation: AIConversation) => void;
  updateConversation: (id: string, updates: Partial<AIConversation>) => void;
  removeConversation: (id: string) => void;

  setMessages: (messages: AIChatMessage[]) => void;
  addMessage: (message: AIChatMessage) => void;
  updateMessage: (id: string, updates: Partial<AIChatMessage>) => void;
  removeMessage: (id: string) => void;

  // Actions: UI
  setSelectedConversationId: (id: string | null) => void;
  setSelectedContext: (context: AIContext | null) => void;
  setSuggestions: (suggestions: AISuggestedQuestion[]) => void;
  addPromptToHistory: (prompt: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setTyping: (isTyping: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messages: [],
  selectedConversationId: null,
  selectedContext: null,
  suggestions: [],
  promptHistory: [],

  isStreaming: false,
  isTyping: false,
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) => set((s) => ({ conversations: [conversation, ...s.conversations] })),
  updateConversation: (id, updates) => set((s) => ({
    conversations: s.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),
  removeConversation: (id) => set((s) => ({
    conversations: s.conversations.filter((c) => c.id !== id),
    selectedConversationId: s.selectedConversationId === id ? null : s.selectedConversationId,
  })),

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  updateMessage: (id, updates) => set((s) => ({
    messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  removeMessage: (id) => set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),

  setSelectedConversationId: (id) => set({ selectedConversationId: id, messages: [] }),
  setSelectedContext: (context) => set({ selectedContext: context }),
  setSuggestions: (suggestions) => set({ suggestions }),
  addPromptToHistory: (prompt) => set((s) => {
    const history = [prompt, ...s.promptHistory.filter(p => p !== prompt)].slice(0, 50);
    return { promptHistory: history };
  }),

  setStreaming: (isStreaming) => set({ isStreaming }),
  setTyping: (isTyping) => set({ isTyping }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
