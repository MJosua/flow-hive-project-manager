
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '@/config/sourceConfig';
import { checkApiAvailability, getMockResponse } from './mockApiService';

let isApiAvailable = true;
let lastApiCheck = 0;
const API_CHECK_INTERVAL = 30000; // Check every 30 seconds

// Check API availability periodically
const checkApi = async () => {
  const now = Date.now();
  if (now - lastApiCheck > API_CHECK_INTERVAL) {
    isApiAvailable = await checkApiAvailability();
    lastApiCheck = now;
  }
  return isApiAvailable;
};

// Enhanced axios instance with fallback
const createApiCall = async (config: any): Promise<AxiosResponse> => {
  try {
    // First try the real API
    const response = await axios(config);
    isApiAvailable = true;
    return response;
  } catch (error) {
    console.warn('API call failed, attempting fallback to mock data');
    
    // Check if we should use mock data
    const shouldUseMock = !(await checkApi());
    
    if (shouldUseMock) {
      // Return mock response
      const mockResponse = getMockResponse(config.url, config.method?.toUpperCase());
      return {
        data: mockResponse,
        status: mockResponse.success ? 200 : 400,
        statusText: mockResponse.success ? 'OK' : 'Bad Request',
        headers: {},
        config: config
      } as AxiosResponse;
    }
    
    throw error;
  }
};

// Export enhanced API service
export const apiService = {
  get: (url: string, config?: any) => createApiCall({ ...config, method: 'GET', url }),
  post: (url: string, data?: any, config?: any) => createApiCall({ ...config, method: 'POST', url, data }),
  put: (url: string, data?: any, config?: any) => createApiCall({ ...config, method: 'PUT', url, data }),
  delete: (url: string, config?: any) => createApiCall({ ...config, method: 'DELETE', url }),
  patch: (url: string, data?: any, config?: any) => createApiCall({ ...config, method: 'PATCH', url, data })
};

export { checkApiAvailability, isApiAvailable };
