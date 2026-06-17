"use client";

import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";

export function GlobalRealtime() {
  useSupabaseRealtime();
  return null;
}
