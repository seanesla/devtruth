"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiBrowser } from "./kpi-browser"
import { DashboardSelector } from "./dashboard-selector"
import { TestConfigForm } from "./test-config-form"
import type { SemanticModel, MetricDefinition, Workbook, WorkbookView } from "@/lib/types"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

interface TestWizardData {
  selectedModel?: SemanticModel
  selectedMetric?: MetricDefinition
  selectedWorkbook?: Workbook
  selectedView?: WorkbookView
  tolerance?: number
  filters?: string
  schedule?: string
}

const STEPS = [
  { number: "01", label: "KPI", description: "Select KPI" },
  { number: "02", label: "Dashboard", description: "Select Dashboard" },
  { number: "03", label: "Config", description: "Configure Rules" },
  { number: "04", label: "Review", description: "Review & Create" },
]

export function CreateTestWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<TestWizardData>({})

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKpiSelect = (model: SemanticModel, metric: MetricDefinition) => {
    setWizardData((prev) => ({
      ...prev,
      selectedModel: model,
      selectedMetric: metric,
    }))
  }

  const handleDashboardSelect = (workbook: Workbook, view: WorkbookView) => {
    setWizardData((prev) => ({
      ...prev,
      selectedWorkbook: workbook,
      selectedView: view,
    }))
  }

  const handleConfigChange = (tolerance: number, filters: string, schedule: string) => {
    setWizardData((prev) => ({
      ...prev,
      tolerance,
      filters,
      schedule,
    }))
  }

  const handleCreate = () => {
    console.log("Creating test with data:", wizardData)
    // TODO: Implement test creation logic
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return wizardData.selectedMetric !== undefined
      case 1:
        return wizardData.selectedView !== undefined
      case 2:
        return (
          wizardData.tolerance !== undefined &&
          wizardData.schedule !== undefined
        )
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background/40 backdrop-blur-xl p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-background/40 backdrop-blur-xl border-border/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Create New Test</CardTitle>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1}/4
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      {/* Circle */}
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm transition-all ${
                          index < currentStep
                            ? "bg-accent border-accent text-accent-foreground"
                            : index === currentStep
                              ? "bg-background border-accent text-accent"
                              : "bg-background/50 border-border/50 text-muted-foreground"
                        }`}
                      >
                        {index < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.number
                        )}
                      </div>
                      {/* Label */}
                      <div className="mt-2 text-center">
                        <p
                          className={`text-xs font-medium ${
                            index === currentStep
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                    {/* Connector Line */}
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-px flex-1 mx-2 transition-all ${
                          index < currentStep
                            ? "bg-accent"
                            : "bg-border/50"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Select a KPI from your Semantic Models
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose the metric definition that represents the ground truth
                  </p>
                  <KpiBrowser
                    onSelect={handleKpiSelect}
                    selectedMetricId={wizardData.selectedMetric?.id}
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Select Dashboard to Test Against
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose the workbook and view that displays this KPI
                  </p>
                  <DashboardSelector
                    onSelect={handleDashboardSelect}
                    selectedViewId={wizardData.selectedView?.id}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Configure Test Rules
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Set tolerance thresholds, filters, and schedule
                  </p>
                  <TestConfigForm
                    initialTolerance={wizardData.selectedMetric?.tolerance ?? 0.05}
                    onConfigChange={handleConfigChange}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-medium mb-6">Review & Create</h3>
                  <div className="space-y-6">
                    {/* KPI Summary */}
                    <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        KPI
                      </p>
                      <p className="font-medium">
                        {wizardData.selectedMetric?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {wizardData.selectedModel?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-mono">
                        {wizardData.selectedMetric?.calculation}
                      </p>
                    </div>

                    {/* Dashboard Summary */}
                    <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        Dashboard
                      </p>
                      <p className="font-medium">
                        {wizardData.selectedView?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {wizardData.selectedWorkbook?.name} • {wizardData.selectedWorkbook?.project}
                      </p>
                    </div>

                    {/* Configuration Summary */}
                    <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        Configuration
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Tolerance</p>
                          <p className="font-medium">
                            {((wizardData.tolerance ?? 0) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Schedule</p>
                          <p className="font-medium">{wizardData.schedule}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Filters</p>
                          <p className="font-medium text-sm">
                            {wizardData.filters || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/50 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!canProceed()}
                className="bg-accent hover:bg-accent/90"
              >
                Create Test
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
