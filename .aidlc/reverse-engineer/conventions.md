<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Conventions

## Module: src (`src/`)

### File Organization

| Pattern | Convention |
|---------|-----------|
| Pages | `src/pages/{PageName}/index.tsx` — one directory per page |
| Components | `src/components/{ComponentName}.tsx` or `{Group}/{ComponentName}.tsx` |
| Stores | `src/store/use{Name}Store.ts` — Zustand hook naming |
| Services | `src/services/{name}.ts` |
| Router | `src/router/index.tsx` + guards |
| i18n | `src/i18n/locales/{lang}.json` |

### Component Patterns

| Pattern | Description |
|---------|-------------|
| Functional components only | No class components |
| Default exports | All pages and components use `export default function` |
| MUI imports | Individual package imports (`@mui/material/Box`, not `@mui/material`) |
| Inline styles via `sx` prop | No CSS files, no styled-components, all styling through MUI `sx` |
| Translation hook | `useTranslation()` from react-i18next |
| Navigation | `useNavigate()` from react-router |

### State Management Patterns

| Pattern | Description |
|---------|-------------|
| Store creation | `create<State>()(persist((set) => ({...}), {...}))` |
| Selector pattern | `useStore((s) => s.field)` — single field selectors |
| Persist middleware | All stores use `zustand/middleware/persist` with `partialize` |

### Styling Conventions

| Token | Light Value | Dark Value |
|-------|------------|------------|
| Primary | `#2563EB` | `#2563EB` |
| Text Primary | `#1E293B` | `#E2E8F0` |
| Text Secondary | `#64748B` | `#94A3B8` |
| Background | `#F8FAFC` | `#0F172A` |
| Paper | `#FFFFFF` | `#1E293B` |
| Divider | `#E2E8F0` | `#334155` |
| Sidebar BG | `#0F172A` | — |
| Font | Inter, system | — |
| Border Radius | 8px (inputs), 12px (cards) | — |

### Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `AdminLayout`, `AvatarMenu` |
| Stores | camelCase with `use` prefix | `useAuthStore` |
| i18n keys | dot.notation, nested by area | `admin.nav.products` |
| CSS colors | Hex literals in sx props | `#2563EB` |
| Event handlers | `handle` prefix | `handleLogin`, `handleLogout` |

### Error Handling

- No global error boundary
- Login page shows inline `<Alert>` on failure
- HTTP 401 triggers hard redirect (window.location.href)
- No toast/snackbar notification system yet

### Testing

- No test framework installed
- No test files exist
- No test commands in package.json
