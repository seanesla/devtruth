"use client"

import { useState, useMemo, useEffect } from "react"
import { Link } from "next-view-transitions"
import { ArrowUpRight, Plus } from "lucide-react"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { mockTests } from "@/lib/data/mock-tests"
import type { TestSummary, TestStatus } from "@/lib/types"
import { StatusIndicator, statusConfig } from "@/components/ui/status-indicator"
import { TestFilters } from "@/components/dashboard/tests/test-filters"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DecorativeGrid } from "@/components/ui/decorative-grid"

export function TestsListPage() {
  const { setMode } = useSceneMode()
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TestStatus | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set())

  // Set scene to dashboard mode
  useEffect(() => {
    setMode("dashboard")
  }, [setMode])

  // Trigger entry animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Filter and search tests
  const filteredTests = useMemo(() => {
    return mockTests.filter((test) => {
      // Search filter
      if (searchQuery && !test.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && test.status !== statusFilter) {
        return false
      }

      // Source filter
      if (sourceFilter !== "all" && test.source !== sourceFilter) {
        return false
      }

      // Date filter (simplified for mock data)
      // In a real app, this would filter by actual date ranges
      if (dateFilter !== "all") {
        // Mock implementation - just return true for now
        return true
      }

      return true
    })
  }, [searchQuery, statusFilter, sourceFilter, dateFilter])

  // Get unique sources for filter
  const uniqueSources = useMemo(() => {
    return Array.from(new Set(mockTests.map((t) => t.source)))
  }, [])

  // Select/deselect all visible tests
  const toggleSelectAll = () => {
    if (selectedTests.size === filteredTests.length) {
      setSelectedTests(new Set())
    } else {
      setSelectedTests(new Set(filteredTests.map((t) => t.id)))
    }
  }

  // Toggle individual test selection
  const toggleTestSelection = (testId: string) => {
    const newSelection = new Set(selectedTests)
    if (newSelection.has(testId)) {
      newSelection.delete(testId)
    } else {
      newSelection.add(testId)
    }
    setSelectedTests(newSelection)
  }

  // Check if all visible tests are selected
  const allSelected = filteredTests.length > 0 && selectedTests.size === filteredTests.length

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <main className="px-8 md:px-16 lg:px-20 pt-28 pb-12 relative z-10">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* Grid background */}
          <DecorativeGrid />

          {/* Decorative blur accents */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          {/* Content */}
          <div
            className={cn(
              "relative transition-all duration-1000 delay-100",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Validation Suite</p>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95]">
                  Tests
                </h1>
              </div>
              <Button
                className="group relative px-6 py-3 h-auto rounded-lg border border-accent/50 bg-transparent text-accent font-medium transition-all hover:bg-accent hover:text-background hover:border-accent hover:shadow-lg hover:shadow-accent/20 active:scale-95"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Test
              </Button>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Browse and manage all validation tests. Search, filter, and run tests individually or in bulk.
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div
          className={cn(
            "relative mb-8 transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <TestFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sourceFilter={sourceFilter}
            onSourceChange={setSourceFilter}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
            sources={uniqueSources}
            selectedCount={selectedTests.size}
            onRunSelected={() => {
              // Just UI - no functionality needed
              console.log("Run selected tests:", Array.from(selectedTests))
            }}
          />
        </div>

        {/* Tests List */}
        <div
          className={cn(
            "relative rounded-lg border border-border/70 bg-background/40 backdrop-blur-xl overflow-hidden transition-all duration-1000 delay-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/70 bg-background/30">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all tests"
              />
            </div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Test Name</div>
            <div className="col-span-2">Reported</div>
            <div className="col-span-2">Actual</div>
            <div className="col-span-1">Variance</div>
            <div className="col-span-2 text-right">Last Run</div>
          </div>

          {/* Test rows */}
          <div className="divide-y divide-border/20">
            {filteredTests.length === 0 ? (
              <div className="px-6 md:px-8 py-16 text-center">
                <p className="text-muted-foreground text-lg">No tests found matching your filters.</p>
                <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredTests.map((test, index) => {
                const config = statusConfig[test.status]
                const isSelected = selectedTests.has(test.id)

                return (
                  <div
                    key={test.id}
                    className={cn(
                      "grid grid-cols-12 gap-4 px-6 md:px-8 py-6 items-center group transition-all duration-300 hover:bg-foreground/5",
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                      test.status === "fail" && "border-l-2 border-l-destructive/50"
                    )}
                    style={{ transitionDelay: visible ? `${400 + index * 40}ms` : "0ms" }}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleTestSelection(test.id)}
                        aria-label={`Select ${test.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <StatusIndicator status={test.status} variant="dot" size="md" />
                    </div>

                    {/* Test Name & Source */}
                    <Link
                      href={`/dashboard/tests/${test.id}`}
                      className="col-span-3 group/link"
                    >
                      <p className="font-medium group-hover/link:text-accent transition-colors">
                        {test.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {test.source}
                      </p>
                    </Link>

                    {/* Reported */}
                    <div className="col-span-2 font-mono text-sm text-muted-foreground">
                      {test.reported}
                    </div>

                    {/* Actual */}
                    <div
                      className={cn(
                        "col-span-2 font-mono text-sm font-semibold",
                        test.status === "fail" && "text-destructive",
                        test.status === "pass" && "text-success"
                      )}
                    >
                      {test.actual}
                    </div>

                    {/* Variance */}
                    <div className="col-span-1">
                      <span
                        className={cn(
                          "inline-block font-mono text-xs font-semibold px-2 py-1 rounded-full",
                          config.textClass,
                          config.bgClass
                        )}
                      >
                        {test.variance}
                      </span>
                    </div>

                    {/* Last Run & Link Icon */}
                    <Link
                      href={`/dashboard/tests/${test.id}`}
                      className="col-span-2 flex items-center justify-end gap-2 text-sm text-muted-foreground group/link"
                    >
                      <span>{test.lastRun}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover/link:text-accent transition-all transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Results Summary */}
        {filteredTests.length > 0 && (
          <div
            className={cn(
              "mt-4 text-sm text-muted-foreground text-center transition-all duration-1000 delay-400",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            Showing {filteredTests.length} of {mockTests.length} tests
            {selectedTests.size > 0 && ` • ${selectedTests.size} selected`}
          </div>
        )}
      </main>
    </div>
  )
}
