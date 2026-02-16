// API Gateway entry point
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('./config/services');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply rate limiting to all API routes
app.use(rateLimiter);

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
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
