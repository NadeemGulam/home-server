// API Gateway entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('./config/services');
const rateLimiter = require('./middleware/rateLimiter');
const { metricsMiddleware, getMetrics } = require('./middleware/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Apply metrics collection to all routes
app.use(metricsMiddleware);

// Apply rate limiting to all API routes
app.use(rateLimiter);

// Parse JSON bodies removed to prevent proxy body streaming issues
// Microservices will handle their own JSON parsing

// Metrics endpoint (for Prometheus)
app.get('/metrics', getMetrics);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Infrastructure health aggregator for the Dashboard
app.get('/infrastructure-health', async (req, res) => {
  const endpoints = {
    'API Gateway': 'http://localhost:3000/health',
    'Auth Service': 'http://auth-service:3001/health',
    'Users Service': 'http://users-service:3002/health',
    'Products Service': 'http://products-service:3003/health',
    'Orders Service': 'http://orders-service:3004/health',
    'Portfolio Backend': 'http://portfolio-backend:8002/health',
    'Prometheus': 'http://prometheus:9090/-/healthy',
    'Grafana': 'http://grafana:3000/api/health',
    'Alertmanager': 'http://alertmanager:9093/-/healthy',
    'Redis Exporter': 'http://redis-exporter:9121/metrics'
  };

  const results = [];
  
  for (const [name, url] of Object.entries(endpoints)) {
    const start = Date.now();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const responseTime = Date.now() - start;
      const contentType = response.headers.get("content-type");
      
      let uptime = undefined;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        uptime = data.uptime ? Math.round(data.uptime) : undefined;
      }
      
      results.push({
        name,
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime,
        uptime
      });
    } catch (error) {
      results.push({ name, status: 'unhealthy' });
    }
  }

  // Check Redis natively since Gateway has ioredis
  try {
    const Redis = require('ioredis');
    const start = Date.now();
    const redis = new Redis({ host: 'redis', port: 6379, maxRetriesPerRequest: 1, commandTimeout: 2000 });
    await redis.ping();
    results.push({ name: 'Redis', status: 'healthy', responseTime: Date.now() - start });
    redis.disconnect();
  } catch (error) {
    results.push({ name: 'Redis', status: 'unhealthy' });
  }

  // Optional Nginx check
  try {
    // Assuming gateway can reach proxy on its docker network ip or gateway ip, but it's tricky.
    // We'll just mark it healthy if the gateway is reachable, or ping the gateway container host.
    // For simplicity, we just mark Nginx as unknown or try to ping host machine on port 80.
    // We'll leave it as 'unknown' and let the dashboard handle it, or we try to ping gateway:80.
  } catch (e) {}

  res.json(results);
});

// Create proxy routes for each service
Object.entries(services).forEach(([name, config]) => {
  app.use(
    config.prefix,
    createProxyMiddleware({
      target: config.target,
      changeOrigin: true,
      pathRewrite: {
        [`^${config.prefix}`]: '',
      },
      on: {
        error: (err, req, res) => {
          console.error(`Proxy error for ${name}:`, err.message);
          res.status(503).json({
            error: 'Service Unavailable',
            service: name,
          });
        },
      },
    })
  );
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('📡 Registered services:');
  Object.entries(services).forEach(([name, config]) => {
    console.log(`   - ${config.prefix} -> ${config.target}`);
  });
});
