import { ServiceStatus } from '../types';
import ServiceCard from './ServiceCard';

interface ServiceGridProps {
  services: ServiceStatus[];
}

const categoryLabels: Record<string, string> = {
  gateway: '⚡ Gateway',
  service: '📦 Microservices',
  data: '💾 Data Layer',
  monitoring: '📊 Monitoring & Observability',
};

const categoryOrder = ['gateway', 'service', 'data', 'monitoring'];

export default function ServiceGrid({ services }: ServiceGridProps) {
  const grouped = categoryOrder.map((cat) => ({
    key: cat,
    label: categoryLabels[cat],
    items: services.filter((s) => s.category === cat),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm">🖥️</span>
        Service Health
      </h2>

      {grouped.map(({ key, label, items }) => (
        <div key={key}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((service, i) => (
              <ServiceCard key={service.name} service={service} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
