export class ResponseFormatter {
  static format(rawResponse: string, format: "markdown" | "json" | "plain_text"): string | object {
    if (format === "json") {
      try {
        const cleaned = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse JSON response:", rawResponse);
        return { error: "Failed to parse JSON response", raw: rawResponse };
      }
    }
    
    if (format === "plain_text") {
      // Very basic stripping of markdown characters if needed
      return rawResponse.replace(/[*_#`~]/g, "");
    }
    
    return rawResponse; // Default to markdown
  }
}
