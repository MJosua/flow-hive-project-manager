
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection (dummy for offline demo)
    socketRef.current = io(url, {
      autoConnect: false // Keep disconnected for offline demo
    });

    // Simulate real-time updates with dummy data
    const interval = setInterval(() => {
      // Simulate receiving real-time notifications
      console.log('Socket: Simulated real-time update');
    }, 30000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
    // For demo purposes, just log the emit
    console.log(`Socket emit: ${event}`, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return { emit, on, off };
};
