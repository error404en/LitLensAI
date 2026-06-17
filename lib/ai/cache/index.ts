export interface ICache<K, V> {
  get(key: K): Promise<V | null>;
  set(key: K, value: V, ttlMs?: number): Promise<void>;
  delete(key: K): Promise<void>;
  clear(): Promise<void>;
}
