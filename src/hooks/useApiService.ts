
import { useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';

export const useApiService = () => {
  const [isInitialized, setIsInitialized] = useState(true); // Always initialized for Node.js backend
  const [isUsingSupabase, setIsUsingSupabase] = useState(false); // Always false now

  useEffect(() => {
    // No initialization needed for Node.js backend
    setIsInitialized(true);
    setIsUsingSupabase(false);
  }, []);

  return {
    apiService,
    isInitialized,
    isUsingSupabase
  };
};
