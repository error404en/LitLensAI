import { Inngest } from "inngest";

// Create an Inngest client to send and receive events
export const inngest = new Inngest({ 
  id: "litlens-ai-pipeline",
  isDev: process.env.NODE_ENV === "development" || process.env.INNGEST_DEV === "true" || process.env.INNGEST_DEV === "1",
});
