
import React from 'react';
import { Badge } from './badge';
import { Database, Wifi, WifiOff } from 'lucide-react';
import { useApiService } from '@/hooks/useApiService';

const SupabaseConnectionStatus = () => {
  const { isInitialized, isUsingSupabase } = useApiService();

  if (!isInitialized) {
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <Database className="w-3 h-3 animate-pulse" />
        <span>Initializing...</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isUsingSupabase ? "default" : "secondary"} 
      className="flex items-center space-x-1"
    >
      {isUsingSupabase ? (
        <>
          <Database className="w-3 h-3" />
          <span>Supabase</span>
        </>
      ) : (
        <>
          <Wifi className="w-3 h-3" />
          <span>External API</span>
        </>
      )}
    </Badge>
  );
};

export default SupabaseConnectionStatus;
