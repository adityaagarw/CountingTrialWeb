// useWebSocket.js
import { useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const webSocketRef = useRef(null);

  useEffect(() => {
    const connectToWebSocket = () => {
      try {
        const webSocket = new WebSocket(url);
        webSocketRef.current = webSocket;

        webSocket.onopen = () => {
          console.log('WebSocket connected');
        };

        webSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          return data;
        };

        webSocket.onerror = (event) => {
          console.error('WebSocket error:', event);
        };

        webSocket.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          // Attempt to reconnect after a delay
          setTimeout(() => {
            connectToWebSocket();
          }, 5000);
        };

        return () => {
          webSocket.close();
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          connectToWebSocket();
        }, 5000);
      }
    };

    connectToWebSocket();
  }, [url]);

  return webSocketRef.current;
};

export default useWebSocket;