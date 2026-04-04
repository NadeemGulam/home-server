import { ServiceStatus } from './types';

// Service definitions matching your docker-compose.yml
export const SERVICES: ServiceStatus[] = [
  {
    name: 'Nginx',
    url: '/',
    port: 80,
    status: 'unknown',
    icon: '🔒',
    category: 'gateway',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8080`
  },
  {
    name: 'API Gateway',
    url: '/health',
    port: 3000,
    status: 'unknown',
    icon: '⚡',
    category: 'gateway',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3000`
  },
  {
    name: 'Auth Service',
    url: '/health',
    port: 3001,
    status: 'unknown',
    icon: '🔐',
    category: 'service',
  },
  {
    name: 'Users Service',
    url: '/health',
    port: 3002,
    status: 'unknown',
    icon: '👥',
    category: 'service',
  },
  {
    name: 'Products Service',
    url: '/health',
    port: 3003,
    status: 'unknown',
    icon: '🛍️',
    category: 'service',
  },
  {
    name: 'Orders Service',
    url: '/health',
    port: 3004,
    status: 'unknown',
    icon: '📋',
    category: 'service',
  },
  {
    name: 'Portfolio Backend',
    url: '/health',
    port: 8002,
    status: 'unknown',
    icon: '💼',
    category: 'service',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8002`
  },
  {
    name: 'Redis',
    url: '',
    port: 6379,
    status: 'unknown',
    icon: '🔴',
    category: 'data',
  },
  {
    name: 'Prometheus',
    url: '/-/healthy',
    port: 9090,
    status: 'unknown',
    icon: '🔍',
    category: 'monitoring',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:9090`
  },
  {
    name: 'Grafana',
    url: '/api/health',
    port: 3008,
    status: 'unknown',
    icon: '📈',
    category: 'monitoring',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:3008`
  },
  {
    name: 'Alertmanager',
    url: '/-/healthy',
    port: 9093,
    status: 'unknown',
    icon: '🔔',
    category: 'monitoring',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:9093`
  },
  {
    name: 'Redis Exporter',
    url: '/metrics',
    port: 9121,
    status: 'unknown',
    icon: '📡',
    category: 'monitoring',
    link: `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:9121`
  },
];

const GATEWAY_BASE = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000';

export async function checkAllServices(previousServices?: ServiceStatus[]): Promise<ServiceStatus[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${GATEWAY_BASE}/infrastructure-health`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (!res.ok) throw new Error('Gateway returned error');
    
    const aggregatedData = await res.json() as Partial<ServiceStatus>[];
    const prevMap = new Map((previousServices || SERVICES).map(s => [s.name, s]));
    
    // Merge backend results with our local static definitions
    return SERVICES.map(service => {
      const backendInfo = aggregatedData.find(s => s.name === service.name);
      const prevService = prevMap.get(service.name);
      const prevHistory = prevService?.history || [];
      
      let newHistory = [...prevHistory];
      if (backendInfo?.responseTime !== undefined) {
        newHistory = [...newHistory, backendInfo.responseTime].slice(-15); // store last 15 pings
      } else if (backendInfo?.status === 'unhealthy') {
        newHistory = [...newHistory, 0].slice(-15);
      }

      if (backendInfo) {
        return {
          ...service,
          status: backendInfo.status || 'unknown',
          responseTime: backendInfo.responseTime,
          uptime: backendInfo.uptime,
          history: newHistory
        };
      }
      return { ...service, history: prevHistory };
    });

  } catch (err) {
    console.error("Failed to fetch aggregate health:", err);
    // Return all as unhealthy if gateway is down
    const prevMap = new Map((previousServices || SERVICES).map(s => [s.name, s]));
    return SERVICES.map(service => {
         const newHistory = [...(prevMap.get(service.name)?.history || []), 0].slice(-15);
         return { ...service, status: 'unhealthy', history: newHistory };
    });
  }
}

export async function checkServiceHealth(service: ServiceStatus): Promise<ServiceStatus> {
  // Not used directly anymore, but kept for type compatibility if needed elsewhere
  return service;
}
