import { useCallback, useEffect } from "react";
import { useChatStore } from "../stores/chat.store";
import { AIService } from "../services/ai.service";

export function useSuggestedQuestions() {
  const store = useChatStore();
  const context = store.selectedContext;

  const loadSuggestions = useCallback(async () => {
    try {
      const suggestions = await AIService.generateSuggestions(context);
      store.setSuggestions(suggestions);
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    }
  }, [context, store]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  return {
    suggestions: store.suggestions,
    refreshSuggestions: loadSuggestions,
  };
}
