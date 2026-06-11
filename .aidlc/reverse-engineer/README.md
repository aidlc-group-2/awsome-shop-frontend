<!-- Analyzed: 2025-07-21T15:07:00Z | Scope: full project -->

# Reverse Engineer Report — AWSome Shop Frontend

## How to Use This Analysis

This directory contains 11 analysis documents covering the complete AWSome Shop Frontend codebase. Use them to:

- **Understand the current state** before designing new features
- **Identify conventions** to follow when writing new code
- **Find technical debt** to address during implementation
- **Plan backend integration** using the API surface document

## Document Index

### 📋 Navigation & Overview
| Document | Description |
|----------|-------------|
| [overview.md](./overview.md) | System overview, tech stack, architecture diagram, statistics |
| [modules.md](./modules.md) | Module inventory, dependencies, import graph |

### 📊 Technical Analysis
| Document | Description |
|----------|-------------|
| [data-model.md](./data-model.md) | Entities, types, persistence, access patterns |
| [api-surface.md](./api-surface.md) | HTTP client config, planned endpoints, routes, auth flow |
| [business-rules.md](./business-rules.md) | Auth rules, i18n rules, theme rules, navigation rules |
| [features.md](./features.md) | Implemented vs planned features, user journeys, completeness |

### 🔌 Operations & Integration
| Document | Description |
|----------|-------------|
| [integrations.md](./integrations.md) | External services (planned), browser APIs, error handling |
| [infrastructure.md](./infrastructure.md) | Build system, scripts, deployment status |
| [configuration.md](./configuration.md) | Environment variables, runtime config |

### 🛡️ Quality & Risk
| Document | Description |
|----------|-------------|
| [conventions.md](./conventions.md) | File organization, component patterns, naming, styling |
| [security.md](./security.md) | Auth coverage, findings, secrets, data exposure |
| [debt.md](./debt.md) | Technical debt items, complexity hotspots, remediation priorities |

## Key Findings

- **20 source files**, well-organized SPA with React 19 + MUI 6
- **Infrastructure complete** (auth, i18n, theme, routing) — ready for feature development
- **~75% of pages missing** — UI skeletons needed for employee and admin features
- **No tests** — highest-priority debt
- **Mock data in components** — needs extraction before API integration
- **Backend services not connected** — Axios ready, endpoints known, waiting for team
