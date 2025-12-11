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
  id: string
  name: string
  status: "pass" | "fail"
  // Source references
  semanticModelId: string
  metricId: string
  workbookId: string
  viewId: string
  source: string // Display name (e.g., "Tableau")
  // Comparison values
  dashboardValue: string // What the dashboard shows
  groundTruthValue: string // What VizQL Data Service returns
  variance: string
  variancePercent: number
  tolerance: number // From metric definition
  confidence: string
  lastRun: string
  // VizQL query used to get ground truth
  vizqlQuery: VizQLQuery
  history: TestHistoryEntry[]
}

// VizQL Data Service query structure
export interface VizQLQuery {
  datasourceLuid: string
  fields: VizQLField[]
  filters?: VizQLFilter[]
}

export interface VizQLField {
  fieldCaption: string
  function?: "SUM" | "AVG" | "COUNT" | "COUNTD" | "MIN" | "MAX" | "MEDIAN"
  calculation?: string // Custom calculation
}

export interface VizQLFilter {
  fieldCaption: string
  filterType: "SET" | "QUANTITATIVE_NUMERICAL" | "QUANTITATIVE_DATE" | "DATE" | "TOP" | "MATCH"
  values?: string[]
  min?: number | string
  max?: number | string
}

// ============================================
// Semantic Model / KPI Types (Tableau Next)
// ============================================

export interface SemanticModel {
  id: string
  name: string
  description: string
  dataSource: string // Published data source LUID
  metrics: MetricDefinition[]
}

// Metric = KPI definition in Tableau Next Semantic Model
export interface MetricDefinition {
  id: string
  name: string
  description: string
  // VizQL-style calculation
  calculation: string // e.g., "SUM([Sales])" or "SUM([Profit])/SUM([Sales])"
  // Time dimension for tracking
  timeDimension: string // e.g., "Order Date"
  granularity: "day" | "week" | "month" | "quarter" | "year"
  // Validation rules
  tolerance: number // Acceptable variance % (e.g., 0.05 = 5%)
  filters?: MetricFilter[]
}

export interface MetricFilter {
  field: string
  filterType: "SET" | "QUANTITATIVE" | "DATE" | "TOP"
  values?: string[]
  min?: number
  max?: number
}

// ============================================
// Dashboard Types (Tableau Cloud)
// ============================================

export interface Workbook {
  id: string
  name: string
  project: string
  site: string
  views: WorkbookView[]
}

export interface WorkbookView {
  id: string
  name: string
  // Metrics displayed in this view that can be validated
  displayedMetrics: DisplayedMetric[]
}

export interface DisplayedMetric {
  fieldCaption: string // How it appears in the view
  // How it's calculated in the dashboard (may differ from semantic definition)
  dashboardCalculation?: string
}

// ============================================
// Alert Types
// ============================================

export type AlertType = "drift" | "failure" | "threshold"
export type AlertSeverity = "high" | "medium" | "low"

export interface Alert {
  id: string
  testId: string
  testName: string
  type: AlertType
  severity: AlertSeverity
  message: string
  triggeredAt: string
  acknowledged: boolean
}

// ============================================
// Report Types
// ============================================

export type ReportType = "compliance" | "drift" | "summary"

export interface ReportStats {
  totalTests: number
  passing: number
  failing: number
  warnings: number
  avgVariance: string
}

export interface Report {
  id: string
  name: string
  type: ReportType
  generatedAt: string
  period: string
  stats: ReportStats
}

// Re-export SceneMode for convenience
export type { SceneMode } from "./scene-context"
