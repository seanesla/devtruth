import type { Workbook, WorkbookView } from "../types"

// Mock Tableau Cloud Workbooks and Views
export const mockWorkbooks: Workbook[] = [
  {
    id: "wb-exec-dashboard",
    name: "Executive Dashboard",
    project: "Leadership Reports",
    site: "acme-corp",
    views: [
      {
        id: "view-revenue-overview",
        name: "Revenue Overview",
        displayedMetrics: [
          {
            fieldCaption: "Total Revenue",
            dashboardCalculation: "SUM([Amount])", // Missing refund exclusion!
          },
          {
            fieldCaption: "MRR",
            dashboardCalculation: "SUM([Subscription Amount])",
          },
        ],
      },
      {
        id: "view-kpi-summary",
        name: "KPI Summary",
        displayedMetrics: [
          {
            fieldCaption: "Revenue",
          },
          {
            fieldCaption: "Active Users",
          },
          {
            fieldCaption: "Churn Rate",
          },
        ],
      },
    ],
  },
  {
    id: "wb-finance-reports",
    name: "Finance Reports",
    project: "Finance",
    site: "acme-corp",
    views: [
      {
        id: "view-monthly-revenue",
        name: "Monthly Revenue Trends",
        displayedMetrics: [
          {
            fieldCaption: "Monthly Revenue",
            dashboardCalculation: "SUM([Amount]) - SUM([Refunds])",
          },
          {
            fieldCaption: "Net Revenue",
            dashboardCalculation: "SUM([Amount]) - SUM([Refunds]) - SUM([Discounts])",
          },
        ],
      },
      {
        id: "view-aov-analysis",
        name: "AOV Analysis",
        displayedMetrics: [
          {
            fieldCaption: "Average Order Value",
            dashboardCalculation: "AVG([Order Total])", // Using AVG instead of SUM/COUNT!
          },
        ],
      },
    ],
  },
  {
    id: "wb-customer-health",
    name: "Customer Health Dashboard",
    project: "Customer Success",
    site: "acme-corp",
    views: [
      {
        id: "view-churn-analysis",
        name: "Churn Analysis",
        displayedMetrics: [
          {
            fieldCaption: "Churn Rate",
            dashboardCalculation: "COUNT([Churned Customers]) / COUNT([Total Customers])", // Missing DISTINCT!
          },
          {
            fieldCaption: "At-Risk Customers",
          },
        ],
      },
      {
        id: "view-clv-report",
        name: "Customer Lifetime Value",
        displayedMetrics: [
          {
            fieldCaption: "CLV",
            dashboardCalculation: "AVG([Total Revenue]) * 24", // Hardcoded months instead of actual lifespan!
          },
        ],
      },
      {
        id: "view-nps-tracker",
        name: "NPS Tracker",
        displayedMetrics: [
          {
            fieldCaption: "Net Promoter Score",
          },
        ],
      },
    ],
  },
  {
    id: "wb-product-analytics",
    name: "Product Analytics",
    project: "Product",
    site: "acme-corp",
    views: [
      {
        id: "view-user-engagement",
        name: "User Engagement",
        displayedMetrics: [
          {
            fieldCaption: "DAU",
            dashboardCalculation: "COUNTD([User ID])",
          },
          {
            fieldCaption: "Session Duration",
            dashboardCalculation: "AVG([Duration]) / 60",
          },
        ],
      },
      {
        id: "view-conversion-funnel",
        name: "Conversion Funnel",
        displayedMetrics: [
          {
            fieldCaption: "Conversion Rate",
            dashboardCalculation: "COUNTD([Purchaser ID]) / COUNTD([Visitor ID])",
          },
        ],
      },
    ],
  },
  {
    id: "wb-sales-pipeline",
    name: "Sales Pipeline",
    project: "Sales",
    site: "acme-corp",
    views: [
      {
        id: "view-pipeline-overview",
        name: "Pipeline Overview",
        displayedMetrics: [
          {
            fieldCaption: "Pipeline Value",
            dashboardCalculation: "SUM([Amount])", // Not filtering by stage!
          },
          {
            fieldCaption: "Win Rate",
          },
        ],
      },
      {
        id: "view-deal-analysis",
        name: "Deal Analysis",
        displayedMetrics: [
          {
            fieldCaption: "Average Deal Size",
            dashboardCalculation: "AVG([Deal Amount])",
          },
        ],
      },
    ],
  },
  {
    id: "wb-ops-metrics",
    name: "Operations Metrics",
    project: "Operations",
    site: "acme-corp",
    views: [
      {
        id: "view-regional-performance",
        name: "Regional Performance",
        displayedMetrics: [
          {
            fieldCaption: "Regional Revenue",
          },
          {
            fieldCaption: "Regional DAU",
          },
        ],
      },
    ],
  },
]

// Helper functions
export function getWorkbookById(id: string): Workbook | undefined {
  return mockWorkbooks.find((wb) => wb.id === id)
}

export function getViewById(workbookId: string, viewId: string): WorkbookView | undefined {
  const workbook = getWorkbookById(workbookId)
  return workbook?.views.find((v) => v.id === viewId)
}

export function getAllViews(): Array<WorkbookView & { workbookId: string; workbookName: string; project: string }> {
  return mockWorkbooks.flatMap((wb) =>
    wb.views.map((view) => ({
      ...view,
      workbookId: wb.id,
      workbookName: wb.name,
      project: wb.project,
    }))
  )
}
