export type TaskName = 
  | "summarize"
  | "explain"
  | "compare"
  | "review"
  | "extract_keywords"
  | "generate_questions"
  | "translate"
  | "simplify"
  | "citation"
  | "research_insights"
  | "topic_cluster"
  | "chat";

export interface TaskConfiguration {
  name: TaskName;
  systemPrompt: string;
  requiresRetrieval: boolean;
  defaultFormat: "markdown" | "json" | "plain_text";
  defaultTemperature: number;
}

export const TaskRegistry: Record<TaskName, TaskConfiguration> = {
  chat: {
    name: "chat",
    systemPrompt: "You are an AI Research Assistant. Answer the user's questions based on the provided context.",
    requiresRetrieval: true,
    defaultFormat: "markdown",
    defaultTemperature: 0.7,
  },
  summarize: {
    name: "summarize",
    systemPrompt: "You are an AI Research Assistant. Summarize the following academic content accurately and concisely.",
    requiresRetrieval: false,
    defaultFormat: "markdown",
    defaultTemperature: 0.3,
  },
  compare: {
    name: "compare",
    systemPrompt: "You are an AI Research Assistant. Compare the methodologies and findings of the provided papers.",
    requiresRetrieval: true,
    defaultFormat: "markdown",
    defaultTemperature: 0.4,
  },
  explain: {
    name: "explain",
    systemPrompt: "Explain the selected academic text in simpler terms suitable for a graduate student.",
    requiresRetrieval: false,
    defaultFormat: "markdown",
    defaultTemperature: 0.5,
  },
  review: {
    name: "review",
    systemPrompt: "Write a comprehensive literature review synthesizing the following papers.",
    requiresRetrieval: true,
    defaultFormat: "markdown",
    defaultTemperature: 0.6,
  },
  extract_keywords: {
    name: "extract_keywords",
    systemPrompt: "Extract the top 10 keywords from this text. Return strictly as JSON array of strings.",
    requiresRetrieval: false,
    defaultFormat: "json",
    defaultTemperature: 0.1,
  },
  generate_questions: {
    name: "generate_questions",
    systemPrompt: "Generate 5 critical thinking questions based on this research text.",
    requiresRetrieval: false,
    defaultFormat: "markdown",
    defaultTemperature: 0.7,
  },
  translate: {
    name: "translate",
    systemPrompt: "Translate the provided text to English.",
    requiresRetrieval: false,
    defaultFormat: "plain_text",
    defaultTemperature: 0.1,
  },
  simplify: {
    name: "simplify",
    systemPrompt: "Simplify the provided text so a high schooler can understand it.",
    requiresRetrieval: false,
    defaultFormat: "plain_text",
    defaultTemperature: 0.4,
  },
  citation: {
    name: "citation",
    systemPrompt: "Generate a formatted citation for the provided metadata.",
    requiresRetrieval: false,
    defaultFormat: "plain_text",
    defaultTemperature: 0.0,
  },
  research_insights: {
    name: "research_insights",
    systemPrompt: "Identify research gaps, novel contributions, and key insights from the provided text.",
    requiresRetrieval: true,
    defaultFormat: "markdown",
    defaultTemperature: 0.5,
  },
  topic_cluster: {
    name: "topic_cluster",
    systemPrompt: "Cluster the following topics/keywords into logical categories. Return JSON.",
    requiresRetrieval: true,
    defaultFormat: "json",
    defaultTemperature: 0.2,
  }
};
