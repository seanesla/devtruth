"use client"

import { useState } from "react"
import { mockSemanticModels } from "@/lib/data/mock-semantic-models"
import type { SemanticModel, MetricDefinition } from "@/lib/types"
import { ChevronDown, ChevronRight, Database, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiBrowserProps {
  onSelect: (model: SemanticModel, metric: MetricDefinition) => void
  selectedMetricId?: string
}

export function KpiBrowser({ onSelect, selectedMetricId }: KpiBrowserProps) {
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set())

  const toggleModel = (modelId: string) => {
    setExpandedModels((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) {
        next.delete(modelId)
      } else {
        next.add(modelId)
      }
      return next
    })
  }

  const handleMetricSelect = (model: SemanticModel, metric: MetricDefinition) => {
    onSelect(model, metric)
  }

  return (
    <div className="space-y-2">
      {mockSemanticModels.map((model) => {
        const isExpanded = expandedModels.has(model.id)

        return (
          <div
            key={model.id}
            className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden"
          >
            {/* Model Header */}
            <button
              onClick={() => toggleModel(model.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{model.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {model.metrics.length} metric{model.metrics.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* Metrics List */}
            {isExpanded && (
              <div className="border-t border-border/50 bg-background/30">
                {model.metrics.map((metric) => {
                  const isSelected = selectedMetricId === metric.id

                  return (
                    <button
                      key={metric.id}
                      onClick={() => handleMetricSelect(model, metric)}
                      className={cn(
                        "w-full p-4 pl-12 flex items-start gap-3 hover:bg-foreground/5 transition-colors border-b border-border/30 last:border-b-0",
                        isSelected && "bg-accent/10 border-l-2 border-l-accent"
                      )}
                    >
                      <TrendingUp
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
                          {metric.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 text-xs font-mono text-muted-foreground">
                            {metric.calculation}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 text-xs">
                            <span className="text-muted-foreground">Tolerance:</span>
                            <span className="font-medium">
                              {(metric.tolerance * 100).toFixed(1)}%
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 text-xs">
                            <span className="text-muted-foreground">Granularity:</span>
                            <span className="font-medium capitalize">
                              {metric.granularity}
                            </span>
                          </span>
                        </div>
                        {metric.filters && metric.filters.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Filters: {metric.filters.map((f) => f.field).join(", ")}
                            </p>
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
