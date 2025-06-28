
export const API_URL = import.meta.env.VITE_API_URL;

// Fallback URL for when primary API is not available
export const FALLBACK_API_URL = 'http://localhost:3001'; // You can change this

// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// API availability status
export let isUsingFallback = false;

export const setFallbackMode = (enabled: boolean) => {
  isUsingFallback = enabled;
  if (enabled) {
    console.info('🔄 Using fallback mock data - API not reachable');
  } else {
    console.info('✅ Connected to live API');
  }
};
