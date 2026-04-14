# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Digital Menu (`artifacts/digital-menu`)
- **Kind**: React + Vite web app (frontend-only)
- **Preview Path**: `/`
- Mobile-first Peruvian restaurant digital menu
- Features: category/dietary filters, weekend specials carousel, dish detail modals, favorites (localStorage)
- Menu data in: `artifacts/digital-menu/src/data/menuData.json`
- Components: `MenuCard`, `FilterBar`, `ItemModal`, `WeekendSpecials`
- Fonts: Playfair Display (serif headings) + Inter (sans body)
- Color palette: warm terracotta / cream / deep brown tones
