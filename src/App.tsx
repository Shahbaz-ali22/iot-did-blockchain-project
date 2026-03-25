import { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { DeviceEmulator } from './components/DeviceEmulator';
import { AuditLog } from './components/AuditLog';
import { Stats } from './components/Stats';
import { NetworkActivity } from './components/NetworkActivity';
import { blockchain } from './services/blockchain';
import { network } from './services/network';
import { IoTDevice, AuditEvent, MQTTMessage, TrafficStats } from './types';
import { Shield, Database, LayoutDashboard, Settings, LogOut, Trash2, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'emulator'>('dashboard');
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [trafficStats, setTrafficStats] = useState<TrafficStats>({
    messagesPerMinute: 0,
    activeDevices: 0,
    blockedMessages: 0
  });

  const [blockchainStatus, setBlockchainStatus] = useState(blockchain.getStatus());

  const refreshData = () => {
    setDevices(blockchain.getDevices());
    setAuditTrail(blockchain.getAuditTrail());
    setBlockchainStatus(blockchain.getStatus());
  };

  useEffect(() => {
    refreshData();
    
    // Subscribe to network traffic
    const unsubscribe = network.subscribe((newMessages, newStats) => {
      setMessages(newMessages);
      setTrafficStats(newStats);
      // If a message was blocked, it might have added an audit log
      refreshData();
    });

    return () => unsubscribe();
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to reset the entire ledger?')) {
      blockchain.clearAll();
      network.reset();
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111214] border-r border-white/5 flex flex-col z-50 hidden lg:flex">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">IoT-DID</h1>
            <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Secure Onboarding</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Admin Panel</span>
          </button>
          <button
            onClick={() => setActiveTab('emulator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'emulator' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="font-medium">Device Emulator</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={handleClearAll}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Reset Ledger</span>
          </button>
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40 uppercase">Network</span>
              <span className="text-[10px] font-mono text-emerald-400">Local Testnet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40 uppercase">Block Height</span>
              <span className="text-[10px] font-mono text-white/80">{blockchainStatus.blockHeight.toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase">Last Tx Hash</span>
              <code className="block text-[9px] font-mono text-white/20 truncate">{blockchainStatus.lastTxHash}</code>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-white/40 uppercase">Node Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
             <Shield className="w-6 h-6 text-emerald-500" />
             <h1 className="text-lg font-bold">IoT-DID</h1>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-medium text-white">Admin Console</span>
              <span className="text-[10px] font-mono text-white/40">shahbaz19370@gmail.com</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-0.5">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <Settings className="w-4 h-4 text-white/60" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-12">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">Network Active</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                {activeTab === 'dashboard' ? 'Identity Registry' : 'Device Onboarding'}
              </h2>
              <p className="text-white/40 max-w-2xl text-sm leading-relaxed">
                {activeTab === 'dashboard' 
                  ? 'Manage your IoT network identities on the blockchain. Register new devices, monitor their status, and revoke compromised identities instantly.'
                  : 'Simulate a real-world IoT device join procedure. Use cryptographic private keys to sign authentication challenges and verify identity with the gateway.'}
              </p>
            </div>
            <div className="flex gap-2 lg:hidden bg-white/5 p-1 rounded-xl border border-white/5">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>ADMIN</button>
              <button onClick={() => setActiveTab('emulator')} className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all ${activeTab === 'emulator' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>EMULATOR</button>
            </div>
          </div>

          <Stats devices={devices} auditTrail={auditTrail} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {activeTab === 'dashboard' ? (
                <AdminDashboard devices={devices} onRefresh={refreshData} stats={trafficStats} />
              ) : (
                <DeviceEmulator onAuth={refreshData} />
              )}
              
              {activeTab === 'dashboard' && (
                <div className="h-[500px]">
                  <NetworkActivity messages={messages} stats={trafficStats} />
                </div>
              )}
            </div>
            <div className="xl:col-span-1 h-[600px] xl:h-[1000px] space-y-8">
              <AuditLog events={auditTrail} />
              {activeTab === 'emulator' && (
                <div className="h-[400px]">
                  <NetworkActivity messages={messages} stats={trafficStats} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            Blockchain-Based IoT Identity Framework &copy; 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
