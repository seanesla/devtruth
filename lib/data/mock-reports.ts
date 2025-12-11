import type { Report, ReportStats } from "../types"

// Mock generated reports
export const mockReports: Report[] = [
  {
    id: "report-001",
    name: "Weekly Compliance Summary",
    type: "compliance",
    generatedAt: "2 hours ago",
    period: "Dec 2-9, 2025",
    stats: {
      totalTests: 6,
      passing: 3,
      failing: 2,
      warnings: 1,
      avgVariance: "11.45%",
    },
  },
  {
    id: "report-002",
    name: "Drift Analysis Report",
    type: "drift",
    generatedAt: "1 day ago",
    period: "November 2025",
    stats: {
      totalTests: 6,
      passing: 4,
      failing: 1,
      warnings: 1,
      avgVariance: "8.72%",
    },
  },
  {
    id: "report-003",
    name: "Monthly Executive Summary",
    type: "summary",
    generatedAt: "3 days ago",
    period: "November 2025",
    stats: {
      totalTests: 6,
      passing: 5,
      failing: 1,
      warnings: 0,
      avgVariance: "3.21%",
    },
  },
  {
    id: "report-004",
    name: "Weekly Compliance Summary",
    type: "compliance",
    generatedAt: "1 week ago",
    period: "Nov 25 - Dec 1, 2025",
    stats: {
      totalTests: 6,
      passing: 4,
      failing: 1,
      warnings: 1,
      avgVariance: "6.89%",
    },
  },
  {
    id: "report-005",
    name: "Q4 Drift Analysis",
    type: "drift",
    generatedAt: "2 weeks ago",
    period: "Q4 2025",
    stats: {
      totalTests: 6,
      passing: 5,
      failing: 1,
      warnings: 0,
      avgVariance: "4.15%",
    },
  },
  {
    id: "report-006",
    name: "Quarterly Executive Summary",
    type: "summary",
    generatedAt: "1 month ago",
    period: "Q3 2025",
    stats: {
      totalTests: 6,
      passing: 6,
      failing: 0,
      warnings: 0,
      avgVariance: "0.87%",
    },
  },
]

// Report type display names
export const reportTypeLabels: Record<Report["type"], string> = {
  compliance: "Compliance Summary",
  drift: "Drift Analysis",
  summary: "Executive Summary",
}

// Helper functions
export function getReportById(id: string): Report | undefined {
  return mockReports.find((r) => r.id === id)
}

export function getReportsByType(type: Report["type"]): Report[] {
  return mockReports.filter((r) => r.type === type)
}

export function getLatestReport(): Report | undefined {
  return mockReports[0]
}

export function generateReportJSON(report: Report): string {
  return JSON.stringify(
    {
      metadata: {
        id: report.id,
        name: report.name,
        type: report.type,
        generatedAt: new Date().toISOString(),
        period: report.period,
      },
      summary: {
        totalTests: report.stats.totalTests,
        results: {
          passing: report.stats.passing,
          failing: report.stats.failing,
          warnings: report.stats.warnings,
        },
        passRate: `${((report.stats.passing / report.stats.totalTests) * 100).toFixed(1)}%`,
        averageVariance: report.stats.avgVariance,
      },
      // In a real implementation, this would include detailed test results
      tests: [],
    },
    null,
    2
  )
}
