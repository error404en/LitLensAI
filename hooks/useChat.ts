import { useCallback, useEffect } from "react";
import { useChatStore } from "../stores/chat.store";
import { loadMessagesAction, saveUserMessageAction, deleteMessageAction } from "../app/actions/chat.actions";
import { AIChatMessage } from "../lib/types/ai";

export function useChat() {
  const store = useChatStore();

  const loadMessages = useCallback(async (conversationId: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const messages = await loadMessagesAction(conversationId);
      store.setMessages(messages);
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const setMessages = store.setMessages;
  // Load messages when conversation changes
  useEffect(() => {
    if (store.selectedConversationId) {
      loadMessages(store.selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [store.selectedConversationId, loadMessages, setMessages]);

  const sendMessage = useCallback(async (content: string) => {
    const convId = store.selectedConversationId;
    if (!convId || !content.trim() || store.isStreaming) return;

    store.setError(null);
    store.addPromptToHistory(content);

    // Save user message immediately (optimistic UI)
    const tempUserId = `temp_u_${Date.now()}`;
    const userMessage: AIChatMessage = {
      id: tempUserId,
      conversationId: convId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    store.addMessage(userMessage);
    store.setTyping(true);

    try {
      // Actually save user message to backend
      const savedUserMsg = await saveUserMessageAction(convId, content);
      store.updateMessage(tempUserId, { id: savedUserMsg.id });

      store.setTyping(false);
      store.setStreaming(true);

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
      store.addMessage(tempAssistantMsg);

      // Stream response
      let streamedContent = "";
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          prompt: content,
          context: store.selectedContext,
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
              store.updateMessage(tempAssistantId, { content: streamedContent });
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
      store.updateMessage(tempAssistantId, {
        id: savedAssistantMsg.id,
        content: savedAssistantMsg.content,
        citations: savedAssistantMsg.citations,
        isStreaming: false,
      });

    } catch (err) {
      console.error(err);
      store.setError(err instanceof Error ? err.message : "Failed to send message");
      store.addMessage({
        id: `err_${Date.now()}`,
        conversationId: convId,
        role: "error",
        content: "I encountered an error processing your request. Please try again.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      store.setTyping(false);
      store.setStreaming(false);
    }
  }, [store]);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await deleteMessageAction(id);
      store.removeMessage(id);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  }, [store]);

  const regenerate = useCallback(async () => {
    // Find last user message
    const lastUserMessage = [...store.messages].reverse().find(m => m.role === "user");
    if (lastUserMessage && !store.isStreaming) {
      await sendMessage(lastUserMessage.content);
    }
  }, [store.messages, store.isStreaming, sendMessage]);

  return {
    messages: store.messages,
    isStreaming: store.isStreaming,
    isTyping: store.isTyping,
    isLoading: store.isLoading,
    error: store.error,
    sendMessage,
    deleteMessage,
    regenerate,
  };
}
