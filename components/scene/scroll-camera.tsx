"use client"

import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { SceneMode } from "@/lib/types"

interface ScrollCameraProps {
  scrollProgress: number
  mode: SceneMode
}

export function ScrollCamera({ scrollProgress, mode }: ScrollCameraProps) {
  const { camera } = useThree()

  useFrame(() => {
    let targetY: number
    let targetZ: number
    let lookY: number

    if (mode === "transitioning") {
      // Camera dives forward during transition
      targetY = -2
      targetZ = -5
      lookY = -10

      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06)
    } else if (mode === "dashboard") {
      // Static, distant camera for dashboard
      targetY = 0
      targetZ = 15
      lookY = 0

      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    } else {
      // Normal landing scroll behavior
      targetY = 1.5 - scrollProgress * 4
      targetZ = 8 + scrollProgress * 3
      lookY = 0.5 - scrollProgress * 5

      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03)
    }

    camera.lookAt(0, lookY, -5)
  })

  return null
}
