import { blockchain } from './blockchain';
import { MQTTMessage, TrafficStats, IoTDevice } from '../types';

class NetworkSimulator {
  private messages: MQTTMessage[] = [];
  private blockedCount: number = 0;
  private messageCountInLastMinute: number = 0;
  private lastMinuteTimestamp: number = Date.now();
  private unauthorizedAttempts: Map<string, number> = new Map();
  private listeners: ((messages: MQTTMessage[], stats: TrafficStats) => void)[] = [];
  private simulationTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.startSimulation();
  }

  public subscribe(callback: (messages: MQTTMessage[], stats: TrafficStats) => void) {
    this.listeners.push(callback);
    callback(this.messages, this.getStats());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    const stats = this.getStats();
    this.listeners.forEach(l => l(this.messages, stats));
  }

  private getStats(): TrafficStats {
    const devices = blockchain.getDevices();
    const activeDevices = devices.filter(d => d.status === 'AUTHENTICATED').length;
    
    // Reset minute counter if needed
    if (Date.now() - this.lastMinuteTimestamp > 60000) {
      this.messageCountInLastMinute = 0;
      this.lastMinuteTimestamp = Date.now();
    }

    return {
      messagesPerMinute: this.messageCountInLastMinute,
      activeDevices,
      blockedMessages: this.blockedCount
    };
  }

  private startSimulation() {
    const run = () => {
      const devices = blockchain.getDevices();
      if (devices.length > 0) {
        // Pick a random device to "attempt" publishing
        const device = devices[Math.floor(Math.random() * devices.length)];
        this.simulatePublish(device);
      }
      
      // Random interval between 3-5 seconds
      const nextInterval = 3000 + Math.random() * 2000;
      this.simulationTimeout = setTimeout(run, nextInterval);
    };

    run();
  }

  private simulatePublish(device: IoTDevice) {
    // 1. Immediately stop if device is revoked
    if (device.status === 'REVOKED') return;

    const isAuthorized = device.status === 'AUTHENTICATED';

    // 4. Limit unauthorized devices to 3 attempts
    if (!isAuthorized) {
      const attempts = this.unauthorizedAttempts.get(device.id) || 0;
      if (attempts >= 3) return;
      this.unauthorizedAttempts.set(device.id, attempts + 1);
    } else {
      // Reset attempts if device becomes authorized
      this.unauthorizedAttempts.delete(device.id);
    }

    const topics = ['sensor/temperature', 'sensor/humidity', 'device/status'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    let payload = '';

    if (topic === 'sensor/temperature') payload = `${(20 + Math.random() * 10).toFixed(1)}°C`;
    else if (topic === 'sensor/humidity') payload = `${(40 + Math.random() * 30).toFixed(0)}%`;
    else payload = `battery ${(70 + Math.random() * 30).toFixed(0)}%`;

    const message: MQTTMessage = {
      id: Math.random().toString(36).substr(2, 9),
      deviceId: device.id,
      deviceName: device.name,
      topic,
      payload,
      timestamp: Date.now(),
      status: isAuthorized ? 'ALLOWED' : 'BLOCKED'
    };

    if (isAuthorized) {
      this.messageCountInLastMinute++;
    } else {
      this.blockedCount++;
      // Log unauthorized attempt to blockchain audit trail
      (blockchain as any).addAuditLog(
        'UNAUTHORIZED_PUBLISH', 
        device.id, 
        device.name, 
        `Unauthorized publish attempt blocked on topic: ${topic}`, 
        'FAILURE'
      );
    }

    this.messages.unshift(message);
    if (this.messages.length > 50) this.messages.pop();
    
    this.notify();
  }

  public getMessages() {
    return [...this.messages];
  }

  public reset() {
    this.messages = [];
    this.blockedCount = 0;
    this.messageCountInLastMinute = 0;
    this.lastMinuteTimestamp = Date.now();
    this.unauthorizedAttempts.clear();
    this.notify();
  }
}

export const network = new NetworkSimulator();
