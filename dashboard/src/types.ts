export interface ServiceStatus {
  name: string;
  url: string;
  port: number;
  status: 'healthy' | 'unhealthy' | 'unknown';
  uptime?: number;
  responseTime?: number;
  icon: string;
  category: 'gateway' | 'service' | 'data' | 'monitoring';
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface SystemMetrics {
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  avgResponseTime: number;
}
