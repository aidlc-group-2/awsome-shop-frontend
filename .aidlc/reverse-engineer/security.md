<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Security

## Module: src (`src/`)

### Authentication Coverage

| Route | Protected | Method |
|-------|-----------|--------|
| `/login` | No | Public |
| `/` | Yes | AuthGuard (role: employee) |
| `/admin` | Yes | AuthGuard (role: admin) |
| `*` | No | 404 page |

**Coverage: 2/4 routes protected (50%)** — appropriate since login and 404 should be public.

### Findings

| Severity | Finding | Location | Description |
|----------|---------|----------|-------------|
| Medium | Mock authentication | `store/useAuthStore.ts` | Credentials hardcoded in frontend; no real auth |
| Medium | No token management | `services/request.ts` | Reads `localStorage('token')` but nothing writes it |
| Low | No CSRF protection | — | SPA with API calls; relies on backend for CSRF |
| Low | No input sanitization | `pages/Login/index.tsx` | User inputs not sanitized (React handles XSS by default) |
| Info | No Content Security Policy | `index.html` | No CSP headers configured |

### Auth Mechanism

Current: Frontend-only mock authentication (NOT suitable for production)
Planned: JWT via auth-service → API Gateway validation

### Secrets

| Item | Location | Status |
|------|----------|--------|
| Mock passwords | `store/useAuthStore.ts:17-27` | Hardcoded in source (acceptable for dev mock) |
| API token | `localStorage('token')` | Not yet used |

### Data Exposure

- No sensitive data exposed in client-side storage beyond user display info
- Points balance stored in Zustand persist (non-critical)
- Auth state (isAuthenticated flag) in localStorage

### Overall Security Posture

**Development Stage** — No real security concerns since all data is mock and no backend is connected. Security needs to be addressed when integrating with real auth-service (JWT handling, token refresh, secure storage).
