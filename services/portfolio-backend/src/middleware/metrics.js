// Prometheus metrics middleware for Portfolio Backend
const client = require('prom-client');

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register]
});

// Middleware function
function metricsMiddleware(req, res, next) {
  const start = Date.now();

  // Hook into response finish to record metrics
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const status = res.statusCode;

    // Record request count
    httpRequestsTotal.inc({
      method,
      route,
      status
    });

    // Record request duration
    httpRequestDuration.observe({
      method,
      route,
      status
    }, duration);
  });

  next();
}

// Expose metrics method for /metrics endpoint
function getMetrics(req, res) {
  res.set('Content-Type', register.contentType);
  register.metrics().then(data => {
    res.send(data);
  });
}

module.exports = {
  metricsMiddleware,
  getMetrics
};
