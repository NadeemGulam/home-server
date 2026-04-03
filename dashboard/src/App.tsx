import { useEffect, useState } from 'react';
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

  const fetchHealth = async () => {
    const results = await checkAllServices();
    setServices(results);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const healthy = services.filter((s) => s.status === 'healthy').length;
  const unhealthy = services.filter((s) => s.status === 'unhealthy').length;
  const avgResponseTime = Math.round(
    services
      .filter((s) => s.responseTime !== undefined)
      .reduce((acc, curr) => acc + (curr.responseTime || 0), 0) / (services.length || 1)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Header healthy={healthy} total={services.length} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-mono text-sm animate-pulse">Initializing health checks...</p>
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
      <footer className="border-t border-slate-900 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-xs">
          <p>© 2026 Home Server Dashboard · Monitoring infrastructure pulse</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
