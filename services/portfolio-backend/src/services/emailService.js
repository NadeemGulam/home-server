const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_FROM,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter on startup
transporter.verify()
  .then(() => console.log('✅ Email transporter ready'))
  .catch((err) => console.error('❌ Email transporter error:', err.message));

/**
 * Send a visitor notification email with all visit details
 */
async function sendVisitorEmail(visitData) {
  const {
    timestamp,
    ip,
    userAgent,
    deviceType,
    page,
    referrer,
    screenResolution,
    language,
    timezone,
  } = visitData;

  const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const mailOptions = {
    from: `"Portfolio Tracker 📊" <${process.env.GMAIL_FROM}>`,
    to: process.env.ALERT_EMAIL_TO,
    subject: `👀 New Portfolio Visitor — ${deviceType} from ${timezone || 'Unknown'}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 25px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">👀 New Portfolio Visitor</h2>
          <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">${formattedTime}</p>
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; padding: 25px; border-radius: 0 0 12px 12px; background: #fafafa;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; width: 140px; border-bottom: 1px solid #e2e8f0;">🌐 IP Address</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;"><code>${ip}</code></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">📱 Device</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${deviceType}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">📄 Page</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${page || '/'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">🔗 Referrer</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${referrer || 'Direct visit'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">🖥️ Screen</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${screenResolution || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">🌍 Language</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${language || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568; border-bottom: 1px solid #e2e8f0;">🕐 Timezone</td>
              <td style="padding: 10px 12px; color: #2d3748; border-bottom: 1px solid #e2e8f0;">${timezone || 'Unknown'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #4a5568;">🔍 User Agent</td>
              <td style="padding: 10px 12px; color: #718096; font-size: 12px; word-break: break-all;">${userAgent || 'Unknown'}</td>
            </tr>
          </table>
        </div>
        <p style="text-align: center; color: #a0aec0; font-size: 11px; margin-top: 15px;">
          Portfolio Visitor Tracker • Home Server
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Visitor email sent for ${ip}`);
  } catch (error) {
    console.error('❌ Failed to send visitor email:', error.message);
  }
}

module.exports = { sendVisitorEmail };
