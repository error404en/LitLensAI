export class TokenEstimator {
  /**
   * Extremely simple heuristic for token estimation during streams.
   * ~4 characters = 1 token for English text.
   */
  static estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }
}
