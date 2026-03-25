import React, { useState, useEffect } from 'react';
import { AuditEvent } from '../types';
import { History, CheckCircle2, XCircle, ShieldAlert, Activity, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuditLogProps {
  events: AuditEvent[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ events }) => {
  const [logs, setLogs] = useState<AuditEvent[]>(events);

  // Sync with incoming events, but allow local clearing
  useEffect(() => {
    setLogs(prev => {
      // If the incoming events are empty, it likely means a global reset happened
      if (events.length === 0) return [];
      
      // Filter for truly new events that we don't have in our current display state
      const newEvents = events.filter(e => !prev.some(p => p.id === e.id));
      
      if (newEvents.length === 0) return prev;
      
      // Combine and sort by timestamp descending
      return [...newEvents, ...prev].sort((a, b) => b.timestamp - a.timestamp);
    });
  }, [events]);

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs?')) {
      setLogs([]);
    }
  };

  return (
    <div className="bg-[#151619] border border-white/10 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4" />
            Blockchain Audit Trail
          </h2>
          <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
        <button
          onClick={clearLogs}
          className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all group"
          title="Clear Logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        <AnimatePresence initial={false}>
          {logs.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-black/40 border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {event.status === 'SUCCESS' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      event.type === 'REGISTRATION' ? 'bg-blue-500/20 text-blue-400' :
                      event.type === 'AUTHENTICATION' ? 'bg-emerald-500/20 text-emerald-400' :
                      event.type === 'REVOCATION' ? 'bg-red-500/20 text-red-400' :
                      event.type === 'SYSTEM' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-[9px] font-mono text-white/20">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium mb-1 truncate">
                    {event.deviceName} <span className="text-white/40 font-normal">({event.deviceId.slice(0, 15)}...)</span>
                  </p>
                  <p className="text-[10px] text-white/40 font-mono leading-relaxed mb-1">
                    {event.details}
                  </p>
                  {event.txHash && (
                    <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-mono text-blue-400 uppercase">TX:</span>
                      <code className="text-[8px] font-mono text-white truncate">{event.txHash}</code>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <ShieldAlert className="w-12 h-12 mb-2" />
            <p className="font-mono text-xs">NO EVENTS RECORDED</p>
          </div>
        )}
      </div>
    </div>
  );
};
