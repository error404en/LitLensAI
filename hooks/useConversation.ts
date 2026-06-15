import { useCallback, useEffect } from "react";
import { useChatStore } from "../stores/chat.store";
import { AIService } from "../services/ai.service";

export function useConversation(paperId: string) {
  const store = useChatStore();

  const loadConversations = useCallback(async () => {
    store.setLoading(true);
    try {
      const convs = await AIService.loadConversations(paperId);
      store.setConversations(convs);
      
      // Auto-select first conversation if none selected
      if (convs.length > 0 && !store.selectedConversationId) {
        store.setSelectedConversationId(convs[0].id);
      } else if (convs.length === 0) {
        // Create initial empty conversation
        const newConv = await AIService.createConversation(paperId, undefined, "New Conversation");
        store.addConversation(newConv);
        store.setSelectedConversationId(newConv.id);
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      store.setLoading(false);
    }
  }, [paperId, store]);

  useEffect(() => {
    if (paperId) {
      loadConversations();
    }
  }, [paperId, loadConversations]);

  const createConversation = useCallback(async (title?: string) => {
    try {
      const newConv = await AIService.createConversation(paperId, undefined, title);
      store.addConversation(newConv);
      store.setSelectedConversationId(newConv.id);
      return newConv;
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }, [paperId, store]);

  const renameConversation = useCallback(async (id: string, title: string) => {
    try {
      const updated = await AIService.updateConversation(id, { title });
      store.updateConversation(id, updated);
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  }, [store]);

  const togglePin = useCallback(async (id: string, isPinned: boolean) => {
    try {
      const updated = await AIService.updateConversation(id, { isPinned: !isPinned });
      store.updateConversation(id, updated);
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  }, [store]);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await AIService.deleteConversation(id);
      store.removeConversation(id);
      
      // Select another conversation if the active one was deleted
      if (store.selectedConversationId === id) {
        const remaining = store.conversations.filter(c => c.id !== id);
        if (remaining.length > 0) {
          store.setSelectedConversationId(remaining[0].id);
        } else {
          // If all deleted, create a new one
          createConversation("New Conversation");
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  }, [store, createConversation]);

  return {
    conversations: store.conversations,
    selectedConversationId: store.selectedConversationId,
    selectConversation: store.setSelectedConversationId,
    createConversation,
    renameConversation,
    togglePin,
    deleteConversation,
    isLoading: store.isLoading,
  };
}
