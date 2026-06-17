import { TaskRegistry, TaskConfiguration } from "./TaskRegistry";

export type FeatureName = 
  | "AI Chat"
  | "Summarize"
  | "Compare"
  | "Review"
  | "Knowledge Graph"
  | "Analytics";

export class FeatureRegistry {
  /**
   * Maps a high-level UI Feature to an internal Task Configuration.
   */
  static getTaskForFeature(feature: FeatureName): TaskConfiguration {
    switch (feature) {
      case "AI Chat":
        return TaskRegistry.chat;
      case "Summarize":
        return TaskRegistry.summarize;
      case "Compare":
        return TaskRegistry.compare;
      case "Review":
        return TaskRegistry.review;
      case "Knowledge Graph":
        return TaskRegistry.topic_cluster;
      case "Analytics":
        return TaskRegistry.research_insights;
      default:
        throw new Error(`Feature ${feature} is not mapped to any task.`);
    }
  }
}
