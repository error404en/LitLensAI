import { PipelineRepository } from "../lib/repositories/pipeline.repository";
import { ChunkRepository } from "../lib/repositories/chunk.repository";
import { VectorRepository } from "../lib/repositories/vector.repository";
import { PDFParserService } from "../lib/ai/parser/pdf.parser";
import { DocumentChunker } from "../lib/ai/chunker/chunker";
import { OpenAIProvider } from "../lib/ai/providers/openai.provider";
import { QdrantRepository } from "../lib/ai/vector/qdrant.client";
import { adminClient } from "../lib/supabase/admin";
import { PapersRepository } from "../lib/repositories/papers.repository";
import { v4 as uuidv4 } from "uuid";

export class AIPipelineService {
  private pipelineRepo = PipelineRepository;
  private chunkRepo = ChunkRepository;
  private vectorRepo = VectorRepository;
  private pdfParser = new PDFParserService();
  private chunker = new DocumentChunker();
  private aiProvider = new OpenAIProvider();
  private qdrant = new QdrantRepository();
  private papersRepo = PapersRepository;

  async updateStatus(paperId: string, status: string, error?: string) {
    await this.pipelineRepo.upsertJob(paperId, status, error);
    // Also notify UI by updating paper status if needed
    // Actually, pipeline_jobs table covers it, but maybe papers needs status="completed"
    if (status === "completed" || status === "failed") {
      const supabase = adminClient;
      await supabase.from("papers").update({ processing_status: status }).eq("id", paperId);
    }
  }

  async extract(paperId: string) {
    await this.pipelineRepo.log(paperId, "extract", "Started PDF extraction");
    const supabase = adminClient;
    
    // 1. Get paper info
    const { data: paper, error } = await supabase.from("papers").select("file_url").eq("id", paperId).single();
    if (error || !paper) throw new Error("Paper not found");

    // 2. Download from storage
    // file_url is the path in the bucket
    const { data: fileData, error: downloadError } = await supabase.storage.from("papers-bucket").download(paper.file_url);
    if (downloadError || !fileData) throw new Error("Failed to download PDF");

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Parse
    const extraction = await this.pdfParser.extract(buffer);
    
    // Update paper metadata with initial extracted info if missing
    await supabase.from("papers").update({
      title: extraction.title !== "Untitled Document" ? extraction.title : undefined,
      metadata: extraction.metadata,
    }).eq("id", paperId);

    await this.pipelineRepo.log(paperId, "extract", "Extraction successful");
    
    return { extraction, buffer };
  }

  async chunk(paperId: string, text: string) {
    await this.pipelineRepo.log(paperId, "chunk", "Started document chunking");
    
    const chunks = await this.chunker.chunk(text);
    
    // Save to DB
    const dbChunks = await this.chunkRepo.insertChunks(paperId, chunks);
    
    await this.pipelineRepo.log(paperId, "chunk", `Created ${chunks.length} chunks`);
    return dbChunks; // returns id, paper_id, etc.
  }

  async embed(paperId: string, chunks: any[]) {
    await this.pipelineRepo.log(paperId, "embed", "Started embedding generation");
    
    const texts = chunks.map(c => c.content);
    
    // Batch process to avoid hitting limits (simple batching)
    const BATCH_SIZE = 100;
    let embeddings: number[][] = [];
    
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const batchEmbeddings = await this.aiProvider.embedBatch(batch);
      embeddings = embeddings.concat(batchEmbeddings);
    }

    const points = chunks.map((chunk, i) => {
      const pointId = uuidv4();
      return {
        pointId,
        chunkId: chunk.id,
        vector: embeddings[i],
        payload: {
          paperId: paperId,
          chunkId: chunk.id,
          pageNumber: chunk.page_number,
          content: chunk.content,
        }
      };
    });

    await this.pipelineRepo.log(paperId, "embed", "Embedding generation successful");
    return { embeddings, points };
  }

  async storeVectors(paperId: string, points: any[]) {
    await this.pipelineRepo.log(paperId, "store-vectors", "Storing vectors in Qdrant and metadata in DB");
    
    // 1. Ensure collection exists
    await this.qdrant.initCollection();

    // 2. Insert to Qdrant
    await this.qdrant.insertVectors(points.map(p => ({
      id: p.pointId,
      vector: p.vector,
      payload: p.payload
    })));

    // 3. Store vector metadata in DB
    await this.vectorRepo.insertMetadata(paperId, points.map(p => ({
      chunkId: p.chunkId,
      qdrantPointId: p.pointId
    })));

    await this.pipelineRepo.log(paperId, "store-vectors", "Vectors stored successfully");
  }

  async generateMetadata(paperId: string, extraction: any) {
    await this.pipelineRepo.log(paperId, "generate-metadata", "Generating advanced metadata");
    
    const prompt = `Analyze this abstract/intro and generate 5 keywords and a 2 sentence summary.
Text: ${extraction.fullText.substring(0, 3000)}

Format as JSON:
{
  "keywords": ["keyword1", "keyword2"],
  "summary": "This paper discusses..."
}`;
    
    try {
      const messages = [
        { role: "system", content: "You are a helpful research assistant. Return ONLY JSON." },
        { role: "user", content: prompt }
      ];
      const response = await this.aiProvider.generate(messages);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const meta = JSON.parse(cleaned);
      
      const supabase = adminClient;
      await supabase.from("papers").update({
        summary: meta.summary,
        keywords: meta.keywords,
      }).eq("id", paperId);
      
    } catch (e) {
      console.error("Failed to generate metadata", e);
      await this.pipelineRepo.log(paperId, "generate-metadata", "Metadata generation failed or skipped");
    }
  }
}
