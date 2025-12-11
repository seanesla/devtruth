import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/lib/types"
import { AlertCircle, AlertTriangle, Info, Check } from "lucide-react"

interface AlertCardProps {
  alert: Alert
  onAcknowledge: (alertId: string) => void
}

// Severity configuration for styling
const severityConfig = {
  high: {
    icon: AlertCircle,
    badgeClass: "border-transparent bg-destructive text-white",
    indicatorClass: "bg-destructive",
    label: "HIGH",
  },
  medium: {
    icon: AlertTriangle,
    badgeClass: "border-transparent bg-yellow-500 text-white dark:bg-yellow-600",
    indicatorClass: "bg-yellow-500 dark:bg-yellow-600",
    label: "MEDIUM",
  },
  low: {
    icon: Info,
    badgeClass: "border-transparent bg-blue-500 text-white dark:bg-blue-600",
    indicatorClass: "bg-blue-500 dark:bg-blue-600",
    label: "LOW",
  },
}

// Alert type labels
const typeLabels = {
  drift: "Drift Detected",
  failure: "Test Failure",
  threshold: "Threshold Warning",
}

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border/50 bg-background/40 backdrop-blur-xl transition-colors ${
        alert.acknowledged
          ? "opacity-60 hover:opacity-80"
          : "hover:bg-foreground/5"
      }`}
    >
      {/* Severity indicator bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${config.indicatorClass}`}
      />

      <div className="flex flex-col gap-3 p-4 pl-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Main Content */}
        <div className="flex flex-1 gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="h-5 w-5" />
          </div>

          {/* Alert Details */}
          <div className="flex-1 space-y-2">
            {/* Header: Severity + Type */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={config.badgeClass}>{config.label}</Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {typeLabels[alert.type]}
              </span>
              {alert.acknowledged && (
                <Badge variant="outline" className="gap-1">
                  <Check className="h-3 w-3" />
                  Acknowledged
                </Badge>
              )}
            </div>

            {/* Test Name */}
            <h3 className="font-semibold">{alert.testName}</h3>

            {/* Message */}
            <p className="text-sm text-muted-foreground">{alert.message}</p>

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground">{alert.triggeredAt}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="min-w-[100px]"
          >
            <Link href={`/dashboard/tests/${alert.testId}`}>View Test</Link>
          </Button>
          {!alert.acknowledged && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAcknowledge(alert.id)}
              className="min-w-[100px]"
            >
              Acknowledge
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
