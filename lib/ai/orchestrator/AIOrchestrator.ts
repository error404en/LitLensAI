import { FeatureName, FeatureRegistry } from "./FeatureRegistry";
import { OrchestrationContext } from "./ExecutionContext";
import { SemanticRetriever } from "../retriever/semantic-retriever";
import { ContextBuilder } from "../context/context-builder";
import { PromptBuilder } from "../prompt/prompt-builder";
import { providerRegistry } from "../providers/registry";
import { RetryPolicy } from "./RetryPolicy";
import { RateLimiter } from "./RateLimiter";
import { ResponseFormatter } from "./ResponseFormatter";
import { CitationResolver } from "./CitationResolver";
import { UsageTracker } from "./UsageTracker";
import { StreamingManager } from "./StreamingManager";
import { AIExecutionRepository } from "../../repositories/ai-execution.repository";
import { CitationRepository } from "../../repositories/citation.repository";
import { StreamEvent } from "../stream/stream-handler";

export class AIOrchestrator {
  private contextBuilder = new ContextBuilder();
  private promptBuilder = new PromptBuilder();

  /**
   * Universal entrypoint for all AI tasks.
   * Streaming version.
   */
  async executeStream(
    feature: FeatureName,
    context: OrchestrationContext
  ): Promise<AsyncIterable<StreamEvent>> {
    return this._execute(feature, context, true) as Promise<AsyncIterable<StreamEvent>>;
  }

  /**
   * Universal entrypoint for all AI tasks.
   * Non-streaming version.
   */
  async execute(
    feature: FeatureName,
    context: OrchestrationContext
  ): Promise<string | object> {
    return this._execute(feature, context, false) as Promise<string | object>;
  }

  private async _execute(
    feature: FeatureName,
    context: OrchestrationContext,
    stream: boolean
  ) {
    const startTime = Date.now();

    // 1. Validate Rate Limits
    await RateLimiter.checkRateLimit(context.userId);

    // 2. Load Configuration
    const taskConfig = FeatureRegistry.getTaskForFeature(feature);
    const providerName = context.providerName || "openai";
    const provider = providerRegistry.getProvider(providerName);

    // 3. Log Execution Start
    const execution = await AIExecutionRepository.create({
      userId: context.userId,
      projectId: context.projectId,
      paperId: context.paperId,
      taskName: taskConfig.name,
      featureName: feature,
      provider: providerName,
      model: "default", // or fetch from provider instance
    });

    try {
      // 4. Retrieve Context
      let retrievedChunks = context.retrievedChunks || [];
      if (taskConfig.requiresRetrieval && retrievedChunks.length === 0) {
        const retriever = new SemanticRetriever(provider);
        if (context.paperId) {
          retrievedChunks = await retriever.retrieveByPaper(context.query, context.paperId);
        } else if (context.projectId) {
          retrievedChunks = await retriever.retrieveByProject(context.query, context.projectId);
        } else {
          retrievedChunks = await retriever.retrieveTopK(context.query, 5);
        }
      }

      // 5. Build Unified Context & Prompt
      const structuredContext = this.contextBuilder.build({
        selectedText: context.selection?.text,
        retrievedChunks: retrievedChunks,
        conversationHistory: context.conversation?.history,
      });

      const messages = this.promptBuilder.buildMessages(
        taskConfig.systemPrompt,
        structuredContext,
        context.query
      );

      // 6. Execute with Retries
      if (stream) {
        const rawStream = await RetryPolicy.executeWithRetries(() => Promise.resolve(provider.stream(messages)));
        return StreamingManager.adapt(rawStream);
        // Note: For streams, usage tracking and citations might need to be resolved after the stream completes.
        // We defer those to the consumer or a stream wrapper for now.
      } else {
        const rawResponse = await RetryPolicy.executeWithRetries(() => provider.generate(messages));
        
        const format = context.preferences?.format || taskConfig.defaultFormat;
        const formattedResponse = ResponseFormatter.format(rawResponse, format);

        // 7. Resolve Citations
        const citations = CitationResolver.resolve(rawResponse, retrievedChunks);
        if (citations.length > 0) {
          await CitationRepository.saveCitations(execution.id, citations);
        }

        // 8. Track Usage
        // In a real scenario, we'd count tokens dynamically. For now, simulating values.
        await UsageTracker.track({
          userId: context.userId,
          executionId: execution.id,
          promptTokens: 150, // mock
          completionTokens: 50, // mock
          provider: providerName,
        });

        // 9. Update Execution Status
        const duration = Date.now() - startTime;
        await AIExecutionRepository.updateStatus(execution.id, "completed", duration);

        return formattedResponse;
      }
    } catch (error: unknown) {
      // Log Failure
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      await AIExecutionRepository.updateStatus(execution.id, "failed", duration, errorMessage);
      throw error;
    }
  }
}

export const orchestrator = new AIOrchestrator();
