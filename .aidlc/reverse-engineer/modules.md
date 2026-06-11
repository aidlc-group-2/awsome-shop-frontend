<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Module Inventory

## Summary

This is a small single-module frontend project. All source code resides under `src/` with conventional sub-directory organization.

## Modules

### Module: src (`src/`)

| Attribute | Value |
|-----------|-------|
| Purpose | Complete SPA frontend application |
| Files | 20 |
| Sub-directories | 7 (components, pages, router, store, services, i18n, theme) |
| Test Coverage | None |
| Dependencies | External only (npm packages) |

#### Sub-modules

| Sub-directory | Purpose | Files |
|---------------|---------|-------|
| `components/` | Shared UI components (layouts, menus) | 6 |
| `pages/` | Route-level page components | 5 |
| `router/` | Route config + auth guard | 2 |
| `store/` | Zustand state stores | 2 |
| `services/` | HTTP client (Axios) | 1 |
| `i18n/` | Internationalization config + locales | 3 |
| `theme/` | MUI theme factory | 1 |

#### Import Dependencies

```
App.tsx
├── theme/index.ts
├── store/useAppStore.ts
└── router/index.tsx
    ├── pages/Login
    ├── pages/NotFound
    ├── pages/ShopHome
    ├── pages/Dashboard
    ├── components/Layout/EmployeeLayout
    ├── components/Layout/AdminLayout
    └── router/AuthGuard
        └── store/useAuthStore

components/AvatarMenu
├── store/useAuthStore
└── store/useAppStore

components/Layout/EmployeeLayout
├── store/useAuthStore
└── components/AvatarMenu

components/Layout/AdminLayout
└── components/AvatarMenu
```

#### Circular Dependencies

None detected.
