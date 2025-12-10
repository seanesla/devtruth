# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

/dev/truth is a KPI validation platform prototype for Tableau Hackathon 2025. It validates Tableau dashboard KPIs against semantic model definitions to detect metric drift.

## Commands

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm lint      # Run ESLint
pnpm start     # Start production server
```

## Architecture

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (new-york style)

**Path Aliases**: `@/*` maps to project root (configured in tsconfig.json)

### Directory Structure

- `app/` - Next.js App Router pages
  - `page.tsx` - Landing page with 3D scene background
  - `dashboard/` - Main application views (overview, test details, settings)
- `components/` - React components
  - `ui/` - shadcn/ui primitives
  - `dashboard/` - Dashboard-specific components
- `lib/utils.ts` - `cn()` utility for class merging
- `hooks/` - Custom React hooks (use-mobile, use-toast)

### Key Patterns

- Uses React Server Components by default; client components marked with `"use client"`
- Dark mode only (hardcoded `className="dark"` on html element)
- Fonts: Instrument Sans (body), Instrument Serif (headings), Geist Mono (code)
- TypeScript build errors are ignored in `next.config.mjs` (prototype mode)

### Component Imports

```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```
