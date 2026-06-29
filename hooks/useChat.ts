import { useCallback, useEffect } from "react";
import { useChatStore } from "../stores/chat.store";
import { loadMessagesAction, saveUserMessageAction, deleteMessageAction } from "../app/actions/chat.actions";
import { AIChatMessage } from "../lib/types/ai";

export function useChat() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const isTyping = useChatStore((s) => s.isTyping);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const selectedConversationId = useChatStore((s) => s.selectedConversationId);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { setLoading, setError, setMessages } = useChatStore.getState();
    setLoading(true);
    setError(null);
    try {
      const messages = await loadMessagesAction(conversationId);
      setMessages(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    } else {
      useChatStore.getState().setMessages([]);
    }
  }, [selectedConversationId, loadMessages]);

  const sendMessage = useCallback(async (content: string) => {
    const convId = useChatStore.getState().selectedConversationId;
    const isStreamingCurrent = useChatStore.getState().isStreaming;
    if (!convId || !content.trim() || isStreamingCurrent) return;

    const { setError, addPromptToHistory, addMessage, setTyping, updateMessage, setStreaming } = useChatStore.getState();

    setError(null);
    addPromptToHistory(content);

    // Save user message immediately (optimistic UI)
    const tempUserId = `temp_u_${Date.now()}`;
    const userMessage: AIChatMessage = {
      id: tempUserId,
      conversationId: convId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setTyping(true);

    try {
      // Actually save user message to backend
      const savedUserMsg = await saveUserMessageAction(convId, content);
      updateMessage(tempUserId, { id: savedUserMsg.id });

      setTyping(false);
      setStreaming(true);

      // Create a temporary assistant message for streaming
      const tempAssistantId = `temp_a_${Date.now()}`;
      const tempAssistantMsg: AIChatMessage = {
        id: tempAssistantId,
        conversationId: convId,
        role: "assistant",
        content: "",
        isStreaming: true,
        createdAt: new Date().toISOString(),
      };
      addMessage(tempAssistantMsg);

      // Stream response
      let streamedContent = "";
      const currentContext = useChatStore.getState().selectedContext;
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          prompt: content,
          context: currentContext,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to stream response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let done = false;
      let savedAssistantMsg = null;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const text = decoder.decode(value);
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("chunk:")) {
              const delta = line.substring(6);
              streamedContent += delta;
              updateMessage(tempAssistantId, { content: streamedContent });
            } else if (line.startsWith("done:")) {
              savedAssistantMsg = JSON.parse(line.substring(5));
            } else if (line.startsWith("error:")) {
              throw new Error(line.substring(6));
            }
          }
        }
      }

      if (!savedAssistantMsg) {
        throw new Error("Streaming completed but no assistant message was saved.");
      }

      // Finalize message
      updateMessage(tempAssistantId, {
        id: savedAssistantMsg.id,
        content: savedAssistantMsg.content,
        citations: savedAssistantMsg.citations,
        isStreaming: false,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      addMessage({
        id: `err_${Date.now()}`,
        conversationId: convId,
        role: "error",
        content: "I encountered an error processing your request. Please try again.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
      setStreaming(false);
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await deleteMessageAction(id);
      useChatStore.getState().removeMessage(id);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  }, []);

  const regenerate = useCallback(async () => {
    const currentMessages = useChatStore.getState().messages;
    const isStreamingCurrent = useChatStore.getState().isStreaming;
    // Find last user message
    const lastUserMessage = [...currentMessages].reverse().find(m => m.role === "user");
    if (lastUserMessage && !isStreamingCurrent) {
      await sendMessage(lastUserMessage.content);
    }
  }, [sendMessage]);

  return {
    messages,
    isStreaming,
    isTyping,
    isLoading,
    error,
    sendMessage,
    deleteMessage,
    regenerate,
  };
}
