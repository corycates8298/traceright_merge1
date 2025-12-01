// src/const.ts
// The "Crash Proof" URL Handler
export const getApiUrl = () => {
  // Fallback to localhost if env var is missing (Prevents the "Invalid URL" crash)
  return import.meta.env.VITE_API_URL || "http://localhost:3000";
};

export const getLoginUrl = () => {
  try {
    return new URL('/auth/login', getApiUrl()).toString();
  } catch (e) {
    console.error("API URL Error:", e);
    return "/login"; // Safe fallback
  }
};

export const APP_TITLE = "Apex Intelligence";
export const APP_LOGO = "/logo.png"; // Placeholder
