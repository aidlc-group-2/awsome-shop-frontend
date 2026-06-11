<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# API Surface

## Module: src (`src/`)

### HTTP Client Configuration (`src/services/request.ts`)

| Setting | Value |
|---------|-------|
| Base URL | `VITE_API_BASE_URL` env var or `/api` |
| Timeout | 10,000ms |
| Auth Header | `Bearer {token}` from `localStorage('token')` |
| 401 Handling | Remove token, redirect to `/login` |
| Response Transform | Returns `response.data` (unwraps Axios response) |

### Planned API Endpoints (not yet implemented)

Based on README and component structure, the following endpoints are expected:

| Method | Path (via gateway) | Service | Purpose |
|--------|-------------------|---------|---------|
| POST | /auth/login | auth-service:8001 | User authentication |
| POST | /auth/register | auth-service:8001 | User registration |
| GET | /products | product-service:8002 | List products |
| GET | /products/:id | product-service:8002 | Product detail |
| POST | /products | product-service:8002 | Create product (admin) |
| PUT | /products/:id | product-service:8002 | Update product (admin) |
| DELETE | /products/:id | product-service:8002 | Delete product (admin) |
| GET | /categories | product-service:8002 | List categories |
| GET | /points/balance | points-service:8003 | Get user points |
| POST | /orders | order-service:8004 | Place redemption order |
| GET | /orders | order-service:8004 | List orders |

### Frontend Routes (client-side)

| Path | Component | Auth | Role |
|------|-----------|------|------|
| `/login` | Login | No | — |
| `/` | ShopHome | Yes | employee |
| `/orders` | (not implemented) | Yes | employee |
| `/points` | (not implemented) | Yes | employee |
| `/admin` | Dashboard | Yes | admin |
| `/admin/products` | (not implemented) | Yes | admin |
| `/admin/categories` | (not implemented) | Yes | admin |
| `/admin/points` | (not implemented) | Yes | admin |
| `/admin/orders` | (not implemented) | Yes | admin |
| `/admin/users` | (not implemented) | Yes | admin |
| `*` | NotFound | No | — |

### Authentication Flow

```
1. User enters credentials on /login
2. useAuthStore.login() validates against MOCK_USERS (frontend-only)
3. On success: user info persisted to localStorage via Zustand persist
4. AuthGuard checks isAuthenticated + role on protected routes
5. Logout: clears state + localStorage, redirects to /login
```

Note: No JWT token is actually issued. The `request.ts` reads `localStorage('token')` but nothing writes it. This is a stub for future backend integration.
