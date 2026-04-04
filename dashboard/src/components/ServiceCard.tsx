import { ServiceStatus } from '../types';
import { ExternalLink, Clock, Zap } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceStatus;
  index: number;
}

const categoryColors: Record<string, string> = {
  gateway: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  service: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  data: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  monitoring: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
};

const categoryBadge: Record<string, string> = {
  gateway: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  service: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  data: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  monitoring: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const statusConfig = {
  healthy: {
    dot: 'bg-green-400',
    text: 'text-green-400',
    label: 'Healthy',
    glow: 'shadow-green-500/30',
  },
  unhealthy: {
    dot: 'bg-red-400',
    text: 'text-red-400',
    label: 'Down',
    glow: 'shadow-red-500/30',
  },
  unknown: {
    dot: 'bg-slate-500',
    text: 'text-slate-400',
    label: 'Unknown',
    glow: '',
  },
};

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const cfg = statusConfig[service.status];
  const catColor = categoryColors[service.category];
  const badgeColor = categoryBadge[service.category];

  return (
    <div
      className={`animate-fade-in card-hover relative rounded-2xl border bg-gradient-to-br ${catColor} backdrop-blur-sm p-5 flex flex-col gap-3`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{service.icon}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">{service.name}</h3>
            <span className={`inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {service.category.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot} ${service.status === 'healthy' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <ExternalLink size={12} />
            <span>:{service.port}</span>
          </div>
          {service.responseTime !== undefined && (
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span>{service.responseTime}ms</span>
            </div>
          )}
          {service.uptime !== undefined && (
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-cyan-400" />
              <span>{formatUptime(service.uptime)}</span>
            </div>
          )}
        </div>
        {service.link && (
          <a
            href={service.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 transition-colors border border-white/10"
            title={`Open ${service.name}`}
          >
            Open <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}
