import React, { useState } from 'react';
import { ethers } from 'ethers';
import { blockchain } from '../services/blockchain';
import { Cpu, Wifi, ShieldCheck, ShieldX, Terminal, Loader2, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DeviceEmulator: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [authResult, setAuthResult] = useState<{ success: boolean; message: string; type?: 'alert' | 'success'; latency?: number } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [verificationStep, setVerificationStep] = useState<number>(-1);

  const verificationSteps = [
    'Generating authentication challenge',
    'Signing challenge with device private key',
    'Verifying decentralized identity (DID)',
    'Checking blockchain registry',
    'Granting network access'
  ];

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const runVerificationAnimation = async () => {
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerificationStep(i);
      addLog(verificationSteps[i] + '...');
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateKey.trim()) return;

    setIsAuthenticating(true);
    setAuthResult(null);
    const startTime = Date.now();
    
    try {
      await runVerificationAnimation();

      const wallet = new ethers.Wallet(privateKey);
      const did = `did:iot:${wallet.address}`;
      const challenge = `AUTH_CHALLENGE_${Date.now()}`;
      const signature = await wallet.signMessage(challenge);
      
      const success = await blockchain.authenticateDevice(did, signature, challenge);
      const latency = (Date.now() - startTime) / 1000;
      
      onAuth();

      if (success) {
        setAuthResult({ 
          success: true, 
          message: 'Onboarding Successful: Device authenticated and joined the network.', 
          type: 'success',
          latency
        });
        addLog('GATEWAY: Access Granted.');
      } else {
        setAuthResult({ 
          success: false, 
          message: 'Onboarding Failed: Identity verification rejected by blockchain ledger.', 
          type: 'alert',
          latency
        });
        addLog('GATEWAY: Access Denied.');
      }
    } catch (error) {
      setAuthResult({ 
        success: false, 
        message: 'Error: Invalid private key or cryptographic failure.', 
        type: 'alert' 
      });
      addLog('ERROR: Handshake failed.');
    } finally {
      setIsAuthenticating(false);
      setVerificationStep(-1);
    }
  };

  const simulateRogueAttack = async () => {
    setIsAttacking(true);
    setAuthResult(null);
    const startTime = Date.now();
    addLog('ROGUE_DEVICE: Attempting unauthorized network injection...');

    try {
      await runVerificationAnimation();

      const randomWallet = ethers.Wallet.createRandom();
      const rogueDid = `did:iot:${randomWallet.address}`;
      const challenge = `ROGUE_CHALLENGE_${Date.now()}`;
      const signature = await randomWallet.signMessage(challenge);
      
      const success = await blockchain.authenticateDevice(rogueDid, signature, challenge);
      const latency = (Date.now() - startTime) / 1000;
      
      onAuth();

      if (!success) {
        setAuthResult({ 
          success: false, 
          message: 'SECURITY ALERT: Unauthorized device attempt blocked by blockchain consensus.',
          type: 'alert',
          latency
        });
        addLog('GATEWAY: ATTACK DETECTED. IP_BLOCKED.');
      }
    } catch (error) {
      addLog('ROGUE_DEVICE: Injection failed.');
    } finally {
      setIsAttacking(false);
      setVerificationStep(-1);
    }
  };

  return (
    <div className="bg-[#151619] border border-white/10 rounded-xl p-6 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          IoT Device Emulator
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isAuthenticating || isAttacking ? 'bg-yellow-400' : 'bg-emerald-400'}`} />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">Device Private Key</label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="0x..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isAuthenticating || isAttacking || !privateKey}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-mono font-bold transition-all flex flex-col items-center justify-center gap-1"
          >
            {isAuthenticating ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </div>
                <span className="text-[9px] font-normal opacity-60">Verifying identity on blockchain...</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span>JOIN NETWORK</span>
              </div>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#151619] px-2 text-white/20 font-mono">Security Testing</span>
          </div>
        </div>

        <button
          onClick={simulateRogueAttack}
          disabled={isAuthenticating || isAttacking}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg font-mono font-bold transition-all flex items-center justify-center gap-2 group"
        >
          {isAttacking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <AlertOctagon className="w-4 h-4 group-hover:animate-pulse" />
          )}
          SIMULATE ROGUE DEVICE
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(isAuthenticating || isAttacking) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
              <span>Blockchain Verification</span>
              <span className="animate-pulse text-yellow-400">Processing...</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-lg p-4 space-y-3">
              {verificationSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    verificationStep > i 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : verificationStep === i 
                        ? 'border-yellow-400 animate-pulse' 
                        : 'border-white/10'
                  }`}>
                    {verificationStep > i && <ShieldCheck className="w-3 h-3 text-black" />}
                  </div>
                  <span className={`text-[11px] font-mono transition-colors duration-300 ${
                    verificationStep >= i ? 'text-white' : 'text-white/20'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {authResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border mb-6 ${
              authResult.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <div className="flex items-start gap-3">
              {authResult.type === 'success' ? <ShieldCheck className="w-5 h-5 mt-0.5" /> : <ShieldX className="w-5 h-5 mt-0.5 text-red-500" />}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-mono font-bold uppercase ${authResult.type === 'alert' && 'text-red-500'}`}>
                    {authResult.type === 'success' ? 'Identity Verified' : 'Security Alert: Unauthorized device detected.'}
                  </p>
                  {authResult.latency && (
                    <span className="text-[9px] font-mono opacity-40">
                      {authResult.latency.toFixed(2)}s
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono opacity-80 leading-relaxed">
                  {authResult.message}
                </p>
                {authResult.latency && (
                  <p className="text-[10px] font-mono mt-2 opacity-60 italic">
                    Authentication completed in {authResult.latency.toFixed(1)} seconds
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 bg-black/60 rounded-lg p-4 font-mono text-[10px] overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 text-white/40 mb-3 border-b border-white/5 pb-2">
          <Terminal className="w-3 h-3" />
          <span className="uppercase tracking-widest">Device Console Logs</span>
        </div>
        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className={i === 0 ? (log.includes('ROGUE') ? 'text-red-400' : 'text-blue-400') : 'text-white/40'}>
              {log}
            </div>
          ))}
          {logs.length === 0 && <div className="text-white/10 italic">Waiting for connection...</div>}
        </div>
      </div>
    </div>
  );
};
