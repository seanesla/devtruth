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

**Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (new-york style) + Recharts

**Path Aliases**: `@/*` maps to project root

### Directory Structure

- `app/` - Next.js App Router pages
  - `page.tsx` - Landing page with 3D scene background
  - `dashboard/page.tsx` - Overview with charts (PieChart, AreaChart, RadialBarChart, BarChart)
  - `dashboard/tests/page.tsx` - Tests list with filtering
  - `dashboard/tests/[id]/page.tsx` - Individual test detail view
  - `dashboard/alerts/page.tsx` - Alerts management
  - `dashboard/reports/page.tsx` - Reports generation and history
  - `dashboard/settings/page.tsx` - Application settings
- `components/` - React components
  - `ui/` - shadcn/ui primitives + custom (`status-indicator.tsx`, `spinner.tsx`, `empty.tsx`)
  - `dashboard/layout/` - Sidebar, dashboard-header, dashboard-stats, dashboard-selector
  - `dashboard/tests/` - Tests list, test-detail, test-filters, create-test-wizard, kpi-browser, test-config-form
  - `dashboard/alerts/` - Alerts-content, alert-card
  - `dashboard/reports/` - Reports-content, report-card, generate-report-modal
  - `scene/` - React Three Fiber 3D scene: `truth-core.tsx`, `ambient-particles.tsx`, `scroll-camera.tsx`, `section-accent.tsx`, `loading-overlay.tsx`, `scene-canvas.tsx`, `fallback.tsx`
  - `persistent-navbar.tsx` - Morphing navbar (landing links ↔ dashboard links)
  - `liquid-glass-navbar.tsx` - Glassmorphism navbar wrapper
  - Landing sections: `hero-section.tsx`, `stats-section.tsx`, `how-it-works-section.tsx`, `features-section.tsx`, `cta-section.tsx`
- `lib/` - Shared utilities, context, types, and data
  - `utils.ts` - `cn()` utility for class merging
  - `types.ts` - All TypeScript interfaces (see Types section)
  - `constants.ts` - Breakpoints, scene colors, animation timing, Lenis scroll config
  - `scene-context.tsx` - 3D scene mode state (landing/transitioning/dashboard)
  - `navbar-context.tsx` - Navbar mode (landing/dashboard), active section tracking
  - `data/` - Mock data files with helper functions:
    - `mock-tests.ts` - Test summaries and details with VizQL queries
    - `mock-alerts.ts` - Alert data (drift, failure, threshold types)
    - `mock-reports.ts` - Report history (compliance, drift, summary types)
    - `mock-semantic-models.ts` - Tableau Next semantic model/metric definitions
    - `mock-workbooks.ts` - Tableau Cloud workbook/view structures

### Types (`lib/types.ts`)

- **Test types**: `TestStatus`, `TestSummary`, `TestDetail`, `TestHistoryEntry`
- **VizQL types**: `VizQLQuery`, `VizQLField`, `VizQLFilter`
- **Semantic Model types**: `SemanticModel`, `MetricDefinition`, `MetricFilter`
- **Dashboard types**: `Workbook`, `WorkbookView`, `DisplayedMetric`
- **Alert types**: `Alert`, `AlertType` (drift/failure/threshold), `AlertSeverity` (high/medium/low)
- **Report types**: `Report`, `ReportType` (compliance/drift/summary), `ReportStats`

### 3D Scene System

The app uses React Three Fiber (`@react-three/fiber`, `@react-three/drei`) for an interactive 3D background:

- `SceneProvider` in `lib/scene-context.tsx` manages scene mode, scroll progress, and loading state
- `NavbarProvider` in `lib/navbar-context.tsx` manages navbar mode and active route/section
- `SceneBackground` component (`components/scene/index.tsx`) renders the persistent 3D canvas
- Scene modes: `"landing"` (scroll-reactive), `"transitioning"` (route change animation), `"dashboard"` (minimal particles)
- Scene components in `components/scene/`: `TruthCore`, `AmbientParticles`, `ScrollCamera`, `SectionAccent`, `LoadingOverlay`
- Provider hierarchy in `components/providers.tsx`: ViewTransitions → SceneProvider → NavbarProvider → SceneBackground + PersistentNavbar

### Data Flow

- Mock data files in `lib/data/` with helper functions (e.g., `getTestById`, `getAlertsByTestId`, `getAllMetrics`)
- Types in `lib/types.ts` define all data structures
- Dashboard components import data directly from mock data files
- Recharts used for dashboard visualizations (PieChart, AreaChart, BarChart, RadialBarChart)

### Key Patterns

- React Server Components by default; client components marked with `"use client"`
- Dark mode only (hardcoded `className="dark"` on html element)
- Fonts: Instrument Sans (body), Instrument Serif (headings), Geist Mono (code)
- TypeScript build errors ignored in `next.config.mjs` (prototype mode)
- Color palette: warm dark with amber accent (`#d4a574`), uses OKLCH color space in CSS variables
- Status colors: success green (`#22c55e`), destructive red (`#ef4444`), accent amber (`#d4a574`)
- View transitions via `next-view-transitions` for page navigation
- Framer Motion for animations (navbar morphing, scroll reveals)
- Lenis for smooth scrolling (configured in `lib/constants.ts`)
- Intersection Observer for scroll-triggered animations

### Component Imports

```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSceneMode } from "@/lib/scene-context"
import { useNavbar } from "@/lib/navbar-context"
import { mockTests, getTestById, getTestStats } from "@/lib/data/mock-tests"
import { mockAlerts, getUnacknowledgedAlerts } from "@/lib/data/mock-alerts"
import { mockReports, getReportsByType } from "@/lib/data/mock-reports"
import { mockSemanticModels, getAllMetrics } from "@/lib/data/mock-semantic-models"
import { mockWorkbooks, getAllViews } from "@/lib/data/mock-workbooks"
import type { TestSummary, TestDetail, Alert, Report, SemanticModel } from "@/lib/types"
```