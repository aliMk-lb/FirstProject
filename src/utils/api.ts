export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000").replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

