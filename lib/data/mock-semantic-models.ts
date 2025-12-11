import type { SemanticModel, MetricDefinition } from "../types"

// Mock Tableau Next Semantic Models with metric definitions
export const mockSemanticModels: SemanticModel[] = [
  {
    id: "sm-finance-001",
    name: "Finance Analytics",
    description: "Core financial metrics including revenue, profit, and cost analysis",
    dataSource: "ds-luid-finance-transactions",
    metrics: [
      {
        id: "metric-revenue",
        name: "Total Revenue",
        description: "Sum of all transaction amounts excluding refunds",
        calculation: "SUM([Amount]) - SUM([Refunds])",
        timeDimension: "Transaction Date",
        granularity: "month",
        tolerance: 0.01, // 1% tolerance
        filters: [
          {
            field: "Transaction Status",
            filterType: "SET",
            values: ["Completed", "Settled"],
          },
        ],
      },
      {
        id: "metric-net-revenue",
        name: "Net Revenue",
        description: "Revenue minus discounts and promotional credits",
        calculation: "SUM([Amount]) - SUM([Refunds]) - SUM([Discounts])",
        timeDimension: "Transaction Date",
        granularity: "month",
        tolerance: 0.02,
      },
      {
        id: "metric-mrr",
        name: "Monthly Recurring Revenue",
        description: "Recurring subscription revenue normalized to monthly",
        calculation: "SUM([Subscription Amount] * [Billing Frequency Multiplier])",
        timeDimension: "Billing Date",
        granularity: "month",
        tolerance: 0.005,
        filters: [
          {
            field: "Subscription Status",
            filterType: "SET",
            values: ["Active"],
          },
        ],
      },
      {
        id: "metric-aov",
        name: "Average Order Value",
        description: "Average transaction amount per order",
        calculation: "SUM([Amount]) / COUNTD([Order ID])",
        timeDimension: "Order Date",
        granularity: "month",
        tolerance: 0.02,
      },
    ],
  },
  {
    id: "sm-customer-001",
    name: "Customer Health",
    description: "Customer lifecycle and retention metrics",
    dataSource: "ds-luid-customer-data",
    metrics: [
      {
        id: "metric-churn",
        name: "Customer Churn Rate",
        description: "Percentage of customers who cancelled in the period",
        calculation: "COUNTD([Churned Customer ID]) / COUNTD([Active Customer ID at Period Start])",
        timeDimension: "Churn Date",
        granularity: "month",
        tolerance: 0.05, // 5% tolerance for churn
        filters: [
          {
            field: "Customer Type",
            filterType: "SET",
            values: ["Paid", "Enterprise"],
          },
        ],
      },
      {
        id: "metric-clv",
        name: "Customer Lifetime Value",
        description: "Predicted total revenue from a customer relationship",
        calculation: "AVG([Total Customer Revenue]) * AVG([Customer Lifespan Months])",
        timeDimension: "Cohort Date",
        granularity: "quarter",
        tolerance: 0.1, // 10% tolerance for CLV estimates
      },
      {
        id: "metric-nps",
        name: "Net Promoter Score",
        description: "Customer satisfaction metric from -100 to 100",
        calculation: "(COUNTD([Promoter ID]) - COUNTD([Detractor ID])) / COUNTD([Survey Response ID]) * 100",
        timeDimension: "Survey Date",
        granularity: "quarter",
        tolerance: 0.05,
      },
    ],
  },
  {
    id: "sm-product-001",
    name: "Product Analytics",
    description: "User engagement and product performance metrics",
    dataSource: "ds-luid-product-events",
    metrics: [
      {
        id: "metric-dau",
        name: "Daily Active Users",
        description: "Unique users with at least one session per day",
        calculation: "COUNTD([User ID])",
        timeDimension: "Event Date",
        granularity: "day",
        tolerance: 0.005,
        filters: [
          {
            field: "Event Type",
            filterType: "SET",
            values: ["session_start", "page_view", "feature_use"],
          },
        ],
      },
      {
        id: "metric-conversion",
        name: "Conversion Rate",
        description: "Percentage of visitors who complete a purchase",
        calculation: "COUNTD([Converted User ID]) / COUNTD([Visitor ID])",
        timeDimension: "Visit Date",
        granularity: "day",
        tolerance: 0.03,
        filters: [
          {
            field: "Traffic Source",
            filterType: "SET",
            values: ["Organic", "Paid", "Direct", "Referral"],
          },
        ],
      },
      {
        id: "metric-session-duration",
        name: "Average Session Duration",
        description: "Mean time spent per user session in minutes",
        calculation: "AVG([Session Duration Seconds]) / 60",
        timeDimension: "Session Date",
        granularity: "day",
        tolerance: 0.1,
      },
    ],
  },
  {
    id: "sm-sales-001",
    name: "Sales Performance",
    description: "Sales pipeline and deal metrics",
    dataSource: "ds-luid-crm-data",
    metrics: [
      {
        id: "metric-pipeline",
        name: "Pipeline Value",
        description: "Total value of open opportunities",
        calculation: "SUM([Opportunity Amount])",
        timeDimension: "Created Date",
        granularity: "month",
        tolerance: 0.02,
        filters: [
          {
            field: "Stage",
            filterType: "SET",
            values: ["Qualification", "Proposal", "Negotiation"],
          },
        ],
      },
      {
        id: "metric-win-rate",
        name: "Win Rate",
        description: "Percentage of opportunities closed won",
        calculation: "COUNTD([Won Opportunity ID]) / COUNTD([Closed Opportunity ID])",
        timeDimension: "Close Date",
        granularity: "month",
        tolerance: 0.05,
      },
      {
        id: "metric-deal-size",
        name: "Average Deal Size",
        description: "Mean value of closed won opportunities",
        calculation: "AVG([Won Opportunity Amount])",
        timeDimension: "Close Date",
        granularity: "month",
        tolerance: 0.05,
      },
    ],
  },
]

// Helper functions
export function getSemanticModelById(id: string): SemanticModel | undefined {
  return mockSemanticModels.find((sm) => sm.id === id)
}

export function getMetricById(modelId: string, metricId: string): MetricDefinition | undefined {
  const model = getSemanticModelById(modelId)
  return model?.metrics.find((m) => m.id === metricId)
}

export function getAllMetrics(): Array<MetricDefinition & { modelId: string; modelName: string }> {
  return mockSemanticModels.flatMap((model) =>
    model.metrics.map((metric) => ({
      ...metric,
      modelId: model.id,
      modelName: model.name,
    }))
  )
}
