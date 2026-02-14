const express = require('express');
const app = express();

const PORT = 8002;

// Import routes
const skillsRouter = require('./src/routes/skills');

// Use routes
app.use('/skills', skillsRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timstamp: new Date(),
    uptime: process.uptime()
  });
});

app.get('/metrics', (req, res) => {
  res.json({
    status: 'healthy Metrics', 
    timstamp: new Date(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PORTFOLIO Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
