import { StructuredContext } from "../context/context-builder";

export class PromptBuilder {
  /**
   * Generates the final system prompt string by injecting context.
   */
  buildSystemPrompt(baseSystemPrompt: string, context: StructuredContext): string {
    let prompt = baseSystemPrompt;

    if (context.metadata) {
      prompt += `\n\n--- METADATA ---\n${context.metadata}`;
    }

    if (context.retrievedContent) {
      prompt += `\n\n--- RELEVANT EXCERPTS ---\n${context.retrievedContent}`;
    }

    if (context.selection) {
      prompt += `\n\n--- USER SELECTED TEXT ---\n${context.selection}`;
    }

    return prompt;
  }

  /**
   * Generates the final messages array for the LLM.
   */
  buildMessages(baseSystemPrompt: string, context: StructuredContext, userQuestion: string): any[] {
    const messages: any[] = [];
    
    // System Prompt
    messages.push({
      role: "system",
      content: this.buildSystemPrompt(baseSystemPrompt, context)
    });

    // History
    if (context.history && context.history.length > 0) {
      for (const msg of context.history) {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // User Question
    messages.push({
      role: "user",
      content: userQuestion
    });

    return messages;
  }
}
