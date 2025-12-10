import type { TestSummary, TestDetail, TestHistoryEntry } from "../types"

// Single source of truth for test summary data
export const mockTests: TestSummary[] = [
  {
    id: "1",
    name: "Monthly Revenue",
    source: "Looker",
    status: "pass",
    reported: "$2.4M",
    actual: "$2.4M",
    variance: "0.02%",
    lastRun: "2 min ago",
  },
  {
    id: "2",
    name: "Customer Churn Rate",
    source: "Tableau",
    status: "fail",
    reported: "4.2%",
    actual: "6.8%",
    variance: "38.1%",
    lastRun: "5 min ago",
  },
  {
    id: "3",
    name: "Active Users (DAU)",
    source: "Metabase",
    status: "pass",
    reported: "84.2K",
    actual: "84.1K",
    variance: "0.12%",
    lastRun: "8 min ago",
  },
  {
    id: "4",
    name: "Conversion Rate",
    source: "Looker",
    status: "warn",
    reported: "3.2%",
    actual: "3.06%",
    variance: "4.2%",
    lastRun: "12 min ago",
  },
  {
    id: "5",
    name: "Average Order Value",
    source: "Tableau",
    status: "pass",
    reported: "$127",
    actual: "$127",
    variance: "0.1%",
    lastRun: "15 min ago",
  },
  {
    id: "6",
    name: "Customer Lifetime Value",
    source: "Custom SQL",
    status: "fail",
    reported: "$2,847",
    actual: "$2,104",
    variance: "26.1%",
    lastRun: "18 min ago",
  },
]

// Single source of truth for test detail data
export const mockTestDetails: Record<string, TestDetail> = {
  "1": {
    name: "Monthly Revenue",
    status: "pass",
    source: "Looker",
    dashboardValue: "$2,412,847",
    calculatedValue: "$2,412,361",
    variance: "0.02%",
    confidence: "99.8%",
    lastRun: "2 minutes ago",
    query: "SELECT SUM(amount) FROM transactions WHERE date >= '2024-01-01'",
    history: [
      { time: "2 min ago", status: "pass", variance: "0.02%" },
      { time: "1 hour ago", status: "pass", variance: "0.01%" },
      { time: "2 hours ago", status: "pass", variance: "0.03%" },
      { time: "3 hours ago", status: "pass", variance: "0.02%" },
    ],
  },
  "2": {
    name: "Customer Churn Rate",
    status: "fail",
    source: "Tableau",
    dashboardValue: "4.2%",
    calculatedValue: "6.8%",
    variance: "38.1%",
    confidence: "99.9%",
    lastRun: "5 minutes ago",
    query: "SELECT COUNT(DISTINCT user_id) / total_users FROM churned_users",
    history: [
      { time: "5 min ago", status: "fail", variance: "38.1%" },
      { time: "1 hour ago", status: "fail", variance: "37.8%" },
      { time: "2 hours ago", status: "fail", variance: "38.2%" },
      { time: "3 hours ago", status: "pass", variance: "1.2%" },
    ],
  },
}

// Helper functions
export function getTestById(id: string): TestSummary | undefined {
  return mockTests.find((t) => t.id === id)
}

export function getTestDetailById(id: string): TestDetail {
  return mockTestDetails[id] || mockTestDetails["1"]
}
