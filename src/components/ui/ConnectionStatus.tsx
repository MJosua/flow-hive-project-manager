
import React, { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { checkApiAvailability } from '@/services/apiService';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      const connected = await checkApiAvailability();
      setIsConnected(connected);
      setIsChecking(false);
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <AlertCircle className="w-3 h-3 animate-pulse" />
        <span>Checking...</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className="flex items-center space-x-1"
    >
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Live API</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Mock Data</span>
        </>
      )}
    </Badge>
  );
};

export default ConnectionStatus;
