import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const tests = [
  {
    id: "1",
    name: "Monthly Revenue",
    source: "Looker",
    status: "pass" as const,
    reported: "$2.4M",
    actual: "$2.4M",
    variance: "0.02%",
    lastRun: "2 min ago",
  },
  {
    id: "2",
    name: "Customer Churn Rate",
    source: "Tableau",
    status: "fail" as const,
    reported: "4.2%",
    actual: "6.8%",
    variance: "38.1%",
    lastRun: "5 min ago",
  },
  {
    id: "3",
    name: "Active Users (DAU)",
    source: "Metabase",
    status: "pass" as const,
    reported: "84.2K",
    actual: "84.1K",
    variance: "0.12%",
    lastRun: "8 min ago",
  },
  {
    id: "4",
    name: "Conversion Rate",
    source: "Looker",
    status: "warn" as const,
    reported: "3.2%",
    actual: "3.06%",
    variance: "4.2%",
    lastRun: "12 min ago",
  },
  {
    id: "5",
    name: "Average Order Value",
    source: "Tableau",
    status: "pass" as const,
    reported: "$127",
    actual: "$127",
    variance: "0.1%",
    lastRun: "15 min ago",
  },
  {
    id: "6",
    name: "Customer Lifetime Value",
    source: "Custom SQL",
    status: "fail" as const,
    reported: "$2,847",
    actual: "$2,104",
    variance: "26.1%",
    lastRun: "18 min ago",
  },
]

export default function DashboardPage() {
  const passing = tests.filter((t) => t.status === "pass").length
  const failing = tests.filter((t) => t.status === "fail").length
  const warnings = tests.filter((t) => t.status === "warn").length

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border px-6 py-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="font-mono text-sm">
          /dev/truth
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm text-foreground">
            Overview
          </Link>
          <Link
            href="/dashboard/tests"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tests
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>
      </header>

      <main className="px-6 py-12 max-w-7xl mx-auto">
        {/* Page title - editorial style */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Overview</p>
          <h1 className="text-4xl md:text-5xl font-serif">Truth status</h1>
        </div>

        {/* Stats - horizontal, dramatic numbers */}
        <div className="grid grid-cols-4 gap-px bg-border mb-16">
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif mb-1">{tests.length}</p>
            <p className="text-sm text-muted-foreground">Total tests</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-success mb-1">{passing}</p>
            <p className="text-sm text-muted-foreground">Passing</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-destructive mb-1">{failing}</p>
            <p className="text-sm text-muted-foreground">Failing</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-accent mb-1">{warnings}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </div>

        {/* Tests list - clean table-like layout */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-serif">All tests</h2>
            <p className="text-sm text-muted-foreground mt-1">Last synced 30 seconds ago</p>
          </div>
          <button className="text-sm border border-foreground/20 px-4 py-2 hover:bg-foreground hover:text-background transition-all">
            + New test
          </button>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Test</div>
          <div className="col-span-2">Reported</div>
          <div className="col-span-2">Actual</div>
          <div className="col-span-2">Variance</div>
          <div className="col-span-2 text-right">Last run</div>
        </div>

        {/* Test rows */}
        <div className="divide-y divide-border">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/dashboard/tests/${test.id}`}
              className="grid grid-cols-12 gap-4 px-4 py-5 items-center hover:bg-card transition-colors group"
            >
              <div className="col-span-1">
                <StatusIndicator status={test.status} />
              </div>
              <div className="col-span-3">
                <p className="font-medium group-hover:text-accent transition-colors">{test.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{test.source}</p>
              </div>
              <div className="col-span-2 font-mono text-sm">{test.reported}</div>
              <div className={`col-span-2 font-mono text-sm ${test.status === "fail" ? "text-destructive" : ""}`}>
                {test.actual}
              </div>
              <div className="col-span-2">
                <span
                  className={`
                    font-mono text-sm px-2 py-1
                    ${test.status === "pass" ? "text-success bg-success/10" : ""}
                    ${test.status === "fail" ? "text-destructive bg-destructive/10" : ""}
                    ${test.status === "warn" ? "text-accent bg-accent/10" : ""}
                  `}
                >
                  {test.status === "pass" ? "+" : ""}
                  {test.variance}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                {test.lastRun}
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

function StatusIndicator({ status }: { status: "pass" | "fail" | "warn" }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          h-2 w-2 rounded-full
          ${status === "pass" ? "bg-success" : ""}
          ${status === "fail" ? "bg-destructive" : ""}
          ${status === "warn" ? "bg-accent" : ""}
        `}
      />
      <span className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:inline">{status}</span>
    </div>
  )
}
