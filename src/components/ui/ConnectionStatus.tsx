
import React, { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Database, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useApiService } from '@/hooks/useApiService';

const ConnectionStatus = () => {
  const { isInitialized, isUsingSupabase } = useApiService();

  if (!isInitialized) {
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <AlertCircle className="w-3 h-3 animate-pulse" />
        <span>Connecting...</span>
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
          <span>Supabase DB</span>
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

export default ConnectionStatus;
