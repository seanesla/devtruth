"use client"

import { Environment } from "@react-three/drei"
import type { SceneMode } from "@/lib/types"
import { SCENE_COLORS } from "@/lib/constants"
import { SECTION_POSITIONS, SECTION_THRESHOLDS } from "./constants"
import { TruthCore } from "./truth-core"
import { SectionAccent } from "./section-accent"
import { AmbientParticles } from "./ambient-particles"
import { ScrollCamera } from "./scroll-camera"

interface SceneProps {
  scrollProgress: number
  mode: SceneMode
}

export function Scene({ scrollProgress, mode }: SceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1} color={SCENE_COLORS.accent} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} color={SCENE_COLORS.accent} />

      <Environment preset="night" />

      <ScrollCamera scrollProgress={scrollProgress} mode={mode} />

      {/* THE focal point - always visible, transforms with scroll */}
      <TruthCore scrollProgress={scrollProgress} mode={mode} />

      {/* Section-specific accents that fade in */}
      <SectionAccent
        position={SECTION_POSITIONS.stats}
        scrollProgress={scrollProgress}
        showAfter={SECTION_THRESHOLDS.stats}
        type="stats"
        mode={mode}
      />
      <SectionAccent
        position={SECTION_POSITIONS.problem}
        scrollProgress={scrollProgress}
        showAfter={SECTION_THRESHOLDS.problem}
        type="problem"
        mode={mode}
      />
      <SectionAccent
        position={SECTION_POSITIONS.how}
        scrollProgress={scrollProgress}
        showAfter={SECTION_THRESHOLDS.how}
        type="how"
        mode={mode}
      />
      <SectionAccent
        position={SECTION_POSITIONS.cta}
        scrollProgress={scrollProgress}
        showAfter={SECTION_THRESHOLDS.cta}
        type="cta"
        mode={mode}
      />

      {/* Subtle ambient particles */}
      <AmbientParticles scrollProgress={scrollProgress} mode={mode} />
    </>
  )
}
