"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ReportType } from "@/lib/types"

interface GenerateReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GenerateReportModal({ open, onOpenChange }: GenerateReportModalProps) {
  const [reportType, setReportType] = useState<ReportType>("compliance")
  const [period, setPeriod] = useState("week")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsGenerating(false)
    onOpenChange(false)
    // In a real app, this would trigger a report generation and refresh the list
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Create a new report to analyze your test results and compliance status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance">Compliance Summary</SelectItem>
                <SelectItem value="drift">Drift Analysis</SelectItem>
                <SelectItem value="summary">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {reportType === "compliance" && "Overview of test compliance and pass rates"}
              {reportType === "drift" && "Analysis of metric drift patterns over time"}
              {reportType === "summary" && "Executive summary of all test activity"}
            </p>
          </div>

          {/* Time Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Time Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period" className="w-full">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last quarter</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format Options */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  id="json"
                  defaultChecked
                  className="size-4 rounded border-border"
                />
                <label htmlFor="json" className="cursor-pointer">JSON</label>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  id="pdf"
                  defaultChecked
                  className="size-4 rounded border-border"
                />
                <label htmlFor="pdf" className="cursor-pointer">PDF</label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
