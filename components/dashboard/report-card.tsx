"use client"

import type { Report } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { reportTypeLabels, generateReportJSON } from "@/lib/data/mock-reports"
import { Download, FileText } from "lucide-react"

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const handleExportJSON = () => {
    const json = generateReportJSON(report)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}-${report.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    // Placeholder for PDF export
    alert("PDF export coming soon!")
  }

  const passRate = ((report.stats.passing / report.stats.totalTests) * 100).toFixed(0)

  return (
    <div className="rounded-lg border border-border/50 bg-background/40 backdrop-blur-xl p-6 hover:bg-foreground/5 transition-colors">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{report.name}</h3>
            <p className="text-sm text-muted-foreground">
              {report.period} • Generated {report.generatedAt}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
            <FileText className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{reportTypeLabels[report.type]}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{report.stats.totalTests} tests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">{report.stats.passing} passing</span>
          </div>
          {report.stats.failing > 0 && (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{report.stats.failing} failing</span>
            </div>
          )}
          {report.stats.warnings > 0 && (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">{report.stats.warnings} warnings</span>
            </div>
          )}
        </div>

        {/* Performance indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pass rate</span>
            <span className="font-medium">{passRate}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${passRate}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="size-4" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="size-4" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
