"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type SceneMode = "landing" | "transitioning" | "dashboard"

interface SceneContextValue {
  mode: SceneMode
  setMode: (mode: SceneMode) => void
  scrollProgress: number
  setScrollProgress: (progress: number) => void
  resetToLanding: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const SceneContext = createContext<SceneContextValue | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SceneMode>("landing")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const setMode = useCallback((newMode: SceneMode) => {
    setModeState(newMode)
  }, [])

  const resetToLanding = useCallback(() => {
    setModeState("landing")
    setScrollProgress(0)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    }
  }, [])

  return (
    <SceneContext.Provider value={{ mode, setMode, scrollProgress, setScrollProgress, resetToLanding, isLoading, setIsLoading }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useSceneMode() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error("useSceneMode must be used within a SceneProvider")
  }
  return context
}
