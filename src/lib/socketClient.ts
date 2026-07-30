type SocketHandler = (data: any) => void;

class SocketClientService {
  private handlers: Map<string, SocketHandler[]> = new Map();
  private timer: NodeJS.Timeout | null = null;
  private connected: boolean = false;

  public connect() {
    if (this.connected) return;
    this.connected = true;

    // Simulate periodic socket updates (every 8 seconds)
    this.timer = setInterval(() => {
      const mockSocketEvents = [
        {
          event: 'workout_updated',
          payload: { message: 'AI auto-decreased Bench Press volume by 5% based on elevated morning RHR.', timestamp: new Date().toLocaleTimeString() }
        },
        {
          event: 'recovery_score_updated',
          payload: { overallScore: 88, hrvMs: 68, message: 'HRV baseline recovered to 68ms (+4% shift).', timestamp: new Date().toLocaleTimeString() }
        },
        {
          event: 'notification_received',
          payload: { title: 'Hydration Target Alert', message: 'Hydration status optimal for upcoming Push A session.', timestamp: new Date().toLocaleTimeString() }
        }
      ];

      const randomEvent = mockSocketEvents[Math.floor(Math.random() * mockSocketEvents.length)];
      this.emitToSubscribers(randomEvent.event, randomEvent.payload);
      this.emitToSubscribers('live_feed', randomEvent.payload);
    }, 8000);
  }

  public disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.connected = false;
  }

  public on(eventName: string, handler: SocketHandler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  public off(eventName: string, handler: SocketHandler) {
    if (!this.handlers.has(eventName)) return;
    const filtered = this.handlers.get(eventName)!.filter(h => h !== handler);
    this.handlers.set(eventName, filtered);
  }

  private emitToSubscribers(eventName: string, payload: any) {
    const list = this.handlers.get(eventName);
    if (list) {
      list.forEach(h => h(payload));
    }
  }
}

export const socketClient = new SocketClientService();
