"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { Link } from "next-view-transitions"
import { ArrowUpRight } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { mockTests, getTestStats } from "@/lib/data/mock-tests"
import { StatusIndicator, statusConfig } from "@/components/ui/status-indicator"
import { DecorativeGrid } from "@/components/ui/decorative-grid"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export default function DashboardPage() {
  const { setMode } = useSceneMode()
  const [visible, setVisible] = useState(false)
  const [chartsVisible, setChartsVisible] = useState(false)
  const chartsRef = useRef<HTMLDivElement>(null)

  // Set scene to dashboard mode
  useEffect(() => {
    setMode("dashboard")
  }, [setMode])

  // Trigger entry animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Scroll reveal for charts section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChartsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (chartsRef.current) observer.observe(chartsRef.current)
    return () => observer.disconnect()
  }, [])

  // Memoize test counts
  const { passing, failing, warnings, total } = useMemo(() => getTestStats(), [])

  // Calculate health score
  const healthScore = Math.round((passing / total) * 100)

  // Chart config for colors
  const chartConfig: ChartConfig = {
    passing: {
      label: "Passing",
      color: "#22c55e",
    },
    failing: {
      label: "Failing",
      color: "#ef4444",
    },
    warnings: {
      label: "Warnings",
      color: "#d4a574",
    },
    trend: {
      label: "Pass Rate",
      color: "#d4a574",
    },
  }

  // Status distribution data
  const statusData = useMemo(
    () => [
      { name: "passing", value: passing, fill: "#22c55e" }, // success green
      { name: "failing", value: failing, fill: "#ef4444" }, // destructive red
      { name: "warnings", value: warnings, fill: "#d4a574" }, // accent amber
    ],
    [passing, failing, warnings]
  )

  // Health score color
  const getHealthColor = () => {
    if (healthScore > 85) return "#22c55e" // success green
    if (healthScore > 70) return "#d4a574" // accent amber
    return "#ef4444" // destructive red
  }

  const healthData = useMemo(
    () => [
      { name: "health", value: healthScore, fill: getHealthColor() },
    ],
    [healthScore]
  )

  // 7-day trend data
  const trendData = useMemo(
    () => [
      { day: "Mon", passRate: 88 },
      { day: "Tue", passRate: 92 },
      { day: "Wed", passRate: 85 },
      { day: "Thu", passRate: 90 },
      { day: "Fri", passRate: 87 },
      { day: "Sat", passRate: 91 },
      { day: "Sun", passRate: healthScore },
    ],
    [healthScore]
  )

  // Recent test results (last 10)
  const recentResults = useMemo(
    () =>
      mockTests.slice(0, 10).map((test) => ({
        name: `${test.name.substring(0, 12)}${test.name.length > 12 ? "..." : ""}`,
        variance: parseFloat(test.variance),
        status: test.status,
        fullName: test.name,
      })),
    []
  )

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <main className="px-8 md:px-16 lg:px-20 pt-28 pb-12 relative z-10">
        {/* HERO SECTION - Keep current design */}
        <div className="relative mb-24 md:mb-28">
          {/* Grid background */}
          <DecorativeGrid />

          {/* Decorative blur accents */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

          {/* Content */}
          <div
            className={cn(
              "relative transition-all duration-1000 delay-100",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Overview</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95] mb-6">
              Truth <span className="text-accent">status</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Real-time validation results for your business KPIs. Monitor metrics across all your data sources.
            </p>
          </div>
        </div>

        {/* QUICK STATS BAR - Compact summary */}
        <div
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20 transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="text-center p-4 md:p-5 rounded-lg border border-border/50 bg-card/20 backdrop-blur-xl">
            <p className="text-3xl md:text-4xl font-serif tabular-nums">{mockTests.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Total tests</p>
          </div>
          <div className="text-center p-4 md:p-5 rounded-lg border border-border/50 bg-card/20 backdrop-blur-xl">
            <p className="text-3xl md:text-4xl font-serif tabular-nums text-success">{passing}</p>
            <p className="text-xs text-muted-foreground mt-2">Passing</p>
          </div>
          <div className="text-center p-4 md:p-5 rounded-lg border border-border/50 bg-card/20 backdrop-blur-xl">
            <p className="text-3xl md:text-4xl font-serif tabular-nums text-destructive">{failing}</p>
            <p className="text-xs text-muted-foreground mt-2">Failing</p>
          </div>
          <div className="text-center p-4 md:p-5 rounded-lg border border-border/50 bg-card/20 backdrop-blur-xl">
            <p className="text-3xl md:text-4xl font-serif tabular-nums text-accent">{warnings}</p>
            <p className="text-xs text-muted-foreground mt-2">Warnings</p>
          </div>
        </div>

        {/* CHARTS SECTION - 2x2 Grid */}
        <div
          ref={chartsRef}
          className="relative mb-20 md:mb-24"
        >
          {/* Grid background */}
          <DecorativeGrid opacity="light" />

          {/* Decorative blur accents */}
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-success/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative">
            {/* Section heading */}
            <div
              className={cn(
                "mb-8 transition-all duration-1000 delay-300",
                chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Analytics</p>
              <h2 className="text-3xl md:text-4xl font-serif">Performance Metrics</h2>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {/* Chart 1: Test Status Distribution */}
              <div
                className={cn(
                  "group relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-xl p-8 transition-all duration-500 hover:border-accent/50 hover:bg-card/40",
                  chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: chartsVisible ? "400ms" : "0ms" }}
              >
                <h3 className="text-lg font-semibold mb-4">Test Status</h3>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      strokeWidth={0}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => {
                        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
                        return capitalizedValue
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Chart 2: 7-Day Trend */}
              <div
                className={cn(
                  "group relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-xl p-8 transition-all duration-500 hover:border-accent/50 hover:bg-card/40",
                  chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: chartsVisible ? "500ms" : "0ms" }}
              >
                <h3 className="text-lg font-semibold mb-4">Pass Rate Trend (7 days)</h3>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4a574" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d4a574" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#999" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#999" style={{ fontSize: "12px" }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="passRate"
                      stroke="#d4a574"
                      fill="url(#colorPassRate)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Chart 3: Health Score Gauge */}
              <div
                className={cn(
                  "group relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-xl p-8 transition-all duration-500 hover:border-accent/50 hover:bg-card/40",
                  chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: chartsVisible ? "600ms" : "0ms" }}
              >
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <RadialBarChart
                    data={healthData}
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarGrid gridType="circle" stroke="#333" />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill={getHealthColor()}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={32}
                      fontFamily="serif"
                      fontWeight="600"
                      fill="#d4a574"
                    >
                      {healthScore}%
                    </text>
                  </RadialBarChart>
                </ChartContainer>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  {healthScore > 85 ? "Excellent" : healthScore > 70 ? "Good" : "Needs attention"}
                </p>
              </div>

              {/* Chart 4: Recent Test Results */}
              <div
                className={cn(
                  "group relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-xl p-8 transition-all duration-500 hover:border-accent/50 hover:bg-card/40",
                  chartsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: chartsVisible ? "700ms" : "0ms" }}
              >
                <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <BarChart data={recentResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#999"
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis stroke="#999" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "6px",
                        padding: "8px"
                      }}
                      formatter={(value) => [`${value}%`, "Variance"]}
                    />
                    <Bar dataKey="variance" fill="#d4a574" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>

        {/* TESTS SECTION - Enhanced styling */}
        <div className="relative">
          {/* Decorative blur accents */}
          <div className="pointer-events-none absolute -top-24 left-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

          <div
            className={cn(
              "relative rounded-lg border border-border/50 bg-card/20 backdrop-blur-xl overflow-hidden transition-all duration-1000 delay-300",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            {/* Section header - Enhanced */}
            <div className="relative px-6 md:px-8 py-8 border-b border-border/30 bg-gradient-to-r from-background/40 to-background/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Validations</p>
                  <h2 className="text-3xl md:text-4xl font-serif mb-2">All tests</h2>
                  <p className="text-sm text-muted-foreground">Last synced 30 seconds ago</p>
                </div>
                <button className="group relative px-6 py-3 rounded-lg border border-accent/50 text-accent font-medium transition-all hover:bg-accent hover:text-background hover:border-accent hover:shadow-lg hover:shadow-accent/20 active:scale-95">
                  + New test
                </button>
              </div>
            </div>

            {/* Table header */}
            <div
              className={cn(
                "grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/20 bg-background/30 transition-all duration-1000 delay-400",
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
            <div className="divide-y divide-border/20">
              {mockTests.map((test, index) => {
                const config = statusConfig[test.status]

                return (
                  <Link
                    key={test.id}
                    href={`/dashboard/tests/${test.id}`}
                    className={cn(
                      "grid grid-cols-12 gap-4 px-6 md:px-8 py-6 items-center group transition-all duration-300 hover:bg-accent/5 hover:shadow-md",
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                      test.status === "fail" && "status-fail"
                    )}
                    style={{ transitionDelay: visible ? `${500 + index * 40}ms` : "0ms" }}
                  >
                    <div className="col-span-1">
                      <StatusIndicator status={test.status} showLabel className="hidden sm:flex" />
                      <StatusIndicator status={test.status} className="sm:hidden" />
                    </div>
                    <div className="col-span-3">
                      <p className="font-medium group-hover:text-accent transition-colors">{test.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{test.source}</p>
                    </div>
                    <div className="col-span-2 font-mono text-sm text-muted-foreground">{test.reported}</div>
                    <div className={cn(
                      "col-span-2 font-mono text-sm font-semibold",
                      test.status === "fail" && "text-destructive",
                      test.status === "pass" && "text-success"
                    )}>
                      {test.actual}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={cn(
                          "inline-block font-mono text-xs font-semibold px-3 py-1.5 rounded-full",
                          config.textClass,
                          config.bgClass
                        )}
                      >
                        {test.status === "pass" ? "+" : ""}
                        {test.variance}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                      <span className="opacity-0 group-hover:opacity-100 transition-all">{test.lastRun}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
