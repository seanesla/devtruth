"use client"

import { useEffect, useState, useMemo } from "react"
import { Link } from "next-view-transitions"
import { ArrowUpRight } from "lucide-react"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { mockTests } from "@/lib/data/mock-tests"
import { StatusIndicator, statusConfig } from "@/components/ui/status-indicator"
import { LiquidGlassNavbar } from "@/components/liquid-glass-navbar"
import { Logo } from "@/components/logo"

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

  const stats = [
    { value: mockTests.length, label: "Total tests", color: "" },
    { value: passing, label: "Passing", color: "text-success" },
    { value: failing, label: "Failing", color: "text-destructive" },
    { value: warnings, label: "Warnings", color: "text-accent" },
  ]

  return (
    <div className="min-h-screen bg-transparent">
      {/* Liquid Glass Nav - same component as landing */}
      <LiquidGlassNavbar
        className={cn(
          "transition-all duration-1000",
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <Link href="/" className="flex items-center gap-2 text-accent hover:text-[#e0b080] transition-colors">
          <Logo className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-6">
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
      </LiquidGlassNavbar>

      <main className="px-6 md:px-12 pt-28 pb-12 max-w-7xl mx-auto">
        {/* Page title - editorial style with enhanced typography */}
        <div
          className={cn(
            "mb-20 transition-all duration-1000 delay-100",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Overview</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95]">Truth status</h1>
        </div>

        {/* Stats - glass cards with backdrop blur */}
        <div
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card/30 backdrop-blur-xl border border-border/50 p-8 md:p-10 group hover:bg-card/50 hover:border-accent/30 transition-all rounded-lg"
            >
              <p className={cn(
                "text-5xl md:text-6xl font-serif mb-2 stat-breathe tabular-nums",
                stat.color || "group-hover:text-accent transition-colors"
              )}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tests section - glass container */}
        <div
          className={cn(
            "bg-card/20 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden transition-all duration-1000 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Section header */}
          <div className="px-6 py-6 flex items-end justify-between border-b border-border/50">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif">All tests</h2>
              <p className="text-sm text-muted-foreground mt-1">Last synced 30 seconds ago</p>
            </div>
            <button className="text-sm border border-accent/50 text-accent px-4 py-2 hover:bg-accent hover:text-background transition-all rounded">
              + New test
            </button>
          </div>

          {/* Table header */}
          <div
            className={cn(
              "grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/30 bg-background/20 transition-all duration-1000 delay-400",
              visible ? "opacity-100" : "opacity-0"
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
          <div className="divide-y divide-border/30">
            {mockTests.map((test, index) => {
              const config = statusConfig[test.status]

              return (
                <Link
                  key={test.id}
                  href={`/dashboard/tests/${test.id}`}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-accent/5 transition-all group",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
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
                  <div className={cn(
                    "col-span-2 font-mono text-sm",
                    test.status === "fail" && "text-destructive"
                  )}>
                    {test.actual}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={cn(
                        "font-mono text-sm px-2 py-1 rounded",
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
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
