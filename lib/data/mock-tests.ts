import type { TestSummary, TestDetail, TestHistoryEntry } from "../types"

// Single source of truth for test summary data
export const mockTests: TestSummary[] = [
  {
    id: "1",
    name: "Monthly Revenue",
    source: "Tableau",
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
    name: "Daily Active Users",
    source: "Tableau",
    status: "pass",
    reported: "84.2K",
    actual: "84.1K",
    variance: "0.12%",
    lastRun: "8 min ago",
  },
  {
    id: "4",
    name: "Conversion Rate",
    source: "Tableau",
    status: "warn",
    reported: "3.2%",
    actual: "3.06%",
    variance: "4.37%",
    lastRun: "12 min ago",
  },
  {
    id: "5",
    name: "Average Order Value",
    source: "Tableau",
    status: "pass",
    reported: "$127",
    actual: "$126.87",
    variance: "0.10%",
    lastRun: "15 min ago",
  },
  {
    id: "6",
    name: "Customer Lifetime Value",
    source: "Tableau",
    status: "fail",
    reported: "$2,847",
    actual: "$2,104",
    variance: "26.1%",
    lastRun: "18 min ago",
  },
]

// Complete test detail data with VizQL queries
export const mockTestDetails: Record<string, TestDetail> = {
  "1": {
    id: "1",
    name: "Monthly Revenue",
    status: "pass",
    semanticModelId: "sm-finance-001",
    metricId: "metric-revenue",
    workbookId: "wb-finance-reports",
    viewId: "view-monthly-revenue",
    source: "Tableau",
    dashboardValue: "$2,412,847",
    groundTruthValue: "$2,412,361",
    variance: "0.02%",
    variancePercent: 0.0002,
    tolerance: 0.01,
    confidence: "99.8%",
    lastRun: "2 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-finance-transactions",
      fields: [
        {
          fieldCaption: "Revenue",
          calculation: "SUM([Amount]) - SUM([Refunds])",
        },
      ],
      filters: [
        {
          fieldCaption: "Transaction Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-12-01",
          max: "2024-12-31",
        },
        {
          fieldCaption: "Transaction Status",
          filterType: "SET",
          values: ["Completed", "Settled"],
        },
      ],
    },
    history: [
      { time: "2 min ago", status: "pass", variance: "0.02%" },
      { time: "1 hour ago", status: "pass", variance: "0.01%" },
      { time: "2 hours ago", status: "pass", variance: "0.03%" },
      { time: "3 hours ago", status: "pass", variance: "0.02%" },
    ],
  },
  "2": {
    id: "2",
    name: "Customer Churn Rate",
    status: "fail",
    semanticModelId: "sm-customer-001",
    metricId: "metric-churn",
    workbookId: "wb-customer-health",
    viewId: "view-churn-analysis",
    source: "Tableau",
    dashboardValue: "4.2%",
    groundTruthValue: "6.8%",
    variance: "38.1%",
    variancePercent: 0.381,
    tolerance: 0.05,
    confidence: "99.9%",
    lastRun: "5 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-customer-data",
      fields: [
        {
          fieldCaption: "Churn Rate",
          calculation: "COUNTD([Churned Customer ID]) / COUNTD([Active Customer ID at Period Start])",
        },
      ],
      filters: [
        {
          fieldCaption: "Churn Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-12-01",
          max: "2024-12-31",
        },
        {
          fieldCaption: "Customer Type",
          filterType: "SET",
          values: ["Paid", "Enterprise"],
        },
      ],
    },
    history: [
      { time: "5 min ago", status: "fail", variance: "38.1%" },
      { time: "1 hour ago", status: "fail", variance: "37.8%" },
      { time: "2 hours ago", status: "fail", variance: "38.2%" },
      { time: "3 hours ago", status: "pass", variance: "1.2%" },
    ],
  },
  "3": {
    id: "3",
    name: "Daily Active Users",
    status: "pass",
    semanticModelId: "sm-product-001",
    metricId: "metric-dau",
    workbookId: "wb-product-analytics",
    viewId: "view-user-engagement",
    source: "Tableau",
    dashboardValue: "84,247",
    groundTruthValue: "84,145",
    variance: "0.12%",
    variancePercent: 0.0012,
    tolerance: 0.005,
    confidence: "99.5%",
    lastRun: "8 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-product-events",
      fields: [
        {
          fieldCaption: "DAU",
          function: "COUNTD",
        },
      ],
      filters: [
        {
          fieldCaption: "Event Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-12-09",
          max: "2024-12-09",
        },
        {
          fieldCaption: "Event Type",
          filterType: "SET",
          values: ["session_start", "page_view", "feature_use"],
        },
      ],
    },
    history: [
      { time: "8 min ago", status: "pass", variance: "0.12%" },
      { time: "1 hour ago", status: "pass", variance: "0.08%" },
      { time: "2 hours ago", status: "pass", variance: "0.15%" },
      { time: "3 hours ago", status: "pass", variance: "0.11%" },
    ],
  },
  "4": {
    id: "4",
    name: "Conversion Rate",
    status: "fail",
    semanticModelId: "sm-product-001",
    metricId: "metric-conversion",
    workbookId: "wb-product-analytics",
    viewId: "view-conversion-funnel",
    source: "Tableau",
    dashboardValue: "3.20%",
    groundTruthValue: "3.06%",
    variance: "4.37%",
    variancePercent: 0.0437,
    tolerance: 0.03,
    confidence: "98.2%",
    lastRun: "12 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-product-events",
      fields: [
        {
          fieldCaption: "Conversion Rate",
          calculation: "COUNTD([Converted User ID]) / COUNTD([Visitor ID])",
        },
      ],
      filters: [
        {
          fieldCaption: "Visit Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-12-01",
          max: "2024-12-09",
        },
        {
          fieldCaption: "Traffic Source",
          filterType: "SET",
          values: ["Organic", "Paid", "Direct", "Referral"],
        },
      ],
    },
    history: [
      { time: "12 min ago", status: "fail", variance: "4.37%" },
      { time: "1 hour ago", status: "fail", variance: "4.21%" },
      { time: "2 hours ago", status: "pass", variance: "2.89%" },
      { time: "3 hours ago", status: "pass", variance: "2.15%" },
    ],
  },
  "5": {
    id: "5",
    name: "Average Order Value",
    status: "pass",
    semanticModelId: "sm-finance-001",
    metricId: "metric-aov",
    workbookId: "wb-finance-reports",
    viewId: "view-aov-analysis",
    source: "Tableau",
    dashboardValue: "$127.00",
    groundTruthValue: "$126.87",
    variance: "0.10%",
    variancePercent: 0.001,
    tolerance: 0.02,
    confidence: "99.7%",
    lastRun: "15 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-finance-transactions",
      fields: [
        {
          fieldCaption: "AOV",
          calculation: "SUM([Amount]) / COUNTD([Order ID])",
        },
      ],
      filters: [
        {
          fieldCaption: "Order Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-12-01",
          max: "2024-12-09",
        },
      ],
    },
    history: [
      { time: "15 min ago", status: "pass", variance: "0.10%" },
      { time: "1 hour ago", status: "pass", variance: "0.12%" },
      { time: "2 hours ago", status: "pass", variance: "0.08%" },
      { time: "3 hours ago", status: "pass", variance: "0.11%" },
    ],
  },
  "6": {
    id: "6",
    name: "Customer Lifetime Value",
    status: "fail",
    semanticModelId: "sm-customer-001",
    metricId: "metric-clv",
    workbookId: "wb-customer-health",
    viewId: "view-clv-report",
    source: "Tableau",
    dashboardValue: "$2,847",
    groundTruthValue: "$2,104",
    variance: "26.1%",
    variancePercent: 0.261,
    tolerance: 0.1,
    confidence: "99.4%",
    lastRun: "18 minutes ago",
    vizqlQuery: {
      datasourceLuid: "ds-luid-customer-data",
      fields: [
        {
          fieldCaption: "CLV",
          calculation: "AVG([Total Customer Revenue]) * AVG([Customer Lifespan Months])",
        },
      ],
      filters: [
        {
          fieldCaption: "Cohort Date",
          filterType: "QUANTITATIVE_DATE",
          min: "2024-01-01",
          max: "2024-12-09",
        },
      ],
    },
    history: [
      { time: "18 min ago", status: "fail", variance: "26.1%" },
      { time: "1 hour ago", status: "fail", variance: "25.8%" },
      { time: "2 hours ago", status: "fail", variance: "26.3%" },
      { time: "3 hours ago", status: "fail", variance: "25.9%" },
    ],
  },
}

// Helper functions
export function getTestById(id: string): TestSummary | undefined {
  return mockTests.find((t) => t.id === id)
}

export function getTestDetailById(id: string): TestDetail | undefined {
  return mockTestDetails[id]
}

export function getTestsByStatus(status: TestSummary["status"]): TestSummary[] {
  return mockTests.filter((t) => t.status === status)
}

export function getTestStats() {
  return {
    total: mockTests.length,
    passing: mockTests.filter((t) => t.status === "pass").length,
    failing: mockTests.filter((t) => t.status === "fail").length,
    warnings: mockTests.filter((t) => t.status === "warn").length,
  }
}
