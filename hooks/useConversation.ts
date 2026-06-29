import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../stores/chat.store";
import { loadConversationsAction, createConversationAction, updateConversationAction, deleteConversationAction } from "../app/actions/chat.actions";
import { AIConversation } from "../lib/types/ai";

export function useConversation(paperId: string) {
  const selectedConversationId = useChatStore((s) => s.selectedConversationId);
  const attemptedAutoCreations = useChatStore((s) => s.attemptedAutoCreations);
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", paperId],
    queryFn: async () => {
      const convs = await loadConversationsAction(paperId);
      return convs;
    },
    enabled: !!paperId,
  });

  // Handle auto-selecting the first conversation if none is selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      useChatStore.getState().setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Handle auto-creation of empty conversation if none exist
  useEffect(() => {
    if (!paperId) return;
    const hasAttempted = attemptedAutoCreations[paperId];

    if (conversations.length === 0 && !isLoading && !hasAttempted) {
      useChatStore.getState().setAttemptedAutoCreation(paperId, true);
      createConversationAction(paperId, undefined, "New Conversation")
        .then((newConv) => {
          queryClient.setQueryData(["conversations", paperId], [newConv]);
          useChatStore.getState().setSelectedConversationId(newConv.id);
        })
        .catch(err => {
          console.error("Auto-creation of conversation failed:", err);
        });
    }
  }, [conversations.length, isLoading, paperId, queryClient, attemptedAutoCreations]);

  const createMutation = useMutation({
    mutationFn: (title?: string) => createConversationAction(paperId, undefined, title),
    onSuccess: (newConv) => {
      queryClient.setQueryData(["conversations", paperId], (old: AIConversation[] = []) => [newConv, ...old]);
      useChatStore.getState().setSelectedConversationId(newConv.id);
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
      
      if (selectedConversationId === id) {
        const remaining = queryClient.getQueryData<AIConversation[]>(["conversations", paperId]) || [];
        if (remaining.length > 0) {
          useChatStore.getState().setSelectedConversationId(remaining[0].id);
        } else {
          createMutation.mutate("New Conversation");
        }
      }
    }
  });

  return {
    conversations,
    selectedConversationId,
    selectConversation: useChatStore.getState().setSelectedConversationId,
    createConversation: async (title?: string) => createMutation.mutateAsync(title),
    renameConversation: async (id: string, title: string) => renameMutation.mutateAsync({ id, title }),
    togglePin: async (id: string, isPinned: boolean) => togglePinMutation.mutateAsync({ id, isPinned }),
    deleteConversation: async (id: string) => deleteMutation.mutateAsync(id),
    isLoading,
  };
}
