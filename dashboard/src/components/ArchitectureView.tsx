import { useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, Edge, Node } from '@xyflow/react';
import { ServiceStatus } from '../types';
import { GatewayNode, ServiceNode, DataNode, MonitoringNode } from './FlowNodes';
import { Share2 } from 'lucide-react';

interface ArchitectureViewProps {
  services: ServiceStatus[];
}

export default function ArchitectureView({ services }: ArchitectureViewProps) {
  const find = (name: string) => services.find((s) => s.name === name);

  const nginx = find('Nginx');
  const gateway = find('API Gateway');
  const microservices = services.filter(s => s.category === 'service');
  
  // Monitoring nodes
  const prometheus = find('Prometheus');
  const grafana = find('Grafana');
  const alertmgr = find('Alertmanager');
  const redisExp = find('Redis Exporter');
  const redis = find('Redis');

  const nodeTypes = useMemo(() => ({
    gatewayNode: GatewayNode,
    serviceNode: ServiceNode,
    dataNode: DataNode,
    monitoringNode: MonitoringNode
  }), []);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // 1. Gateway Tier
    if (nginx) newNodes.push({ id: 'nginx', type: 'gatewayNode', position: { x: 300, y: 50 }, data: { label: 'Nginx Proxy', service: nginx } });
    if (gateway) newNodes.push({ id: 'gateway', type: 'gatewayNode', position: { x: 300, y: 180 }, data: { label: 'API Gateway', service: gateway } });
    
    if (nginx && gateway) {
      newEdges.push({ 
        id: 'e-nginx-gw', 
        source: 'nginx', target: 'gateway', 
        animated: true, 
        style: { strokeWidth: 3, stroke: gateway.status === 'unhealthy' ? '#ef4444' : '#3b82f6' } 
      });
    }

    // 2. Microservices
    const xStart = 50;
    microservices.forEach((svc, index) => {
      const id = `svc-${svc.name}`;
      newNodes.push({
        id,
        type: 'serviceNode',
        position: { x: xStart + index * 150, y: 320 },
        data: { service: svc }
      });

      if (gateway) {
        newEdges.push({
          id: `e-gw-${id}`,
          source: 'gateway', target: id,
          animated: true,
          style: { stroke: svc.status === 'unhealthy' ? '#ef4444' : '#8b5cf6' }
        });
      }
    });

    // 3. Data & Monitoring
    if (redis) newNodes.push({ id: 'redis', type: 'dataNode', position: { x: 650, y: 480 }, data: { service: redis } });
    
    // Connect portfolio to redis (assuming Portfolio Backend is index 4, let's just find its ID dynamically)
    const portfolio = microservices.find(s => s.name === 'Portfolio Backend');
    if (portfolio && redis) {
       newEdges.push({
         id: 'e-port-redis',
         source: `svc-Portfolio Backend`, sourceHandle: 'right',
         target: 'redis', targetHandle: 'top',
         animated: true,
         style: { stroke: redis.status === 'unhealthy' ? '#ef4444' : '#f97316' }
       });
    }

    if (prometheus) newNodes.push({ id: 'prom', type: 'monitoringNode', position: { x: 100, y: 480 }, data: { service: prometheus } });
    if (grafana) newNodes.push({ id: 'grafana', type: 'monitoringNode', position: { x: 300, y: 480 }, data: { service: grafana } });
    if (alertmgr) newNodes.push({ id: 'alert', type: 'monitoringNode', position: { x: 100, y: 550 }, data: { service: alertmgr } });
    if (redisExp) newNodes.push({ id: 'redis-exp', type: 'monitoringNode', position: { x: 450, y: 480 }, data: { service: redisExp } });

    // Monitoring edges
    if (prometheus && grafana) newEdges.push({ id: 'e-prom-graf', source: 'prom', target: 'grafana', targetHandle: 'left', animated: true, style: { stroke: '#10b981' }});
    if (prometheus && alertmgr) newEdges.push({ id: 'e-prom-alert', source: 'prom', target: 'alert', animated: true, style: { stroke: '#10b981' }});
    if (redisExp && redis) newEdges.push({ id: 'e-exp-redis', source: 'redis-exp', target: 'redis', targetHandle: 'left', animated: true, style: { stroke: '#10b981' }});

    setNodes(newNodes);
    setEdges(newEdges);
  }, [services]);

  return (
    <div className="animate-fade-in group relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl h-[700px] flex flex-col">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative p-6 pb-0 flex-shrink-0 z-10 pointer-events-none">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Share2 size={20} className="text-white" />
          </div>
          Live Interactive Map
          <span className="ml-2 text-xs font-mono text-slate-400 font-normal">Drag around & zoom</span>
        </h2>
      </div>

      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className="bg-transparent"
        >
          <Background color="#475569" gap={20} size={1} />
          <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-300" />
        </ReactFlow>
      </div>
    </div>
  );
}
