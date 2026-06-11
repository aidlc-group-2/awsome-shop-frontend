<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# System Overview

## Summary

AWSome Shop Frontend 是一個員工積分兌換商城的 SPA 前端應用，支援員工端（商品瀏覽、兌換）和管理端（商品/用戶/積分管理）雙角色系統。

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Build Tool | Vite | 7.3 |
| UI Library | MUI (Material-UI) | 6.5 |
| State Management | Zustand | 5.0 |
| Routing | React Router | 7.13 |
| i18n | i18next | 25.8 |
| HTTP Client | Axios | 1.13 |

## Architecture Pattern

Single Page Application (SPA) with:
- **Component-based architecture** — React functional components with hooks
- **Centralized state** — Zustand stores with localStorage persistence
- **Route-based code organization** — pages/, components/, router/
- **Service layer abstraction** — Axios instance with interceptors (ready for backend integration)
- **Feature-toggle ready** — i18n, theme switching, role-based access

## Project Statistics

| Metric | Count |
|--------|-------|
| Source files (src/) | 20 |
| Pages | 5 (Login, ShopHome, Dashboard, Home, NotFound) |
| Components | 7 (AvatarMenu, AdminLayout, EmployeeLayout, AppHeader, Sidebar, Layout/index) |
| Stores | 2 (useAuthStore, useAppStore) |
| Services | 1 (request.ts) |
| i18n locales | 2 (zh, en) |
| Routes | 4 (/, /login, /admin, *) |
| Test files | 0 |
| LOC (estimated) | ~1,800 |

## Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│                    Browser (SPA)                       │
├──────────────────────────────────────────────────────┤
│  App.tsx (ThemeProvider + RouterProvider)              │
│  ├── Login Page (public)                             │
│  ├── Employee Routes (AuthGuard role=employee)       │
│  │   └── EmployeeLayout → ShopHome                  │
│  └── Admin Routes (AuthGuard role=admin)             │
│       └── AdminLayout → Dashboard                    │
├──────────────────────────────────────────────────────┤
│  State Layer                                          │
│  ├── useAuthStore (user, login, logout)              │
│  └── useAppStore (darkMode, language, sidebar)       │
├──────────────────────────────────────────────────────┤
│  Service Layer                                        │
│  └── request.ts (Axios + Bearer token + 401 handler) │
├──────────────────────────────────────────────────────┤
│  Planned Backend (not yet connected)                  │
│  ├── API Gateway :8080                               │
│  ├── Auth Service :8001                              │
│  ├── Product Service :8002                           │
│  ├── Points Service :8003                            │
│  └── Order Service :8004                             │
└──────────────────────────────────────────────────────┘
```

## Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| Application | `src/main.tsx` | React root mount |
| Router | `src/router/index.tsx` | Route definitions |
| Dev Server | `npm run dev` | Vite dev server :3000 |
| Build | `npm run build` | tsc + vite build |

## Migration Readiness

| Aspect | Status | Notes |
|--------|--------|-------|
| Backend Integration | 🟡 Prepared | Axios instance ready, mock data in components |
| Testing | 🔴 None | No test framework installed |
| CI/CD | 🔴 None | No pipeline config |
| Docker | 🔴 None | No Dockerfile |
| Environment Config | 🟡 Partial | `VITE_API_BASE_URL` env var supported |
