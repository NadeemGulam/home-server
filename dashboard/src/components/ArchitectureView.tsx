import { ServiceStatus } from '../types';
import { Share2, Globe, Shield, Database, Activity, RefreshCw, Smartphone, Mail, Code } from 'lucide-react';

interface ArchitectureViewProps {
  services: ServiceStatus[];
}

const statusDot = (s: ServiceStatus['status']) =>
  s === 'healthy' ? 'bg-green-400' : s === 'unhealthy' ? 'bg-red-400' : 'bg-slate-500';

export default function ArchitectureView({ services }: ArchitectureViewProps) {
  const find = (name: string) => services.find((s) => s.name === name);

  const nginx = find('Nginx');
  const gateway = find('API Gateway');
  const microservices = services.filter(s => s.category === 'service');
  const monitoring = services.filter(s => s.category === 'monitoring');
  const redis = find('Redis');

  return (
    <div className="animate-fade-in group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl p-8" style={{ animationDelay: '400ms' }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="relative">
        <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Share2 size={20} className="text-white" />
          </div>
          System Architecture
          <span className="ml-2 text-xs font-mono text-slate-500 font-normal">v1.0 · Live Status</span>
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: CI/CD & External */}
          <div className="xl:col-span-3 space-y-6">
            {/* External Layer */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-800/30">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe size={10} /> External Layer
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                  <Smartphone size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Client / Browser</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                  <Mail size={16} className="text-amber-400" />
                  <span className="text-sm font-medium text-slate-300">Gmail SMTP</span>
                </div>
              </div>
            </div>

            {/* CI/CD Pipeline */}
            <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCw size={10} /> CI/CD Pipeline
              </p>
              <div className="space-y-2 relative">
                {[
                  { icon: Code, label: 'GitHub Push', color: 'text-violet-300' },
                  { icon: Activity, label: 'Actions Runner', color: 'text-violet-400' },
                  { icon: Shield, label: 'Tailscale VPN', color: 'text-violet-500' },
                ].map((step, idx, arr) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-violet-500/10">
                      <step.icon size={14} className={step.color} />
                      <span className="text-xs font-medium text-slate-300">{step.label}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="h-4 flex justify-center py-1">
                        <div className="w-px h-full bg-gradient-to-b from-violet-500/40 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: API Gateway & Microservices */}
          <div className="xl:col-span-6 space-y-6">
            {/* Gateway Tier */}
            <div className="relative p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield size={10} /> Traffic Management
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Nginx */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusDot(nginx?.status ?? 'unknown')}`} />
                    <span className="text-xs font-bold text-white">Nginx Proxy</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">:80</span>
                </div>
                {/* API Gateway */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${statusDot(gateway?.status ?? 'unknown')}`} />
                    <span className="text-xs font-bold text-white">API Gateway</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">:3000</span>
                </div>
              </div>

              {/* Connecting line to services */}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full h-6 w-px bg-gradient-to-b from-blue-500/40 to-purple-500/40" />
            </div>

            {/* Microservices Tier */}
            <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={10} /> Microservices Tier
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {microservices.map((svc) => (
                  <div key={svc.name} className="group/svc relative p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-purple-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl">{svc.icon}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(svc.status)} shadow-lg shadow-current/20`} />
                    </div>
                    <p className="text-[10px] font-bold text-white truncate uppercase mb-1">{svc.name.replace(' Service', '')}</p>
                    <p className="text-[9px] text-slate-500 font-mono">:{svc.port}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Data & Monitoring */}
          <div className="xl:col-span-3 space-y-6">
            {/* Data Layer */}
            <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Database size={10} /> Data Layer
              </p>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔴</span>
                    <span className="text-xs font-bold text-white">Redis 7</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${statusDot(redis?.status ?? 'unknown')}`} />
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">AOF</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">:6379</span>
                </div>
              </div>
            </div>

            {/* Monitoring Layer */}
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={10} /> Observability
              </p>
              <div className="space-y-2">
                {monitoring.map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs">{svc.icon}</span>
                      <span className="text-[10px] font-medium text-slate-300 truncate">{svc.name}</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(svc.status)}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-wrap gap-6 items-center text-[10px] text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" /> Healthy
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" /> Deployed / Down
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-500" /> Unknown
          </div>
          <div className="ml-auto font-mono flex items-center gap-2">
             <div className="w-3 h-px bg-slate-700" /> TCP Connection
             <div className="w-3 h-px border-b border-dashed border-slate-700" /> Logic Flow
          </div>
        </div>
      </div>
    </div>
  );
}
