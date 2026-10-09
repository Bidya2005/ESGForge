import { apiRequest } from "./api";

export async function login(email, password) {
  const data = await apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  localStorage.setItem("esgforge_token", data.access_token);

  return data;
}

export function logout() {
  localStorage.removeItem("esgforge_token");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("esgforge_token"));
}