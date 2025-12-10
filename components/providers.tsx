"use client"

import type { ReactNode } from "react"
import { ViewTransitions } from "next-view-transitions"
import { SceneProvider } from "@/lib/scene-context"
import SceneBackground from "@/components/scene-background"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ViewTransitions>
      <SceneProvider>
        <SceneBackground />
        {children}
      </SceneProvider>
    </ViewTransitions>
  )
}
