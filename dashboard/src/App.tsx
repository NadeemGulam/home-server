import { useEffect, useState, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import ServiceGrid from './components/ServiceGrid';
import ArchitectureView from './components/ArchitectureView';
import { checkAllServices, SERVICES } from './services';
import { ServiceStatus } from './types';
import './App.css';

function App() {
  const [services, setServices] = useState<ServiceStatus[]>(SERVICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const prevServicesRef = useRef<ServiceStatus[]>(SERVICES);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [pollingInterval, setPollingInterval] = useState(30000);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const fetchHealth = async () => {
    const results = await checkAllServices(prevServicesRef.current);
    
    // Check for offline/online transitions to fire toast notifications
    results.forEach(service => {
      const prev = prevServicesRef.current.find(s => s.name === service.name);
      if (prev) {
        if (prev.status === 'healthy' && service.status === 'unhealthy') {
          toast.error(`${service.name} has gone offline!`);
        } else if (prev.status === 'unhealthy' && service.status === 'healthy') {
          toast.success(`${service.name} is back online!`);
        }
      }
    });

    prevServicesRef.current = results;
    setServices(results);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    if (isPaused) return;
    const interval = setInterval(fetchHealth, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, isPaused]);

  const healthy = services.filter((s) => s.status === 'healthy').length;
  const unhealthy = services.filter((s) => s.status === 'unhealthy').length;
  const avgResponseTime = Math.round(
    services
      .filter((s) => s.responseTime !== undefined)
      .reduce((acc, curr) => acc + (curr.responseTime || 0), 0) / (services.length || 1)
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      <Toaster position="bottom-right" theme={theme as any} richColors />
      <Header 
        healthy={healthy} 
        total={services.length} 
        lastUpdated={lastUpdated} 
        theme={theme}
        setTheme={setTheme}
        pollingInterval={pollingInterval}
        setPollingInterval={setPollingInterval}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${theme === 'dark' ? 'border-blue-500/20 border-t-blue-500' : 'border-blue-600/20 border-t-blue-600'}`} />
            <p className={`font-mono text-sm animate-pulse ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Initializing health checks...</p>
          </div>
        ) : (
          <>
            {/* Top Section: Overview Stats */}
            <section>
              <StatsOverview
                healthy={healthy}
                unhealthy={unhealthy}
                total={services.length}
                avgResponseTime={avgResponseTime}
              />
            </section>

            {/* Middle Section: Architecture Visualization */}
            <section className="space-y-4">
              <ArchitectureView services={services} />
            </section>

            {/* Bottom Section: Service Grid Details */}
            <section className="space-y-4">
              <ServiceGrid services={services} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-10 mt-20 ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'}`}>
        <div className={`max-w-7xl mx-auto px-6 text-center text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-slate-500'}`}>
          <p>© 2026 Home Server Dashboard · Monitoring infrastructure pulse</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
