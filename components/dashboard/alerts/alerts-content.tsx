"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCard } from "./alert-card"
import { mockAlerts } from "@/lib/data/mock-alerts"
import type { Alert, AlertType, AlertSeverity } from "@/lib/types"
import { CheckCheck } from "lucide-react"

type FilterType = "all" | "unread" | AlertSeverity

export function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  // Filter alerts based on active filter
  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") {
      return alerts
    }
    if (activeFilter === "unread") {
      return alerts.filter((alert) => !alert.acknowledged)
    }
    // Filter by severity
    return alerts.filter((alert) => alert.severity === activeFilter)
  }, [alerts, activeFilter])

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return alerts.filter((alert) => !alert.acknowledged).length
  }, [alerts])

  // Handle marking alert as acknowledged
  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  // Handle marking all alerts as read
  const handleMarkAllRead = () => {
    setAlerts((prev) =>
      prev.map((alert) => ({ ...alert, acknowledged: true }))
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter Bar */}
      <div className="rounded-t-lg border border-border/70 bg-background/40 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("unread")}
            className="gap-2"
          >
            Unread
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background/20 px-1.5 text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeFilter === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("high")}
          >
            High
          </Button>
          <Button
            variant={activeFilter === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("medium")}
          >
            Medium
          </Button>
          <Button
            variant={activeFilter === "low" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("low")}
          >
            Low
          </Button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="flex-1 rounded-b-lg border border-t-0 border-border/70 bg-background/40 p-6 backdrop-blur-xl">
        {filteredAlerts.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/40 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CheckCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No alerts found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeFilter === "all"
                ? "You're all caught up! No alerts to display."
                : activeFilter === "unread"
                  ? "No unread alerts. Great job staying on top of things!"
                  : `No ${activeFilter} severity alerts to display.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
