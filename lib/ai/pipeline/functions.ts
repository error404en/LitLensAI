import { inngest } from "./inngest.client";
import { AIPipelineService } from "@/services/ai-pipeline.service";

export const processPaper = inngest.createFunction(
  { 
    id: "process-paper", 
    triggers: [{ event: "paper.uploaded" }],
    retries: 3,
    onFailure: async ({ event, error }) => {
      const paperId = (event.data.event.data as any).paperId;
      if (paperId) {
        const pipelineService = new AIPipelineService();
        await pipelineService.updateStatus(paperId, "failed", error.message);
      }
    }
  },
  async ({ event, step }) => {
    const paperId = (event.data as { paperId: string }).paperId;
    const pipelineService = new AIPipelineService();

    // 1. Initial State
    await step.run("mark-processing", async () => {
      await pipelineService.updateStatus(paperId, "processing");
    });

    // 2. Extract
    const { extraction } = await step.run("extract-pdf", async () => {
      return await pipelineService.extract(paperId);
    });

    // 3. Chunk
    await step.run("mark-chunking", async () => {
      await pipelineService.updateStatus(paperId, "chunking");
    });
    const chunks = await step.run("chunk-document", async () => {
      return await pipelineService.chunk(paperId, extraction.fullText);
    });

    // 4. Embed
    await step.run("mark-embedding", async () => {
      await pipelineService.updateStatus(paperId, "embedding");
    });
    const { points } = await step.run("embed-chunks", async () => {
      return await pipelineService.embed(paperId, chunks);
    });

    // 5. Store Vectors
    await step.run("store-vectors", async () => {
      await pipelineService.storeVectors(paperId, points);
    });

    // 6. Metadata Generate
    await step.run("generate-metadata", async () => {
      await pipelineService.generateMetadata(paperId, extraction);
    });

    // 7. Complete
    await step.run("mark-completed", async () => {
      await pipelineService.updateStatus(paperId, "completed");
    });

    return { paperId, status: "completed", chunks: chunks.length };
  }
);
