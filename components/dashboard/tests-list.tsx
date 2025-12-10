import Link from "next/link"
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react"

const tests = [
  {
    id: "1",
    name: "Monthly Revenue",
    source: "Looker",
    status: "pass",
    lastRun: "2 min ago",
    variance: "0.02%",
  },
  {
    id: "2",
    name: "Customer Churn Rate",
    source: "Tableau",
    status: "fail",
    lastRun: "5 min ago",
    variance: "38.1%",
  },
  {
    id: "3",
    name: "Active Users (DAU)",
    source: "Metabase",
    status: "pass",
    lastRun: "8 min ago",
    variance: "0.5%",
  },
  {
    id: "4",
    name: "Conversion Rate",
    source: "Looker",
    status: "warning",
    lastRun: "12 min ago",
    variance: "4.2%",
  },
  {
    id: "5",
    name: "Average Order Value",
    source: "Tableau",
    status: "pass",
    lastRun: "15 min ago",
    variance: "0.1%",
  },
  {
    id: "6",
    name: "Customer Lifetime Value",
    source: "Custom SQL",
    status: "pass",
    lastRun: "18 min ago",
    variance: "0.8%",
  },
]

const statusConfig = {
  pass: { icon: CheckCircle2, class: "text-success", bg: "bg-success/10" },
  fail: { icon: XCircle, class: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertTriangle, class: "text-chart-3", bg: "bg-chart-3/10" },
}

export function TestsList() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-semibold">Recent Tests</h2>
        <Link href="/dashboard/tests" className="text-sm text-accent hover:underline">
          View all
        </Link>
      </div>

      <div className="divide-y divide-border">
        {tests.map((test) => {
          const config = statusConfig[test.status as keyof typeof statusConfig]
          const StatusIcon = config.icon

          return (
            <Link
              key={test.id}
              href={`/dashboard/tests/${test.id}`}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}>
                  <StatusIcon className={`h-5 w-5 ${config.class}`} />
                </div>
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-muted-foreground">{test.source}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden text-right sm:block">
                  <p
                    className={`text-sm font-mono ${test.status === "fail" ? "text-destructive" : test.status === "warning" ? "text-chart-3" : "text-muted-foreground"}`}
                  >
                    {test.variance}
                  </p>
                  <p className="text-xs text-muted-foreground">{test.lastRun}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
