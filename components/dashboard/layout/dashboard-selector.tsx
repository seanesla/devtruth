"use client"

import { useState } from "react"
import { mockWorkbooks } from "@/lib/data/mock-workbooks"
import type { Workbook, WorkbookView } from "@/lib/types"
import { ChevronDown, ChevronRight, Layout, BarChart3, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSelectorProps {
  onSelect: (workbook: Workbook, view: WorkbookView) => void
  selectedViewId?: string
}

export function DashboardSelector({ onSelect, selectedViewId }: DashboardSelectorProps) {
  const [expandedWorkbooks, setExpandedWorkbooks] = useState<Set<string>>(new Set())

  const toggleWorkbook = (workbookId: string) => {
    setExpandedWorkbooks((prev) => {
      const next = new Set(prev)
      if (next.has(workbookId)) {
        next.delete(workbookId)
      } else {
        next.add(workbookId)
      }
      return next
    })
  }

  const handleViewSelect = (workbook: Workbook, view: WorkbookView) => {
    onSelect(workbook, view)
  }

  return (
    <div className="space-y-2">
      {mockWorkbooks.map((workbook) => {
        const isExpanded = expandedWorkbooks.has(workbook.id)

        return (
          <div
            key={workbook.id}
            className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden"
          >
            {/* Workbook Header */}
            <button
              onClick={() => toggleWorkbook(workbook.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{workbook.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FolderOpen className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {workbook.project} • {workbook.views.length} view{workbook.views.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Views List */}
            {isExpanded && (
              <div className="border-t border-border/50 bg-background/30">
                {workbook.views.map((view) => {
                  const isSelected = selectedViewId === view.id

                  return (
                    <button
                      key={view.id}
                      onClick={() => handleViewSelect(workbook, view)}
                      className={cn(
                        "w-full p-4 pl-12 flex items-start gap-3 hover:bg-foreground/5 transition-colors border-b border-border/30 last:border-b-0",
                        isSelected && "bg-accent/10 border-l-2 border-l-accent"
                      )}
                    >
                      <BarChart3
                        className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          isSelected ? "text-accent" : "text-muted-foreground"
                        )}
                      />
                      <div className="text-left flex-1">
                        <p className={cn(
                          "font-medium text-sm",
                          isSelected && "text-accent"
                        )}>
                          {view.name}
                        </p>
                        {view.displayedMetrics.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Displayed Metrics:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {view.displayedMetrics.map((metric, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 text-xs"
                                >
                                  <span className="font-medium">
                                    {metric.fieldCaption}
                                  </span>
                                  {metric.dashboardCalculation && (
                                    <span className="text-muted-foreground font-mono text-xs">
                                      ({metric.dashboardCalculation})
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
