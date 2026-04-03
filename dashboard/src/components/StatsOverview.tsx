import { Server, Database, BarChart3, Activity } from 'lucide-react';

interface StatsProps {
  healthy: number;
  unhealthy: number;
  total: number;
  avgResponseTime: number;
}

export default function StatsOverview({ healthy, unhealthy, total, avgResponseTime }: StatsProps) {
  const stats = [
    {
      label: 'Total Services',
      value: total,
      icon: Server,
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      bg: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Healthy',
      value: healthy,
      icon: Activity,
      color: 'from-emerald-500 to-green-500',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Unhealthy',
      value: unhealthy,
      icon: Database,
      color: 'from-red-500 to-rose-500',
      shadow: 'shadow-red-500/20',
      bg: 'bg-red-500/10',
      textColor: 'text-red-400',
    },
    {
      label: 'Avg Response',
      value: `${avgResponseTime}ms`,
      icon: BarChart3,
      color: 'from-purple-500 to-violet-500',
      shadow: 'shadow-purple-500/20',
      bg: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`animate-fade-in card-hover relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-2.5 rounded-xl`}>
              <stat.icon size={20} className={stat.textColor} />
            </div>
          </div>
          {/* Gradient accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color}`} />
        </div>
      ))}
    </div>
  );
}
