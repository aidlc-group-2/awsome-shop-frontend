<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Features

## Module: src (`src/`)

### Implemented Features

| Feature | Maturity | Pages | Description |
|---------|----------|-------|-------------|
| Login | Stable | Login | Username/password login with mock validation |
| Employee Shop Home | Stable | ShopHome | Hero banner, category filter, product grid (4 mock items) |
| Admin Dashboard | Stable | Dashboard | 4 metric cards + recent orders table (mock data) |
| Theme Switching | Stable | All | Light/dark mode toggle via avatar menu |
| i18n (zh/en) | Stable | All | Full Chinese/English translation |
| Role-based Access | Stable | All | AuthGuard with employee/admin routing |
| Avatar Menu | Stable | Authenticated | Language switch, theme switch, logout |

### Planned Features (not implemented)

| Feature | Route | Role | Evidence |
|---------|-------|------|----------|
| Employee Orders | `/orders` | employee | Nav item exists in EmployeeLayout |
| Employee Points Center | `/points` | employee | Nav item exists in EmployeeLayout |
| Admin Product CRUD | `/admin/products` | admin | Sidebar nav item exists |
| Admin Category Management | `/admin/categories` | admin | Sidebar nav item exists |
| Admin Points Management | `/admin/points` | admin | Sidebar nav item exists |
| Admin Order Records | `/admin/orders` | admin | Sidebar nav item exists |
| Admin User Management | `/admin/users` | admin | Sidebar nav item exists |
| User Registration | `/register` | — | Link on login page, no route/page |
| Product Detail | TBD | employee | Redeem buttons exist but no handler |
| Search | — | employee | Search bar UI exists, no functionality |
| Backend API Integration | — | all | Axios instance ready, mock data in use |

### User Journeys

#### Employee Journey

```
Login → ShopHome (browse products) → [TODO: Product Detail → Redeem → Orders]
                                    → [TODO: Points Center]
```

#### Admin Journey

```
Login → Dashboard (metrics overview) → [TODO: Products CRUD]
                                      → [TODO: Categories]
                                      → [TODO: Points Management]
                                      → [TODO: Orders]
                                      → [TODO: Users]
```

### Feature Completeness

| Area | Implemented | Total | % |
|------|-------------|-------|---|
| Employee Pages | 1 | 4 | 25% |
| Admin Pages | 1 | 6 | 17% |
| Infrastructure | 5/5 (auth, i18n, theme, routing, HTTP) | 5 | 100% |
| Backend Integration | 0 | 1 | 0% |
