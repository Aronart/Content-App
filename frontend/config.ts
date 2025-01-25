export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION,
} as const;

// Validate config at startup
if (!API_CONFIG.BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

// Match backend API structure (config.py: API_V1_STR = "/api")
export const API_BASE = `${API_CONFIG.BASE_URL}/api`;
