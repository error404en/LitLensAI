import { Paper } from "../types";
import { MOCK_PAPERS } from "../mock-data";

// In-memory store to simulate database mutations
let papersData: Paper[] = [...MOCK_PAPERS];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PapersRepository = {
  async findAll(): Promise<Paper[]> {
    await delay(300);
    return [...papersData];
  },

  async findById(id: string): Promise<Paper | null> {
    await delay(200);
    const paper = papersData.find((p) => p.id === id);
    return paper ? { ...paper } : null;
  },

  async findByProjectId(projectId: string): Promise<Paper[]> {
    await delay(200);
    return papersData.filter(p => p.projectId === projectId);
  },

  async create(paper: Omit<Paper, "id" | "createdAt" | "updatedAt" | "uploadedAt">): Promise<Paper> {
    await delay(400);
    const newPaper: Paper = {
      ...paper,
      id: `paper_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    papersData = [newPaper, ...papersData];
    return newPaper;
  },

  async update(id: string, updates: Partial<Omit<Paper, "id" | "createdAt" | "updatedAt">>): Promise<Paper> {
    await delay(300);
    const index = papersData.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Paper not found");

    const updatedPaper = {
      ...papersData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    papersData[index] = updatedPaper;
    return updatedPaper;
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    papersData = papersData.filter((p) => p.id !== id);
  }
};
