"use client"

import { useEffect, useState, use } from "react"
import { Link } from "next-view-transitions"
import { ArrowLeft, RotateCw, Settings } from "lucide-react"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TestDetailContent } from "@/components/dashboard/tests/test-detail-content"
import { getTestDetailById } from "@/lib/data/mock-tests"

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { setMode } = useSceneMode()
  const [visible, setVisible] = useState(false)

  const test = getTestDetailById(id)

  useEffect(() => {
    setMode("dashboard")
  }, [setMode])

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <main className="px-8 md:px-16 lg:px-20 pt-28 pb-12 relative z-10">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="pointer-events-none absolute -inset-12 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          <div
            className={cn(
              "relative transition-all duration-1000 delay-100",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Back link */}
            <Link
              href="/dashboard/tests"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Test Detail</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95]">
                  {test.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCw className="h-4 w-4" />
                  Re-run
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Detail Content */}
        <div
          className={cn(
            "relative transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <TestDetailContent testId={id} />
        </div>
      </main>
    </div>
  )
}
