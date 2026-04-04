import { Handle, Position } from '@xyflow/react';
import { ServiceStatus } from '../types';

const statusDot = (status: string) =>
  status === 'healthy' ? 'bg-green-400' : status === 'unhealthy' ? 'bg-red-400' : 'bg-slate-500';

export function GatewayNode({ data }: { data: { label: string; service: Partial<ServiceStatus> } }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/50 flex flex-col items-center min-w-[120px] shadow-lg shadow-blue-500/20 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${statusDot(data.service?.status ?? 'unknown')} animate-pulse`} />
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>
      <span className="text-[10px] text-slate-400 font-mono">:{data.service?.port}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
}

export function ServiceNode({ data }: { data: { service: ServiceStatus } }) {
  return (
    <div className="group relative p-3 rounded-xl bg-slate-900/90 border border-purple-500/50 min-w-[120px] shadow-lg shadow-purple-500/10 hover:border-purple-400 transition-colors backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-purple-400" />
      <div className="flex justify-between items-start mb-2">
        <span className="text-xl">{data.service.icon}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${statusDot(data.service.status)}`} />
      </div>
      <p className="text-[10px] font-bold text-white truncate uppercase mb-1 drop-shadow-md">{data.service.name.replace(' Service', '')}</p>
      <p className="text-[10px] text-slate-400 font-mono">:{data.service.port}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-purple-400" />
    </div>
  );
}

export function DataNode({ data }: { data: { service: ServiceStatus } }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/50 min-w-[140px] shadow-lg shadow-orange-500/10 backdrop-blur-sm">
      <Handle type="target" position={Position.Left} className="!bg-orange-400" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-orange-400" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{data.service?.icon}</span>
          <span className="text-xs font-bold text-white">{data.service?.name}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusDot(data.service?.status ?? 'unknown')}`} />
      </div>
      <div className="flex gap-2">
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">AOF</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">:{data.service?.port}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-orange-400" />
    </div>
  );
}

export function MonitoringNode({ data }: { data: { service: ServiceStatus } }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-emerald-500/50 min-w-[140px] shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
      <Handle type="target" position={Position.Top} className="!bg-emerald-400" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-emerald-400" />
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs">{data.service.icon}</span>
        <span className="text-[10px] font-medium text-slate-200 truncate drop-shadow-sm">{data.service.name}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(data.service.status)}`} />
    </div>
  );
}
