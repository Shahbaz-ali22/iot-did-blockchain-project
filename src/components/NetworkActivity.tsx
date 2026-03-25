import React from 'react';
import { MQTTMessage, TrafficStats } from '../types';
import { Activity, ShieldAlert, ArrowRight, Tag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NetworkActivityProps {
  messages: MQTTMessage[];
  stats: TrafficStats;
}

export const NetworkActivity: React.FC<NetworkActivityProps> = ({ messages, stats }) => {
  return (
    <div className="bg-[#151619] border border-white/10 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h2 className="text-sm font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          IoT Network Activity
        </h2>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] font-mono text-white/20 uppercase">Msg/Min</p>
            <p className="text-xs font-mono text-emerald-400">{stats.messagesPerMinute}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-mono text-white/20 uppercase">Active</p>
            <p className="text-xs font-mono text-blue-400">{stats.activeDevices}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-mono text-white/20 uppercase">Blocked</p>
            <p className="text-xs font-mono text-red-400">{stats.blockedMessages}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-black/40 border rounded-lg p-3 transition-colors ${
                msg.status === 'BLOCKED' ? 'border-red-500/30' : 'border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-white/80 truncate">
                      {msg.deviceName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {msg.payload}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-white/40">
                      <Tag className="w-3 h-3" />
                      {msg.topic}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-white/20">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {msg.status === 'BLOCKED' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-red-500/20 text-red-400 text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                      Blocked
                    </span>
                    <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse" />
                  </div>
                )}
              </div>
              
              {msg.status === 'BLOCKED' && (
                <p className="text-[9px] text-red-400/60 font-mono mt-2 italic">
                  Unauthorized publish attempt blocked.
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <Activity className="w-12 h-12 mb-2" />
            <p className="font-mono text-xs uppercase tracking-widest">Waiting for traffic...</p>
          </div>
        )}
      </div>
    </div>
  );
};
