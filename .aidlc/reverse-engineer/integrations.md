<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Integrations

## Module: src (`src/`)

### External Services (Planned, not connected)

| Service | Protocol | Port | Purpose | Status |
|---------|----------|------|---------|--------|
| API Gateway | HTTP/REST | 8080 | Request routing, auth validation | Not connected |
| Auth Service | HTTP/REST | 8001 | Login, register, JWT, roles | Not connected |
| Product Service | HTTP/REST | 8002 | Product CRUD, categories, file upload | Not connected |
| Points Service | HTTP/REST | 8003 | Balance, auto-grant, manual adjust | Not connected |
| Order Service | HTTP/REST | 8004 | Place orders, status management | Not connected |

### Browser APIs Used

| API | Location | Purpose |
|-----|----------|---------|
| localStorage | Zustand persist middleware | State persistence (auth, preferences) |
| navigator.language | `pages/Login/index.tsx:28` | Browser language detection |
| window.location.href | `services/request.ts:19` | Hard redirect on 401 |

### Third-party SDKs

None. All UI is built with MUI components.

### Error Handling

| Scenario | Handler | Behavior |
|----------|---------|----------|
| HTTP 401 | `services/request.ts:18-20` | Remove token, redirect to /login |
| Login failure | `pages/Login/index.tsx:52` | Show error Alert |
| Other HTTP errors | `services/request.ts:22` | Reject promise (unhandled in current mock code) |
