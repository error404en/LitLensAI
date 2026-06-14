import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PaperStatus } from "./types";

/**
 * Merges tailwind classes safely
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Truncates text to a specified maximum length and appends an ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Formats a list of authors into a readable string
 */
export function formatAuthors(authors: readonly { name: string }[]): string {
  if (!authors || authors.length === 0) return "Unknown Authors";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
  return `${authors[0].name} et al.`;
}

/**
 * Returns a corresponding color class based on the paper status
 */
export function getStatusColor(status: PaperStatus): string {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    case "failed":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    case "queued":
    case "processing":
    case "embedding":
    case "summarizing":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
  }
}

/**
 * Converts file size in bytes to a human-readable string
 */
export function safeFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || bytes < 0) return "Unknown Size";
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
