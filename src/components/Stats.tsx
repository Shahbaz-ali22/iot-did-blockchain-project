import React from 'react';
import { IoTDevice, AuditEvent } from '../types';
import { Shield, ShieldCheck, ShieldX, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Stats: React.FC<{ devices: IoTDevice[]; auditTrail: AuditEvent[] }> = ({ devices, auditTrail }) => {
  const activeCount = devices.filter(d => d.status === 'AUTHENTICATED').length;
  const revokedCount = devices.filter(d => d.status === 'REVOKED').length;
  const failedAuths = auditTrail.filter(e => e.type === 'AUTHENTICATION' && e.status === 'FAILURE').length;

  const stats = [
    { 
      label: 'Total Registered Devices', 
      value: devices.length, 
      icon: Shield, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      indicator: 'bg-blue-500'
    },
    { 
      label: 'Active Devices', 
      value: activeCount, 
      icon: ShieldCheck, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      indicator: 'bg-emerald-500'
    },
    { 
      label: 'Revoked Devices', 
      value: revokedCount, 
      icon: ShieldX, 
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      indicator: 'bg-red-500'
    },
    { 
      label: 'Failed Authentication Attempts', 
      value: failedAuths, 
      icon: AlertTriangle, 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      indicator: 'bg-amber-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-[#111214] border ${stat.border} rounded-2xl p-6 flex flex-col gap-4 shadow-2xl hover:bg-[#151619] transition-all group relative overflow-hidden`}
        >
          {/* Indicator Bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.indicator} opacity-50 group-hover:opacity-100 transition-opacity`} />
          
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="p-1 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-white/20" />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-mono font-bold text-white tracking-tight">
                {stat.value.toLocaleString()}
              </p>
              <span className={`text-[10px] font-mono ${stat.color} font-bold`}>LIVE</span>
            </div>
          </div>

          {/* Decorative background element */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
        </motion.div>
      ))}
    </div>
  );
};
