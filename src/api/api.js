const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("esgforge_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      "Unable to connect to ESGForge backend. Please check that the backend is running."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  /* ================================
     AUTHENTICATION ERROR
     ================================ */

  if (response.status === 401) {
    localStorage.removeItem("esgforge_token");
    localStorage.removeItem("esgforge_submission_id");
    localStorage.removeItem("esgforge_version_id");

    const error = new Error(
      "Your session has expired. Please log in again."
    );

    error.status = 401;
    error.code = "AUTH_EXPIRED";

    throw error;
  }

  /* ================================
     PERMISSION ERROR
     ================================ */

  if (response.status === 403) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        "You do not have permission to perform this action."
    );

    error.status = 403;
    error.code = "FORBIDDEN";

    throw error;
  }

  /* ================================
     NOT FOUND
     ================================ */

  if (response.status === 404) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        "The requested ESGForge resource was not found."
    );

    error.status = 404;
    error.code = "NOT_FOUND";

    throw error;
  }

  /* ================================
     CONFLICT
     ================================ */

  if (response.status === 409) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        "This action conflicts with the current submission state."
    );

    error.status = 409;
    error.code = "CONFLICT";

    throw error;
  }

  /* ================================
     VALIDATION ERROR
     ================================ */

  if (response.status === 422) {
    let message = "The submitted data is invalid.";

    if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => {
          const field = item?.loc?.slice(-1)?.[0] || "field";
          return `${field}: ${item?.msg || "Invalid value"}`;
        })
        .join("\n");
    } else if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (typeof data?.message === "string") {
      message = data.message;
    }

    const error = new Error(message);

    error.status = 422;
    error.code = "VALIDATION_ERROR";

    throw error;
  }

  /* ================================
     SERVER ERROR
     ================================ */

  if (response.status >= 500) {
    const error = new Error(
      data?.detail ||
        data?.message ||
        "ESGForge backend encountered a server error."
    );

    error.status = response.status;
    error.code = "SERVER_ERROR";

    throw error;
  }

  /* ================================
     OTHER HTTP ERRORS
     ================================ */

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    const error = new Error(
      typeof message === "string"
        ? message
        : JSON.stringify(message)
    );

    error.status = response.status;
    error.code = "API_ERROR";

    throw error;
  }

  return data;
}

export { API_BASE_URL };