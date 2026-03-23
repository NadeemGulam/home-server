require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 8002;

// Import routes
const skillsRouter = require('./src/routes/skills');
const visitorRouter = require('./src/routes/visitorRoutes');
const { metricsMiddleware, getMetrics } = require('./src/middleware/metrics');

// Use middleware
app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());

/*
For the Production use case 

app.use(cors({
  origin: 'https://portfolio-site.com'
}));

*/

app.use('/skills', skillsRouter);
app.use('/visit', visitorRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timstamp: new Date(),
    uptime: process.uptime()
  });
});

// Prometheus metrics endpoint
app.get('/metrics', getMetrics);

app.listen(PORT, () => {
  console.log(`🚀 PORTFOLIO Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
