const defaultApiBase =
  process.env.NODE_ENV === "production"
    ? "https://first-project-murex-sigma.vercel.app"
    : "http://localhost:4000";

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || defaultApiBase).replace(/\/$/, "");

export const apiUrl = (path: string) => `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
