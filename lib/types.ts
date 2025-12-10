// Standardized test status type
export type TestStatus = "pass" | "fail" | "warn"

// Test history entry for timeline tracking
export interface TestHistoryEntry {
  time: string
  status: "pass" | "fail"
  variance: string
}

// Base test interface with shared fields
export interface TestBase {
  id: string
  name: string
  source: string
  status: TestStatus
  variance: string
  lastRun: string
}

// Test summary for list views (dashboard overview, tests list)
export interface TestSummary extends TestBase {
  reported: string
  actual: string
}

// Full test detail for individual test pages
export interface TestDetail {
  name: string
  status: "pass" | "fail"
  source: string
  dashboardValue: string
  calculatedValue: string
  variance: string
  confidence: string
  lastRun: string
  query: string
  history: TestHistoryEntry[]
}

// Re-export SceneMode for convenience
export type { SceneMode } from "./scene-context"
