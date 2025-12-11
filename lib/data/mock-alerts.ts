import type { Alert } from "../types"

// Mock alerts triggered by test failures and drift detection
export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    testId: "2",
    testName: "Customer Churn Rate",
    type: "drift",
    severity: "high",
    message: "Churn rate deviated by 38.1% from semantic definition. Dashboard shows 4.2% but ground truth is 6.8%.",
    triggeredAt: "5 minutes ago",
    acknowledged: false,
  },
  {
    id: "alert-002",
    testId: "6",
    testName: "Customer Lifetime Value",
    type: "drift",
    severity: "high",
    message: "CLV deviated by 26.1% from semantic definition. Dashboard calculation uses hardcoded 24 months instead of actual customer lifespan.",
    triggeredAt: "18 minutes ago",
    acknowledged: false,
  },
  {
    id: "alert-003",
    testId: "4",
    testName: "Conversion Rate",
    type: "threshold",
    severity: "medium",
    message: "Conversion rate variance (4.37%) exceeded tolerance threshold (3%). Test marked as warning.",
    triggeredAt: "12 minutes ago",
    acknowledged: false,
  },
  {
    id: "alert-004",
    testId: "2",
    testName: "Customer Churn Rate",
    type: "failure",
    severity: "high",
    message: "Test has been failing consistently for 3 hours. Possible filter mismatch: dashboard missing DISTINCT count on customer IDs.",
    triggeredAt: "3 hours ago",
    acknowledged: true,
  },
  {
    id: "alert-005",
    testId: "1",
    testName: "Monthly Revenue",
    type: "threshold",
    severity: "low",
    message: "Revenue variance approaching tolerance threshold. Current: 0.8%, Threshold: 1%.",
    triggeredAt: "1 day ago",
    acknowledged: true,
  },
  {
    id: "alert-006",
    testId: "6",
    testName: "Customer Lifetime Value",
    type: "failure",
    severity: "high",
    message: "CLV test has failed 12 consecutive runs. Dashboard calculation formula differs significantly from semantic model definition.",
    triggeredAt: "2 days ago",
    acknowledged: true,
  },
  {
    id: "alert-007",
    testId: "3",
    testName: "Daily Active Users",
    type: "drift",
    severity: "medium",
    message: "DAU showed unexpected spike of 15% variance. Resolved after data refresh.",
    triggeredAt: "3 days ago",
    acknowledged: true,
  },
  {
    id: "alert-008",
    testId: "5",
    testName: "Average Order Value",
    type: "threshold",
    severity: "low",
    message: "AOV variance increased from 0.05% to 0.10%. Still within tolerance but trending upward.",
    triggeredAt: "5 days ago",
    acknowledged: true,
  },
]

// Helper functions
export function getAlertById(id: string): Alert | undefined {
  return mockAlerts.find((a) => a.id === id)
}

export function getAlertsByTestId(testId: string): Alert[] {
  return mockAlerts.filter((a) => a.testId === testId)
}

export function getUnacknowledgedAlerts(): Alert[] {
  return mockAlerts.filter((a) => !a.acknowledged)
}

export function getAlertsBySeverity(severity: Alert["severity"]): Alert[] {
  return mockAlerts.filter((a) => a.severity === severity)
}

export function getAlertsByType(type: Alert["type"]): Alert[] {
  return mockAlerts.filter((a) => a.type === type)
}

export function getAlertStats() {
  const unacknowledged = getUnacknowledgedAlerts()
  return {
    total: mockAlerts.length,
    unacknowledged: unacknowledged.length,
    high: unacknowledged.filter((a) => a.severity === "high").length,
    medium: unacknowledged.filter((a) => a.severity === "medium").length,
    low: unacknowledged.filter((a) => a.severity === "low").length,
  }
}
