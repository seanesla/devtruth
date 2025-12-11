# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

/dev/truth is a KPI validation platform prototype for Tableau Hackathon 2025. It validates Tableau dashboard KPIs against semantic model definitions to detect metric drift. The app queries dashboards via VizQL Data Service and compares results to Semantic Model definitions.

## Commands

```bash
pnpm dev       # Start development server (port 3000)
pnpm build     # Build for production
pnpm lint      # Run ESLint
pnpm start     # Start production server
```

## Git Commits

Commit frequently—after each logical unit of work, not in large batches.

**Message format:**
- Type prefix: `feat:`, `fix:`, `refactor:`, `perf:`, `docs:`, `chore:`, `test:`
- Imperative mood, lowercase after prefix: `feat: add user authentication`
- First line ≤50 chars; body ≤72 chars/line if needed

**Examples:**
```
feat: add dashboard filter component
fix: resolve null pointer in test runner
refactor: extract validation logic to utility
perf: memoize expensive KPI calculations
```

## Architecture

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (new-york style)

**Path Aliases**: `@/*` maps to project root

### Directory Structure

- `app/` - Next.js App Router pages
  - `page.tsx` - Landing page with 3D scene background
  - `dashboard/` - Main application views (overview, test details, settings)
- `components/` - React components
  - `ui/` - shadcn/ui primitives
  - `dashboard/` - Dashboard-specific components
  - `scene/` - React Three Fiber 3D scene components (modular: `truth-core.tsx`, `ambient-particles.tsx`, `scroll-camera.tsx`, etc.)
  - Landing page sections: `hero-section.tsx`, `stats-section.tsx`, `how-it-works-section.tsx`, `features-section.tsx`, `cta-section.tsx`
- `lib/` - Shared utilities, context, types, and data
  - `utils.ts` - `cn()` utility for class merging
  - `types.ts` - Shared TypeScript interfaces (`TestStatus`, `TestSummary`, `TestDetail`)
  - `constants.ts` - App-wide constants (breakpoints, colors, animation timing)
  - `scene-context.tsx` - 3D scene mode state (landing/transitioning/dashboard)
  - `data/mock-tests.ts` - Single source of truth for test data

### 3D Scene System

The app uses React Three Fiber (`@react-three/fiber`, `@react-three/drei`) for an interactive 3D background:

- `SceneProvider` in `lib/scene-context.tsx` manages scene mode, scroll progress, and loading state
- `SceneBackground` component (`components/scene/index.tsx`) renders the persistent 3D canvas
- Scene modes: `"landing"` (scroll-reactive), `"transitioning"` (route change animation), `"dashboard"` (minimal particles)
- Scene components are modular in `components/scene/`: `TruthCore`, `AmbientParticles`, `ScrollCamera`, `SectionAccent`, `LoadingOverlay`
- Provider hierarchy in `components/providers.tsx`: ViewTransitions → SceneProvider → SceneBackground

### Data Flow

- Mock test data defined in `lib/data/mock-tests.ts` with helper functions (`getTestById`, `getTestDetailById`)
- Types in `lib/types.ts` define `TestSummary` (for lists) and `TestDetail` (for detail pages)
- Dashboard components import data directly from `lib/data/mock-tests.ts`

### Key Patterns

- React Server Components by default; client components marked with `"use client"`
- Dark mode only (hardcoded `className="dark"` on html element)
- Fonts: Instrument Sans (body), Instrument Serif (headings), Geist Mono (code)
- TypeScript build errors are ignored in `next.config.mjs` (prototype mode)
- Color palette: warm dark with amber accent (`#d4a574`), uses OKLCH color space in CSS variables
- View transitions via `next-view-transitions` for page navigation
- Framer Motion for logo and UI animations
- Lenis for smooth scrolling (configured in `lib/constants.ts`)

### Component Imports

```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSceneMode } from "@/lib/scene-context"
import { mockTests, getTestById } from "@/lib/data/mock-tests"
import type { TestSummary, TestStatus } from "@/lib/types"
```