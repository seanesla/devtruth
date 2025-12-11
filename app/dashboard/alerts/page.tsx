"use client"

import { useEffect, useState } from "react"
import { useSceneMode } from "@/lib/scene-context"
import { cn } from "@/lib/utils"
import { AlertsContent } from "@/components/dashboard/alerts/alerts-content"

export default function AlertsPage() {
  const { setMode } = useSceneMode()
  const [visible, setVisible] = useState(false)

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
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Notifications</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95] mb-6">
              Alerts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Monitor drift alerts, test failures, and threshold warnings.
            </p>
          </div>
        </div>

        {/* Alerts Content */}
        <div
          className={cn(
            "relative transition-all duration-1000 delay-200",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <AlertsContent />
        </div>
      </main>
    </div>
  )
}
