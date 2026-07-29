# Graph Report - .  (2026-07-20)

## Corpus Check
- Large corpus: 195 files ╖ ~594,614 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 492 nodes · 565 edges · 42 communities (28 shown, 14 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Portfolio Dependencies
- Portfolio UI Components
- Dashboard React App
- Portfolio Backend API
- Portfolio UI Support
- Portfolio Build Config
- Dashboard Build Dependencies
- Dashboard App Layout
- Dashboard Service Flow
- Dashboard Metrics Types
- Shared Package Config
- User Service Models
- Service Route Handlers
- Infrastructure Config
- Grafana/Prometheus
- Docker Compose/Networking
- Monitoring & Alerts
- Gateway Middleware
- Gateway Security
- Authentication & Auth Service
- Redis/Cache Integration
- Logging & Metrics Middleware
- Service Utilities
- Frontend Assets
- Portfolio Text & Docs
- CI/CD Workflow
- Shared Auth/Password
- Shared Redis Client
- Shared Utilities
- Environment & Secrets
- API Documentation
- Dockerfile/Container Setup
- Web App Entry Points

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `ServiceStatus` - 10 edges
3. `fadeIn()` - 9 edges
4. `scripts` - 7 edges
5. `compilerOptions` - 7 edges
6. `TokenBucket` - 7 edges
7. `scripts` - 5 edges
8. `ArchitectureView()` - 5 edges
9. `statusDot()` - 5 edges
10. `production` - 4 edges

## Surprising Connections (you probably didn't know these)
- `ArchitectureViewProps` --references--> `ServiceStatus`  [EXTRACTED]
  dashboard/src/components/ArchitectureView.tsx → dashboard/src/types.ts
- `ArchitectureView()` --indirect_call--> `DataNode()`  [INFERRED]
  dashboard/src/components/ArchitectureView.tsx → dashboard/src/components/FlowNodes.tsx
- `ArchitectureView()` --indirect_call--> `GatewayNode()`  [INFERRED]
  dashboard/src/components/ArchitectureView.tsx → dashboard/src/components/FlowNodes.tsx
- `ArchitectureView()` --indirect_call--> `MonitoringNode()`  [INFERRED]
  dashboard/src/components/ArchitectureView.tsx → dashboard/src/components/FlowNodes.tsx
- `ArchitectureView()` --indirect_call--> `ServiceNode()`  [INFERRED]
  dashboard/src/components/ArchitectureView.tsx → dashboard/src/components/FlowNodes.tsx

## Import Cycles
- None detected.

## Communities (42 total, 14 thin omitted)

### Community 0 - "Portfolio Dependencies"
Cohesion: 0.04
Nodes (45): @babel/plugin-proposal-private-property-in-object, @babel/runtime, caniuse-lite, @emailjs/browser, emailjs-com, maath, dependencies, @babel/plugin-proposal-private-property-in-object (+37 more)

### Community 1 - "Portfolio UI Components"
Cohesion: 0.08
Nodes (18): About(), BallCanvas(), ComputersCanvas(), EarthCanvas(), StarsCanvas(), footer(), CTA(), header() (+10 more)

### Community 2 - "Dashboard React App"
Cohesion: 0.10
Nodes (25): App(), ArchitectureView(), ArchitectureViewProps, DataNode(), GatewayNode(), MonitoringNode(), ServiceNode(), statusDot() (+17 more)

### Community 3 - "Portfolio Backend API"
Cohesion: 0.07
Nodes (24): app, cors, express, { metricsMiddleware, getMetrics }, skillsRouter, visitorRouter, Redis, skills (+16 more)

### Community 4 - "Portfolio UI Support"
Cohesion: 0.12
Nodes (16): CodingStats(), getLangColor(), LANG_COLORS, TopLanguagesCard(), useGitHubStats(), ErrorState(), Experience(), StarWrapper() (+8 more)

### Community 5 - "Portfolio Build Config"
Cohesion: 0.07
Nodes (28): gh-pages, browserslist, development, production, devDependencies, autoprefixer, gh-pages, postcss (+20 more)

### Community 6 - "Dashboard Build Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, postcss, tailwindcss, @types/react (+19 more)

### Community 7 - "Dashboard App Layout"
Cohesion: 0.08
Nodes (25): nodemailer, author, dependencies, cors, dotenv, express, ioredis, nodemailer (+17 more)

### Community 8 - "Dashboard Service Flow"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, lucide-react, react, react-dom, recharts, sonner, @xyflow/react (+16 more)

### Community 9 - "Dashboard Metrics Types"
Cohesion: 0.08
Nodes (23): dependencies, cors, dotenv, express, http-proxy-middleware, ioredis, prom-client, devDependencies (+15 more)

### Community 10 - "Shared Package Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+14 more)

### Community 11 - "User Service Models"
Cohesion: 0.10
Nodes (17): services, app, cors, { createProxyMiddleware }, express, { metricsMiddleware, getMetrics }, rateLimiter, { services } (+9 more)

### Community 12 - "Service Route Handlers"
Cohesion: 0.16
Nodes (14): App(), ChatBot(), WELCOME_MESSAGE, generateResponse(), getSuggestions(), matchIntent(), normalize(), scoreIntents() (+6 more)

### Community 13 - "Infrastructure Config"
Cohesion: 0.21
Nodes (5): Redis, getBucket(), redis, saveBucket(), TokenBucket

### Community 14 - "Grafana/Prometheus"
Cohesion: 0.18
Nodes (10): dependencies, express, express, main, name, scripts, dev, start (+2 more)

### Community 15 - "Docker Compose/Networking"
Cohesion: 0.18
Nodes (10): dependencies, express, express, main, name, scripts, dev, start (+2 more)

### Community 16 - "Monitoring & Alerts"
Cohesion: 0.18
Nodes (10): dependencies, express, express, main, name, scripts, dev, start (+2 more)

### Community 17 - "Gateway Middleware"
Cohesion: 0.18
Nodes (10): dependencies, express, express, main, name, scripts, dev, start (+2 more)

### Community 18 - "Gateway Security"
Cohesion: 0.20
Nodes (9): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include (+1 more)

## Knowledge Gaps
- **218 isolated node(s):** `name`, `version`, `private`, `@babel/plugin-proposal-private-property-in-object`, `@babel/runtime` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Portfolio Dependencies` to `Portfolio Build Config`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dashboard Build Dependencies` to `Dashboard Service Flow`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `Portfolio UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07564102564102564 - nodes in this community are weakly interconnected._
- **Should `Dashboard React App` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `Portfolio Backend API` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._