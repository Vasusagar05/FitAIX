import { useEffect } from 'react';
import { socketClient } from '@/lib/socketClient';

export function useSocketEvents(eventName: string, handler: (data: any) => void) {
  useEffect(() => {
    socketClient.connect();
    socketClient.on(eventName, handler);

    return () => {
      socketClient.off(eventName, handler);
    };
  }, [eventName, handler]);
}
