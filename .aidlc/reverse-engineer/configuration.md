<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Configuration

## Module: src (`src/`)

### Environment Variables

| Variable | Default | Used In | Description |
|----------|---------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | `services/request.ts:4` | Backend API base URL |

### Feature Flags

None detected.

### Build Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build config (React plugin) |
| `tsconfig.json` | TypeScript project references |
| `tsconfig.app.json` | App source TypeScript config |
| `tsconfig.node.json` | Node/Vite config TypeScript config |
| `eslint.config.js` | ESLint flat config |

### Runtime Configuration

| Config | Storage | Description |
|--------|---------|-------------|
| Theme mode | localStorage `app-storage` | dark/light |
| Language | localStorage `app-storage` | zh/en |
| Auth state | localStorage `auth-storage` | user info, isAuthenticated |

### Missing Configuration

- No `.env` or `.env.example` file
- No environment-specific config (dev/staging/prod)
- No proxy config for dev server (expected for API gateway routing)
