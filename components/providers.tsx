"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { ViewTransitions } from "next-view-transitions"
import { SceneProvider } from "@/lib/scene-context"

// Dynamically import heavy 3D scene with SSR disabled
const SceneBackground = dynamic(
  () => import("@/components/scene"),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 -z-10 bg-[#0a0908]" />
  }
)

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
