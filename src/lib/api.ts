export const API_BASE_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

// The backend's destination read endpoints (`GET /destinations` and
// `GET /destinations/:id`) are gated by a shared placeholder token.
export const destinationAuthHeaders = {
  authorization: "User Login",
} as const;
