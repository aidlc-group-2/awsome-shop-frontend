<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Infrastructure

## Module: src (`src/`)

### Build System

| Tool | Config File | Purpose |
|------|------------|---------|
| Vite 7.3 | `vite.config.ts` | Dev server, bundling, HMR |
| TypeScript 5.9 | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | Type checking |
| ESLint 9 | `eslint.config.js` | Linting |

### Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build |

### Deployment

- No Dockerfile
- No CI/CD pipeline config (no `.github/workflows/`, no `Jenkinsfile`)
- No infrastructure-as-code files
- Designed to run at port 3000 (team convention)

### Hosting

- Development: Local Vite dev server
- Production: Not configured (SPA, needs static hosting + API proxy)

### Monitoring

- No logging library
- No error tracking (Sentry, etc.)
- No analytics
