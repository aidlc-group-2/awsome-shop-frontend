<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Technical Debt

## Module: src (`src/`)

### Risk Heatmap

| Area | Complexity | Test Gap | Maintainability | Overall Risk |
|------|-----------|----------|-----------------|--------------|
| Authentication | Low | High | Medium | 🟡 Medium |
| Pages | Low | High | Low | 🟢 Low |
| State Management | Low | High | Low | 🟢 Low |
| Service Layer | Low | High | Low | 🟢 Low |
| Routing | Low | High | Low | 🟢 Low |

### Debt Items

| Priority | Category | Description | Location |
|----------|----------|-------------|----------|
| High | Testing | No test framework, no tests at all | Project-wide |
| Medium | Data coupling | Mock data hardcoded inside page components | `ShopHome/index.tsx`, `Dashboard/index.tsx` |
| Medium | Incomplete routing | Nav items point to routes that don't exist | `AdminLayout.tsx`, `EmployeeLayout.tsx` |
| Medium | Token mismatch | `request.ts` reads a token that's never written | `services/request.ts:5` |
| Low | Dead code | `src/pages/Home/index.tsx` exists but not routed | `pages/Home/` |
| Low | Unused exports | `Layout/index.tsx`, `Layout/AppHeader.tsx`, `Layout/Sidebar.tsx` — unclear usage | `components/Layout/` |
| Low | Hardcoded colors | Many colors written as hex literals in sx props instead of theme tokens | Multiple files |
| Low | No error boundary | App crashes propagate to white screen | `App.tsx` |
| Low | No loading states | No skeleton/spinner during async operations | All pages |

### Complexity Hotspots

| File | Lines | Concern |
|------|-------|---------|
| `pages/Login/index.tsx` | ~180 | Large single component with form logic + UI |
| `pages/ShopHome/index.tsx` | ~190 | Mock data + UI in same file |
| `components/Layout/EmployeeLayout.tsx` | ~120 | Complex layout with search bar, nav, points |
| `components/Layout/AdminLayout.tsx` | ~110 | Sidebar navigation logic |

### Remediation Priorities

1. **Extract mock data** — Move product/category/order mock data to `src/mocks/` or dedicated service files. This unblocks both testing and API integration.
2. **Add test framework** — Install Vitest + React Testing Library. At minimum, test AuthGuard logic and store behavior.
3. **Create missing pages** — Stub placeholder pages for all nav routes to prevent 404s.
4. **Add `.env.example`** — Document required environment variables.
5. **Error boundary** — Add React error boundary at App level.

### Architectural Debt

- No clear separation between data fetching and presentation (mock data lives in page components)
- No service abstraction per domain (product service, order service, etc.)
- Zustand stores handle both state and "API calls" (login mock)

These are expected for an early-stage project and should be addressed as features are built.
