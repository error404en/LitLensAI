import { PapersRepository } from "../lib/repositories/papers.repository";
import { Paper } from "../lib/types";
import { CreatePaperSchema } from "../lib/validations/paper.schema";

export const PapersService = {
  async getPapers(projectId?: string): Promise<Paper[]> {
    try {
      if (projectId) {
        return await PapersRepository.findByProjectId(projectId);
      }
      return await PapersRepository.findAll();
    } catch (error) {
      console.error("PapersService.getPapers:", error);
      throw new Error("Failed to fetch papers");
    }
  },

  async getPaper(id: string): Promise<Paper> {
    try {
      const paper = await PapersRepository.findById(id);
      if (!paper) throw new Error("Paper not found");
      return paper;
    } catch (error) {
      console.error("PapersService.getPaper:", error);
      throw new Error("Failed to fetch paper details");
    }
  },

  async createPaper(paperData: Omit<Paper, "id" | "createdAt" | "updatedAt" | "uploadedAt">): Promise<Paper> {
    try {
      // Validate with Zod
      const validatedData = CreatePaperSchema.parse(paperData);
      return await PapersRepository.create(validatedData);
    } catch (error) {
      console.error("PapersService.createPaper:", error);
      throw error;
    }
  },

  async updatePaper(id: string, updates: Partial<Paper>): Promise<Paper> {
    try {
      return await PapersRepository.update(id, updates);
    } catch (error) {
      console.error("PapersService.updatePaper:", error);
      throw new Error("Failed to update paper");
    }
  },

  async deletePaper(id: string): Promise<void> {
    try {
      await PapersRepository.delete(id);
    } catch (error) {
      console.error("PapersService.deletePaper:", error);
      throw new Error("Failed to delete paper");
    }
  }
};
