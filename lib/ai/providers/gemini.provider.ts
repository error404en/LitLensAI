import { AIProvider } from "./ai-provider.interface";
import { Message } from "../prompt/prompt-builder";

export class GeminiProvider implements AIProvider {
  async generate(messages: Message[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');
    
    const contents = otherMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || "" }]
    }));

    // Merge consecutive messages of the same role
    const mergedContents = [];
    for (const content of contents) {
      if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === content.role) {
        mergedContents[mergedContents.length - 1].parts[0].text += "\n" + content.parts[0].text;
      } else {
        mergedContents.push(content);
      }
    }

    interface GeminiPayload {
      contents: typeof mergedContents;
      generationConfig: { temperature: number };
      systemInstruction?: {
        parts: Array<{ text: string }>;
      };
    }

    const payload: GeminiPayload = {
      contents: mergedContents,
      generationConfig: { temperature: 0 }
    };

    if (systemMessage) {
      payload.systemInstruction = {
        parts: [{ text: systemMessage.content }]
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  async embed(text: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text }],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini embed API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.embedding?.values || [];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const requests = texts.map(text => ({
      model: "models/text-embedding-004",
      content: {
        parts: [{ text }],
      },
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini embedBatch API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return (data.embeddings || []).map((e: { values: number[] }) => e.values);
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');
    
    const contents = otherMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || "" }]
    }));

    const mergedContents = [];
    for (const content of contents) {
      if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === content.role) {
        mergedContents[mergedContents.length - 1].parts[0].text += "\n" + content.parts[0].text;
      } else {
        mergedContents.push(content);
      }
    }

    interface GeminiPayload {
      contents: typeof mergedContents;
      generationConfig: { temperature: number };
      systemInstruction?: {
        parts: Array<{ text: string }>;
      };
    }

    const payload: GeminiPayload = {
      contents: mergedContents,
      generationConfig: { temperature: 0 }
    };

    if (systemMessage) {
      payload.systemInstruction = {
        parts: [{ text: systemMessage.content }]
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini streaming API error: ${response.statusText} - ${errorText}`);
    }

    if (!response.body) {
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.slice(5).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  yield text;
                }
              } catch {
                // Ignore parsing errors for partial lines
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async health(): Promise<boolean> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return false;
      const res = await this.embed("test");
      return res.length > 0;
    } catch {
      return false;
    }
  }
}
