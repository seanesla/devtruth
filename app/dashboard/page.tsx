"use client"

import { useEffect, useState, useMemo } from "react"
import { Link } from "next-view-transitions"
import { ArrowUpRight } from "lucide-react"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { mockTests } from "@/lib/data/mock-tests"
import { StatusIndicator, statusConfig } from "@/components/ui/status-indicator"

export default function DashboardPage() {
  const { setMode } = useSceneMode()
  const [visible, setVisible] = useState(false)

  // Set scene to dashboard mode
  useEffect(() => {
    setMode("dashboard")
  }, [setMode])

  // Trigger entry animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Memoize test counts - single pass instead of 3 filter operations
  const { passing, failing, warnings } = useMemo(() => {
    let pass = 0, fail = 0, warn = 0
    for (const t of mockTests) {
      if (t.status === "pass") pass++
      else if (t.status === "fail") fail++
      else if (t.status === "warn") warn++
    }
    return { passing: pass, failing: fail, warnings: warn }
  }, [])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top bar */}
      <header
        className={cn(
          "sticky top-0 z-50 flex items-center justify-between border-b border-border px-6 py-4 bg-background/80 backdrop-blur-sm transition-all duration-700",
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <Link href="/" className="font-mono text-sm hover:text-accent transition-colors">
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
        <div
          className={cn(
            "mb-16 transition-all duration-700 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Overview</p>
          <h1 className="text-4xl md:text-5xl font-serif">Truth status</h1>
        </div>

        {/* Stats - horizontal, dramatic numbers */}
        <div
          className={cn(
            "grid grid-cols-4 gap-px bg-border mb-16 transition-all duration-700 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif mb-1 stat-breathe">{mockTests.length}</p>
            <p className="text-sm text-muted-foreground">Total tests</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-success mb-1 stat-breathe">{passing}</p>
            <p className="text-sm text-muted-foreground">Passing</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-destructive mb-1 stat-breathe">{failing}</p>
            <p className="text-sm text-muted-foreground">Failing</p>
          </div>
          <div className="bg-background p-6 md:p-8">
            <p className="text-5xl md:text-6xl font-serif text-accent mb-1 stat-breathe">{warnings}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </div>

        {/* Tests list - clean table-like layout */}
        <div
          className={cn(
            "mb-8 flex items-end justify-between transition-all duration-700 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <h2 className="text-2xl font-serif">All tests</h2>
            <p className="text-sm text-muted-foreground mt-1">Last synced 30 seconds ago</p>
          </div>
          <button className="text-sm border border-foreground/20 px-4 py-2 hover:bg-foreground hover:text-background transition-all">
            + New test
          </button>
        </div>

        {/* Table header */}
        <div
          className={cn(
            "grid grid-cols-12 gap-4 px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-border transition-all duration-700 delay-400",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Test</div>
          <div className="col-span-2">Reported</div>
          <div className="col-span-2">Actual</div>
          <div className="col-span-2">Variance</div>
          <div className="col-span-2 text-right">Last run</div>
        </div>

        {/* Test rows */}
        <div className="divide-y divide-border">
          {mockTests.map((test, index) => {
            const config = statusConfig[test.status]

            return (
              <Link
                key={test.id}
                href={`/dashboard/tests/${test.id}`}
                className={cn(
                  "grid grid-cols-12 gap-4 px-4 py-5 items-center hover:bg-card transition-all group",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                  test.status === "fail" && "status-fail"
                )}
                style={{ transitionDelay: visible ? `${500 + index * 50}ms` : "0ms" }}
              >
                <div className="col-span-1">
                  <StatusIndicator status={test.status} showLabel className="hidden sm:flex" />
                  <StatusIndicator status={test.status} className="sm:hidden" />
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
                    className={cn(
                      "font-mono text-sm px-2 py-1",
                      config.textClass,
                      config.bgClass
                    )}
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
            )
          })}
        </div>
      </main>
    </div>
  )
}
