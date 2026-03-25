import React, { useState } from 'react';
import { blockchain } from '../services/blockchain';
import { IoTDevice, TrafficStats } from '../types';
import { Shield, ShieldAlert, Trash2, Plus, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdminDashboardProps {
  devices: IoTDevice[];
  onRefresh: () => void;
  stats: TrafficStats;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ devices, onRefresh, stats }) => {
  const [newName, setNewName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastPrivateKey, setLastPrivateKey] = useState<string | null>(null);

  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsRegistering(true);
    setLastTxHash(null);
    try {
      const pk = await blockchain.registerDevice(newName);
      const status = blockchain.getStatus();
      setLastTxHash(status.lastTxHash);
      setLastPrivateKey(pk);
      setNewName('');
      onRefresh();
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRevoke = (did: string) => {
    blockchain.revokeDevice(did);
    const status = blockchain.getStatus();
    setLastTxHash(status.lastTxHash);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#151619] border border-white/10 rounded-xl p-4 shadow-xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Messages / Min</p>
          <p className="text-2xl font-mono text-emerald-400">{stats.messagesPerMinute}</p>
        </div>
        <div className="bg-[#151619] border border-white/10 rounded-xl p-4 shadow-xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Active Devices</p>
          <p className="text-2xl font-mono text-blue-400">{stats.activeDevices}</p>
        </div>
        <div className="bg-[#151619] border border-white/10 rounded-xl p-4 shadow-xl">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Blocked Traffic</p>
          <p className="text-2xl font-mono text-red-400">{stats.blockedMessages}</p>
        </div>
      </div>

      <div className="bg-[#151619] border border-white/10 rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-mono text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          Register New IoT Device
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Device Name (e.g. Smart Sensor A1)"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={isRegistering}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-mono font-bold transition-all flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-[10px]">VERIFYING...</span>
                </>
              ) : 'REGISTER'}
            </button>
          </div>
          {isRegistering && (
            <p className="text-[10px] font-mono text-emerald-400/60 animate-pulse">
              Verifying identity on blockchain...
            </p>
          )}
          {lastTxHash && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">New blockchain transaction recorded</p>
              </div>
              <code className="text-[9px] font-mono text-blue-400/60 truncate max-w-[150px]">{lastTxHash}</code>
            </div>
          )}
          {lastPrivateKey && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
              <p className="text-emerald-400 text-xs font-mono mb-2 uppercase tracking-wider">Device Private Key (Copy this for emulator):</p>
              <code className="block bg-black/60 p-2 rounded text-emerald-300 text-xs break-all font-mono">
                {lastPrivateKey}
              </code>
              <button 
                onClick={() => setLastPrivateKey(null)}
                className="mt-2 text-[10px] text-emerald-400/60 hover:text-emerald-400 uppercase font-mono"
              >
                Dismiss
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-[#151619] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-bottom border-white/10 bg-white/5 flex justify-between items-center">
          <h2 className="text-sm font-mono text-white/60 uppercase tracking-widest">Device Registry (Blockchain Ledger)</h2>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            {devices.length} DEVICES
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Device Identity (DID)</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Registered</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-emerald-400/80">{device.id}</span>
                      <span className="text-[10px] font-mono text-white/20 truncate max-w-[200px]">PK: {device.publicKey}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{device.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold",
                      device.status === 'AUTHENTICATED' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      device.status === 'REVOKED' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                      "bg-white/10 text-white/40 border border-white/10"
                    )}>
                      {device.status === 'AUTHENTICATED' ? 'ONLINE' : 
                       device.status === 'REVOKED' ? 'REVOKED' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-white/40">
                      {new Date(device.registeredAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {device.status !== 'REVOKED' && (
                      <button
                        onClick={() => handleRevoke(device.id)}
                        className="text-red-400/40 hover:text-red-400 p-2 transition-colors"
                        title="Revoke Device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {devices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <ShieldAlert className="w-12 h-12" />
                      <p className="font-mono text-sm">NO DEVICES REGISTERED ON LEDGER</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
