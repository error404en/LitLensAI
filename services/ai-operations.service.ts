import { FeatureName } from "../lib/ai/orchestrator/FeatureRegistry";
import { OrchestrationContext } from "../lib/ai/orchestrator/ExecutionContext";
import { orchestrator } from "../lib/ai/orchestrator/AIOrchestrator";
import { ConversationRepository, Message } from "../lib/repositories/conversation.repository";
import { BuildContextOptions } from "../lib/ai/context/context-builder";
import { StreamEvent } from "../lib/ai/stream/stream-handler";

export class AIOperationsService {
  /**
   * Universal entrypoint to execute a task and wait for the full response.
   */
  async executeTask(feature: FeatureName, context: OrchestrationContext): Promise<string | object> {
    return orchestrator.execute(feature, context);
  }

  /**
   * Universal entrypoint to execute a task and stream the response back.
   */
  async streamTask(feature: FeatureName, context: OrchestrationContext): Promise<AsyncIterable<StreamEvent>> {
    return orchestrator.executeStream(feature, context);
  }

  // --- Convenience Wrappers for common features ---

  async summarize(userId: string, paperId: string, query: string = "Summarize this paper") {
    return this.executeTask("Summarize", {
      userId,
      paperId,
      query
    });
  }

  async compare(userId: string, projectId: string, query: string) {
    return this.executeTask("Compare", {
      userId,
      projectId,
      query
    });
  }

  async explain(userId: string, selection: string) {
    return this.executeTask("Summarize", { // or create an Explain feature mapping
      userId,
      query: "Explain this selection",
      selection: { text: selection }
    });
  }

  async review(userId: string, projectId: string, query: string) {
    return this.executeTask("Review", {
      userId,
      projectId,
      query
    });
  }

  // --- Legacy / Direct Conversational Methods ---

  async saveConversationMessage(conversationId: string, message: Message) {
    return ConversationRepository.addMessage(conversationId, message);
  }

  async createConversation(userId: string, title: string, context?: { projectId?: string; paperId?: string }) {
    return ConversationRepository.createConversation(userId, title, context);
  }

  async getConversationHistory(conversationId: string) {
    return ConversationRepository.getMessages(conversationId);
  }
}
