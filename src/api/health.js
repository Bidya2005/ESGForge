import { apiRequest } from "./api";

export async function checkBackendHealth() {
  return apiRequest("/api/v1/health/");
}