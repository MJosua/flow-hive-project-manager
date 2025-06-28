
import { useEffect, useState } from 'react';
import { apiService } from '@/services/apiService';

export const useApiService = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  useEffect(() => {
    const initializeApi = async () => {
      await apiService.initialize();
      setIsUsingSupabase((apiService as any).useSupabase);
      setIsInitialized(true);
    };

    initializeApi();
  }, []);

  return {
    apiService,
    isInitialized,
    isUsingSupabase
  };
};
