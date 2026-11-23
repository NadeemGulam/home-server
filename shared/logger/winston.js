// Logging config with OpenTelemetry trace context correlation
const winston = require('winston');

let api;
try {
  api = require('@opentelemetry/api');
} catch (e) {
  api = null;
}

const traceContextFormat = winston.format((info) => {
  if (!api) return info;

  try {
    const span = api.trace.getSpan(api.context.active());
    if (!span) return info;
    const spanContext = span.spanContext();
    if (!spanContext || !spanContext.traceId) return info;
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
    info.trace_flags = spanContext.traceFlags;
  } catch (e) {
    // ignore trace context lookup failures
  }

  return info;
});

module.exports = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    traceContextFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});
