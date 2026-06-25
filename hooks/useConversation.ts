import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../stores/chat.store";
import { loadConversationsAction, createConversationAction, updateConversationAction, deleteConversationAction } from "../app/actions/chat.actions";
import { AIConversation } from "../lib/types/ai";

export function useConversation(paperId: string) {
  const store = useChatStore();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", paperId],
    queryFn: async () => {
      const convs = await loadConversationsAction(paperId);
      
      // Auto-select first conversation if none selected
      if (convs.length > 0 && !store.selectedConversationId) {
        store.setSelectedConversationId(convs[0].id);
      } else if (convs.length === 0) {
        // We shouldn't create within a queryFn, but we can return empty and handle it below
      }
      return convs;
    },
    enabled: !!paperId,
  });

  // Handle auto-creation of empty conversation if none exist
  useEffect(() => {
    if (!paperId) return;
    const attemptedAutoCreations = store.attemptedAutoCreations || {};
    const hasAttempted = attemptedAutoCreations[paperId];

    if (conversations.length === 0 && !isLoading && !hasAttempted) {
      store.setAttemptedAutoCreation(paperId, true);
      createConversationAction(paperId, undefined, "New Conversation")
        .then((newConv) => {
          queryClient.setQueryData(["conversations", paperId], [newConv]);
          store.setSelectedConversationId(newConv.id);
        })
        .catch(err => {
          console.error("Auto-creation of conversation failed:", err);
        });
    }
  }, [conversations.length, isLoading, paperId, queryClient, store]);

  const createMutation = useMutation({
    mutationFn: (title?: string) => createConversationAction(paperId, undefined, title),
    onSuccess: (newConv) => {
      queryClient.setQueryData(["conversations", paperId], (old: AIConversation[] = []) => [newConv, ...old]);
      store.setSelectedConversationId(newConv.id);
    }
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string, title: string }) => updateConversationAction(id, { title }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["conversations", paperId], (old: AIConversation[] = []) => 
        old.map(c => c.id === updated.id ? updated : c)
      );
    }
  });

  const togglePinMutation = useMutation({
    mutationFn: ({ id, isPinned }: { id: string, isPinned: boolean }) => updateConversationAction(id, { isPinned: !isPinned }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["conversations", paperId], (old: AIConversation[] = []) => 
        old.map(c => c.id === updated.id ? updated : c)
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteConversationAction(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["conversations", paperId], (old: AIConversation[] = []) => 
        old.filter(c => c.id !== id)
      );
      
      if (store.selectedConversationId === id) {
        const remaining = queryClient.getQueryData<AIConversation[]>(["conversations", paperId]) || [];
        if (remaining.length > 0) {
          store.setSelectedConversationId(remaining[0].id);
        } else {
          createMutation.mutate("New Conversation");
        }
      }
    }
  });

  return {
    conversations,
    selectedConversationId: store.selectedConversationId,
    selectConversation: store.setSelectedConversationId,
    createConversation: async (title?: string) => createMutation.mutateAsync(title),
    renameConversation: async (id: string, title: string) => renameMutation.mutateAsync({ id, title }),
    togglePin: async (id: string, isPinned: boolean) => togglePinMutation.mutateAsync({ id, isPinned }),
    deleteConversation: async (id: string) => deleteMutation.mutateAsync(id),
    isLoading,
  };
}
