export const DESIGN_TOKENS = {
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  radius: {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  animation: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  typography: {
    h1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  },
  layout: {
    maxWidth: "max-w-7xl",
    sidebarWidth: "280px",
  },
  transition: {
    default: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-150 ease-in-out",
  }
} as const;
