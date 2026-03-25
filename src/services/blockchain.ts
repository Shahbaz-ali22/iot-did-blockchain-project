import { ethers } from 'ethers';
import { IoTDevice, AuditEvent, DeviceStatus, BlockchainStatus } from '../types';

const STORAGE_KEY = 'iot_did_blockchain_state';

class BlockchainSimulator {
  private devices: IoTDevice[] = [];
  private auditTrail: AuditEvent[] = [];
  private blockHeight: number = 12405;

  constructor() {
    this.loadState();
  }

  private loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.devices = parsed.devices || [];
      this.auditTrail = parsed.auditTrail || [];
      this.blockHeight = parsed.blockHeight || 12405;
    }
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      devices: this.devices,
      auditTrail: this.auditTrail,
      blockHeight: this.blockHeight
    }));
  }

  private generateTxHash(): string {
    return '0x' + Math.random().toString(16).substr(2, 40);
  }

  public getDevices() {
    return [...this.devices];
  }

  public getAuditTrail() {
    return [...this.auditTrail];
  }

  public getStatus(): BlockchainStatus {
    return {
      network: 'Local Testnet',
      blockHeight: this.blockHeight,
      lastTxHash: this.auditTrail[0]?.txHash || '0x0000000000000000000000000000000000000000'
    };
  }

  public async registerDevice(name: string): Promise<string> {
    const wallet = ethers.Wallet.createRandom();
    const did = `did:iot:${wallet.address}`;
    
    const newDevice: IoTDevice = {
      id: did,
      name,
      publicKey: wallet.address,
      status: 'REGISTERED',
      registeredAt: Date.now(),
    };

    this.devices.push(newDevice);
    this.blockHeight++;
    this.addAuditLog('REGISTRATION', did, name, 'Device registered on blockchain', 'SUCCESS', this.generateTxHash());
    this.saveState();
    
    return wallet.privateKey;
  }

  public revokeDevice(did: string) {
    const device = this.devices.find(d => d.id === did);
    if (device) {
      device.status = 'REVOKED';
      this.blockHeight++;
      this.addAuditLog('REVOCATION', did, device.name, 'Device identity revoked by admin', 'SUCCESS', this.generateTxHash());
      this.saveState();
    }
  }

  public async authenticateDevice(did: string, signature: string, message: string): Promise<boolean> {
    const device = this.devices.find(d => d.id === did);
    
    if (!device) {
      this.addAuditLog('AUTHENTICATION', did, 'Unknown', 'Unauthorized device attempt blocked.', 'FAILURE', this.generateTxHash());
      return false;
    }

    if (device.status === 'REVOKED') {
      this.addAuditLog('AUTHENTICATION', did, device.name, 'Authentication failed: Device is revoked', 'FAILURE', this.generateTxHash());
      return false;
    }

    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() === device.publicKey.toLowerCase()) {
        device.status = 'AUTHENTICATED';
        device.lastSeen = Date.now();
        this.blockHeight++;
        this.addAuditLog('AUTHENTICATION', did, device.name, 'Secure DID authentication successful', 'SUCCESS', this.generateTxHash());
        this.saveState();
        return true;
      } else {
        this.addAuditLog('AUTHENTICATION', did, device.name, 'Authentication failed: Invalid signature (Potential Impersonation)', 'FAILURE', this.generateTxHash());
        return false;
      }
    } catch (error) {
      this.addAuditLog('AUTHENTICATION', did, device.name, 'Authentication failed: Cryptographic error', 'FAILURE', this.generateTxHash());
      return false;
    }
  }

  public addAuditLog(type: AuditEvent['type'], deviceId: string, deviceName: string, details: string, status: AuditEvent['status'], txHash?: string) {
    const event: AuditEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      deviceId,
      deviceName,
      details,
      status,
      txHash
    };
    this.auditTrail.unshift(event);
    if (this.auditTrail.length > 50) {
      this.auditTrail.pop();
    }
    this.saveState();
  }

  public clearAll() {
    this.devices = [];
    this.auditTrail = [];
    this.blockHeight = 12405;
    this.addAuditLog('SYSTEM', '0x0000', 'System', 'Ledger reset by admin.', 'SUCCESS', '0x0000000000000000000000000000000000000000');
    this.saveState();
  }
}

export const blockchain = new BlockchainSimulator();
