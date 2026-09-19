import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fireguard_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiError(error, fallback = "Something went wrong") {
  if (!error?.response) {
    if (error?.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
    return "Unable to connect to server. Please check your connection or server status.";
  }
  const data = error.response.data;
  if (data?.error) {
    if (data.details?.fieldErrors) {
      const fieldMessages = Object.entries(data.details.fieldErrors)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join("; ");
      if (fieldMessages) return `${data.error} (${fieldMessages})`;
    }
    return data.error;
  }
  return fallback;
}

