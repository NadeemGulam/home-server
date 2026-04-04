import { Activity, Sun, Moon, Settings, Pause, Play } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  healthy: number;
  total: number;
  lastUpdated: Date | null;
  theme: string;
  setTheme: (val: string) => void;
  pollingInterval: number;
  setPollingInterval: (val: number) => void;
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
}

export default function Header({ 
  healthy, total, lastUpdated, 
  theme, setTheme, 
  pollingInterval, setPollingInterval, 
  isPaused, setIsPaused 
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <header className={`border-b backdrop-blur-xl sticky top-0 z-40 transition-colors ${theme === 'dark' ? 'border-slate-700/50 bg-slate-900/80' : 'border-slate-200/80 bg-white/80'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Activity size={22} className="text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${theme === 'dark' ? 'from-white to-slate-400' : 'from-slate-900 to-slate-600'}`}>
              Home Server
            </h1>
            <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Infrastructure Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`}>
            <div className={`w-2 h-2 rounded-full ${healthy === total ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {healthy}/{total} services up
            </span>
          </div>
          {lastUpdated && (
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} hidden md:inline`}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
            >
              <Settings size={18} />
            </button>
            
            {showSettings && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl p-3 z-50 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} animate-fade-in`}>
                <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Polling Interval</p>
                <div className="space-y-1">
                  {[
                    { label: '5s (Fast)', value: 5000 },
                    { label: '15s', value: 15000 },
                    { label: '30s (Default)', value: 30000 },
                    { label: '1 min', value: 60000 },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setPollingInterval(opt.value); setShowSettings(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${pollingInterval === opt.value ? (theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600') : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700')}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <hr className={`my-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`} />
                  <button
                    onClick={() => { setIsPaused(!isPaused); setShowSettings(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${isPaused ? 'text-amber-500 hover:bg-amber-500/10' : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700')}`}
                  >
                    <span>{isPaused ? 'Resume updates' : 'Pause updates'}</span>
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
