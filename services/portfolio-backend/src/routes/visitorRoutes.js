const express = require('express');
const router = express.Router();
const redis = require('../config/redisClient');
const { sendVisitorEmail } = require('../services/emailService');

/**
 * Detect device type from User-Agent string
 */
function getDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) return 'Mobile';
  return 'Desktop';
}

/**
 * POST /visit
 * Records a portfolio visit and sends an email notification
 */
router.post('/', async (req, res) => {
  try {
    const { page, referrer, screenWidth, screenHeight, language, timezone } = req.body;

    // Extract server-side data
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const deviceType = getDeviceType(userAgent);

    const visitData = {
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      deviceType,
      page: page || '/',
      referrer: referrer || '',
      screenResolution: screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : 'Unknown',
      language: language || 'Unknown',
      timezone: timezone || 'Unknown',
    };

    // Store in Redis (fire-and-forget, don't block response)
    redis.lpush('visits:log', JSON.stringify(visitData)).catch((err) => {
      console.error('❌ Redis visit store error:', err.message);
    });

    // Send email notification (async, don't block response)
    sendVisitorEmail(visitData).catch((err) => {
      console.error('❌ Visitor email error:', err.message);
    });

    // Return immediately — don't wait for Redis or email
    res.status(204).end();
  } catch (error) {
    console.error('❌ Visit tracking error:', error.message);
    // Still return 204 — tracking failure shouldn't affect the visitor
    res.status(204).end();
  }
});

/**
 * GET /visit/stats
 * Quick stats endpoint — returns total visit count and last 10 visits
 */
router.get('/stats', async (req, res) => {
  try {
    const [total, recent] = await Promise.all([
      redis.llen('visits:log'),
      redis.lrange('visits:log', 0, 9),
    ]);

    res.json({
      totalVisits: total,
      recentVisits: recent.map((v) => JSON.parse(v)),
    });
  } catch (error) {
    console.error('❌ Visit stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch visit stats' });
  }
});

module.exports = router;
