export type DeviceStatus = 'PENDING' | 'REGISTERED' | 'AUTHENTICATED' | 'REVOKED';

export interface IoTDevice {
  id: string; // DID (e.g., did:iot:0x...)
  name: string;
  publicKey: string;
  status: DeviceStatus;
  registeredAt: number;
  lastSeen?: number;
  isOnline?: boolean;
}

export interface MQTTMessage {
  id: string;
  deviceId: string;
  deviceName: string;
  topic: string;
  payload: string;
  timestamp: number;
  status: 'ALLOWED' | 'BLOCKED';
}

export interface TrafficStats {
  messagesPerMinute: number;
  activeDevices: number;
  blockedMessages: number;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  type: 'REGISTRATION' | 'AUTHENTICATION' | 'REVOCATION' | 'ATTACK_DETECTED' | 'UNAUTHORIZED_PUBLISH' | 'SYSTEM';
  deviceId: string;
  deviceName: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE';
  txHash?: string;
}

export interface BlockchainStatus {
  network: string;
  blockHeight: number;
  lastTxHash: string;
}

export interface BlockchainState {
  devices: IoTDevice[];
  auditTrail: AuditEvent[];
  blockHeight: number;
}
