import { inngest } from "./inngest.client";
import { AIPipelineService } from "@/services/ai-pipeline.service";

export const processPaper = inngest.createFunction(
  { 
    id: "process-paper", 
    triggers: [{ event: "paper.uploaded" }],
    retries: 3,
    onFailure: async ({ event, error }) => {
      const paperId = (event.data.event.data as { paperId?: string }).paperId;
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
      console.log(`[🚀 Inngest] Starting processing for paper ID: ${paperId}`);
      await pipelineService.updateStatus(paperId, "processing");
    });

    // 2. Extract
    const { extraction } = await step.run("extract-pdf", async () => {
      console.log(`[📄 Inngest] Extracting text from PDF for paper ID: ${paperId}`);
      return await pipelineService.extract(paperId);
    });

    // 3. Chunk
    await step.run("mark-chunking", async () => {
      console.log(`[✂️ Inngest] Chunking document for paper ID: ${paperId}`);
      await pipelineService.updateStatus(paperId, "chunking");
    });
    const chunks = await step.run("chunk-document", async () => {
      return await pipelineService.chunk(paperId, extraction.fullText);
    });

    // 4. Parallel execution of Embedding and Metadata Generation
    await step.run("mark-analyzing", async () => {
      console.log(`[🧠 Inngest] Analyzing and embedding ${chunks.length} chunks for paper ID: ${paperId}`);
      await pipelineService.updateStatus(paperId, "embedding");
    });

    const [{ points }] = await Promise.all([
      step.run("embed-chunks", async () => {
        return await pipelineService.embed(paperId, chunks);
      }),
      step.run("generate-metadata", async () => {
        console.log(`[🤖 Inngest] Generating metadata for paper ID: ${paperId}`);
        return await pipelineService.generateMetadata(paperId, extraction);
      })
    ]);

    // 5. Store Vectors
    await step.run("store-vectors", async () => {
      console.log(`[💾 Inngest] Storing vectors in Qdrant for paper ID: ${paperId}`);
      await pipelineService.storeVectors(paperId, points);
    });

    // 7. Complete
    await step.run("mark-completed", async () => {
      console.log(`[✅ Inngest] Successfully completed processing for paper ID: ${paperId}`);
      await pipelineService.updateStatus(paperId, "completed");
    });

    return { paperId, status: "completed", chunks: chunks.length };
  }
);
