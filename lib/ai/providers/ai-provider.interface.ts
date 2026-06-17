export interface AIProvider {
  /**
   * Generates a response based on an array of messages
   */
  generate(messages: any[]): Promise<string>;

  /**
   * Embeds text into a vector
   */
  embed(text: string): Promise<number[]>;
  
  /**
   * Embeds multiple texts into vectors
   */
  embedBatch(texts: string[]): Promise<number[][]>;

  /**
   * Streams a response based on an array of messages
   */
  stream(messages: any[]): AsyncIterable<string>;

  /**
   * Checks if the provider is healthy and correctly configured
   */
  health(): Promise<boolean>;
}
