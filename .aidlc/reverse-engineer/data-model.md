<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Data Model

## Module: src (`src/`)

### Entities

#### UserInfo (`src/store/useAuthStore.ts`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Login identifier |
| displayName | string | Yes | Display name shown in UI |
| role | `'employee' \| 'admin'` | Yes | User role for access control |
| points | number | No | Points balance (employee only) |
| avatar | string | No | Avatar URL |

#### AuthState (`src/store/useAuthStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| user | `UserInfo \| null` | Current authenticated user |
| isAuthenticated | boolean | Authentication flag |
| login | `(username, password) => Promise<boolean>` | Login action |
| logout | `() => void` | Logout action |

#### AppState (`src/store/useAppStore.ts`)

| Field | Type | Description |
|-------|------|-------------|
| sidebarOpen | boolean | Admin sidebar toggle |
| darkMode | boolean | Theme preference |
| language | string | Language preference ('zh' \| 'en') |

### Mock Data Structures (hardcoded in components)

#### Product (implicit, `src/pages/ShopHome/index.tsx`)

| Field | Type | Description |
|-------|------|-------------|
| id | number | Product ID |
| name | string | Product name |
| category | string | Category key |
| categoryLabel | string | Category display name |
| rating | number | Average rating (0-5) |
| reviews | number | Review count |
| sold | number | Units sold |
| points | number | Points price |
| icon | React Component | MUI icon component |
| bgColor | string | Card background color |
| iconColor | string | Icon color |
| tag | string \| null | Badge text (e.g., '热销', '新品') |
| tagColor | string \| null | Badge color |

#### Category (implicit, `src/pages/ShopHome/index.tsx`)

| Field | Type | Description |
|-------|------|-------------|
| key | string | Category identifier |
| label | string | Display label |

#### Order (implicit, `src/pages/Dashboard/index.tsx`)

| Field | Type | Description |
|-------|------|-------------|
| user | string | User name |
| product | string | Product name |
| points | string | Points spent |
| status | `'completed' \| 'pending' \| 'processing'` | Order status |
| time | string | Order time |

### Persistence

| Store | Storage Key | Persisted Fields |
|-------|-------------|-----------------|
| useAuthStore | `auth-storage` | user, isAuthenticated |
| useAppStore | `app-storage` | darkMode, language |

### Access Patterns

- **Read user info**: `useAuthStore((s) => s.user)` — used in layouts, avatar menu
- **Check auth**: `useAuthStore((s) => s.isAuthenticated)` — used in AuthGuard
- **Read theme**: `useAppStore((s) => s.darkMode)` — used in App.tsx
- **Read language**: `useAppStore((s) => s.language)` — used in AvatarMenu
