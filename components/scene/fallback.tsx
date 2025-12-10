"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { CAMERA, FOG } from "./constants"
import { SCENE_COLORS } from "@/lib/constants"
import { Scene } from "./scene-canvas"
import { LoadingOverlay } from "./loading-overlay"

export function SceneBackgroundFallback() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  const handleAnimationComplete = () => {
    setTimeout(() => setLoading(false), 300)
  }

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(1, window.scrollY / maxScroll)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <LoadingOverlay visible={loading} onAnimationComplete={handleAnimationComplete} />
      <div className="fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [...CAMERA.initialPosition], fov: CAMERA.fov }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={[SCENE_COLORS.background]} />
          <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
          <Scene scrollProgress={scrollProgress} mode="landing" />
        </Canvas>
      </div>
    </>
  )
}
