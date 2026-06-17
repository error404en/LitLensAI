import { ICache } from "./index";

export class MemoryCache<K, V> implements ICache<K, V> {
  private store = new Map<K, { value: V; expiresAt: number }>();

  async get(key: K): Promise<V | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: K, value: V, ttlMs: number = 3600000): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async delete(key: K): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
