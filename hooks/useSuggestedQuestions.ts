import { useCallback, useEffect } from "react";
import { useChatStore } from "../stores/chat.store";
import { generateSuggestionsAction } from "../app/actions/chat.actions";

export function useSuggestedQuestions() {
  const store = useChatStore();
  const context = store.selectedContext;

  const loadSuggestions = useCallback(async () => {
    try {
      const suggestions = await generateSuggestionsAction(context);
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
