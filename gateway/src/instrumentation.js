'use strict';

// OpenTelemetry bootstrap for the API gateway.
// Must be loaded before the application (node --require ./src/instrumentation.js).

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { logs, SeverityNumber } = require('@opentelemetry/api-logs');
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { context, trace, diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

if (process.env.OTEL_DIAGNOSTIC_LOG_LEVEL === 'debug') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

const serviceName = process.env.OTEL_SERVICE_NAME || 'gateway';
const otlpEndpoint = (process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318').replace(/\/$/, '');

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  [SemanticResourceAttributes.SERVICE_NAMESPACE]: process.env.OTEL_SERVICE_NAMESPACE || 'home-server',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || process.env.DEPLOYMENT_ENV || 'production',
});

const traceExporter = new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` });
const metricExporter = new OTLPMetricExporter({ url: `${otlpEndpoint}/v1/metrics` });
const logExporter = new OTLPLogExporter({ url: `${otlpEndpoint}/v1/logs` });

const loggerProvider = new LoggerProvider({ resource });
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
logs.setGlobalLoggerProvider(loggerProvider);
const otelLogger = logs.getLogger(serviceName);

const severityByConsoleMethod = {
  log: { number: SeverityNumber.INFO, text: 'INFO' },
  info: { number: SeverityNumber.INFO, text: 'INFO' },
  warn: { number: SeverityNumber.WARN, text: 'WARN' },
  error: { number: SeverityNumber.ERROR, text: 'ERROR' },
  debug: { number: SeverityNumber.DEBUG, text: 'DEBUG' },
};

function formatConsoleArg(arg) {
  if (typeof arg === 'string') return arg;
  try {
    return JSON.stringify(arg);
  } catch (e) {
    return String(arg);
  }
}

['log', 'info', 'warn', 'error', 'debug'].forEach((method) => {
  const original = console[method].bind(console);
  console[method] = (...args) => {
    original(...args);
    try {
      const span = trace.getSpan(context.active());
      const spanContext = span ? span.spanContext() : undefined;
      const severity = severityByConsoleMethod[method] || severityByConsoleMethod.info;
      otelLogger.emit({
        severityNumber: severity.number,
        severityText: severity.text,
        body: args.map(formatConsoleArg).join(' '),
        attributes: {
          'log.source': 'console',
          'log.console.method': method,
          ...(spanContext && spanContext.traceId ? {
            'trace_id': spanContext.traceId,
            'span_id': spanContext.spanId,
            'trace_flags': spanContext.traceFlags,
          } : {}),
        },
      });
    } catch (e) {
      // never break application logging
    }
  };
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: Number(process.env.OTEL_METRIC_EXPORT_INTERVAL || 15000),
  }),
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': { enabled: false },
  })],
});

sdk.start();

const shutdown = async () => {
  try {
    await sdk.shutdown();
  } catch (e) {
    // ignore shutdown errors
  }
  try {
    await loggerProvider.shutdown();
  } catch (e) {
    // ignore shutdown errors
  }
};

process.on('SIGTERM', () => {
  shutdown().finally(() => process.exit(0));
});
process.on('SIGINT', () => {
  shutdown().finally(() => process.exit(0));
});

console.log(`[otel] instrumentation started for ${serviceName} -> ${otlpEndpoint}`);
