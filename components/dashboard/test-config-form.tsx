"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle } from "lucide-react"

interface TestConfigFormProps {
  initialTolerance: number
  onConfigChange: (tolerance: number, filters: string, schedule: string) => void
}

const SCHEDULE_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "on-demand", label: "On-Demand Only" },
]

export function TestConfigForm({ initialTolerance, onConfigChange }: TestConfigFormProps) {
  const [tolerance, setTolerance] = useState(initialTolerance * 100)
  const [filters, setFilters] = useState("")
  const [schedule, setSchedule] = useState("daily")

  // Notify parent component of changes
  useEffect(() => {
    onConfigChange(tolerance / 100, filters, schedule)
  }, [tolerance, filters, schedule, onConfigChange])

  return (
    <div className="space-y-6">
      {/* Tolerance Configuration */}
      <div className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tolerance" className="text-base font-medium">
              Tolerance Threshold
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Acceptable variance between dashboard value and ground truth
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">0%</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-accent">
                  {tolerance.toFixed(1)}%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Slider
              id="tolerance"
              min={0}
              max={20}
              step={0.1}
              value={[tolerance]}
              onValueChange={(values) => setTolerance(values[0])}
              className="w-full"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-md border border-accent/20">
            <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Tests will <strong className="text-foreground">fail</strong> if variance exceeds{" "}
              <strong className="text-accent">{tolerance.toFixed(1)}%</strong>, and{" "}
              <strong className="text-foreground">warn</strong> if variance is between{" "}
              <strong className="text-accent">{(tolerance * 0.5).toFixed(1)}%</strong> and{" "}
              <strong className="text-accent">{tolerance.toFixed(1)}%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Configuration */}
      <div className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="filters" className="text-base font-medium">
              Additional Filters
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Optional filters to apply when validating this test (e.g., "Region = 'US'")
            </p>
          </div>

          <Input
            id="filters"
            type="text"
            placeholder="e.g., Region = 'US', Status = 'Active'"
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            className="bg-background/80"
          />

          <p className="text-xs text-muted-foreground">
            Filters will be applied to both the semantic model query and dashboard extraction.
            Leave empty to use default filters from the metric definition.
          </p>
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="schedule" className="text-base font-medium">
              Test Schedule
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              How often should this test run automatically
            </p>
          </div>

          <Select value={schedule} onValueChange={setSchedule}>
            <SelectTrigger id="schedule" className="w-full bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCHEDULE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-start gap-2">
            <p className="text-xs text-muted-foreground">
              {schedule === "on-demand" ? (
                <>
                  This test will only run when manually triggered. Useful for ad-hoc validation
                  or tests that need specific timing.
                </>
              ) : (
                <>
                  Test will run <strong className="text-foreground">{schedule}</strong> and
                  alert you if drift is detected.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
