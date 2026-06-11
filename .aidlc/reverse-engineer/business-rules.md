<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Business Rules

## Module: src (`src/`)

### Authentication & Authorization

| Rule | Location | Description |
|------|----------|-------------|
| Role-based routing | `router/AuthGuard.tsx` | Unauthenticated → `/login`; wrong role → redirect to role's default page |
| Admin default | `router/AuthGuard.tsx:15` | Admin users redirect to `/admin` |
| Employee default | `router/AuthGuard.tsx:15` | Employee users redirect to `/` |
| Mock credentials | `store/useAuthStore.ts` | admin/admin123, employee/emp123 |

### Internationalization Rules

| Rule | Location | Description |
|------|----------|-------------|
| Login page language | `pages/Login/index.tsx:27-30` | Always follows browser language, ignores stored preference |
| Authenticated pages language | `components/AvatarMenu.tsx:28-31` | Restores user's stored language preference |
| Language persistence | `store/useAppStore.ts` | Persisted to `app-storage` in localStorage |

### Theme Rules

| Rule | Location | Description |
|------|----------|-------------|
| Login page theme | `pages/Login/index.tsx:25` | Always uses light theme regardless of stored preference |
| App theme | `App.tsx:8` | Follows `darkMode` from useAppStore |
| Theme persistence | `store/useAppStore.ts` | Persisted to `app-storage` in localStorage |

### Product Display Rules

| Rule | Location | Description |
|------|----------|-------------|
| Category filtering | `pages/ShopHome/index.tsx:78-80` | 'all' shows everything; otherwise filter by `category` field |
| Grid layout | `pages/ShopHome/index.tsx:119` | 4 columns, 20px gap |
| Points formatting | Multiple | `toLocaleString()` for thousands separator |

### Navigation Rules

| Rule | Location | Description |
|------|----------|-------------|
| Admin sidebar active state | `AdminLayout.tsx:55-58` | Dashboard exact match; others use `startsWith` |
| Employee nav active state | `EmployeeLayout.tsx:52` | Exact path match |

### State Machines

No formal state machines detected. Order status (`completed`, `pending`, `processing`) is mock data only.
