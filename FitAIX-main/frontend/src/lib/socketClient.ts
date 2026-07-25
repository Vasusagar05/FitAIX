import { io, Socket } from 'socket.io-client';

type SocketHandler = (data: any) => void;

class SocketClientService {
  private socket: Socket | null = null;

  public connect() {
    if (this.socket) return;
    
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(eventName: string, handler: SocketHandler) {
    if (!this.socket) this.connect();
    this.socket?.on(eventName, handler);
  }

  public off(eventName: string, handler: SocketHandler) {
    if (!this.socket) return;
    this.socket.off(eventName, handler);
  }
}

export const socketClient = new SocketClientService();
