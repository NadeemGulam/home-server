import { Activity } from 'lucide-react';

interface HeaderProps {
  healthy: number;
  total: number;
  lastUpdated: Date | null;
}

export default function Header({ healthy, total, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Activity size={22} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Home Server
            </h1>
            <p className="text-xs text-slate-500 font-medium">Infrastructure Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className={`w-2 h-2 rounded-full ${healthy === total ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
            <span className="text-sm text-slate-300 font-medium">
              {healthy}/{total} services up
            </span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-slate-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
