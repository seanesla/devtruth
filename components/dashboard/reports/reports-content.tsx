"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReportCard } from "@/components/dashboard/reports/report-card"
import { GenerateReportModal } from "@/components/dashboard/reports/generate-report-modal"
import { mockReports } from "@/lib/data/mock-reports"

export function ReportsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Generate Report
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Empty State (shown when no reports) */}
      {mockReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-lg border border-border/70 bg-background/40 backdrop-blur-xl p-8 max-w-md">
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your first report to analyze test results and track compliance over time.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Generate Your First Report
            </Button>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      <GenerateReportModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
