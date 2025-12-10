"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei"
import * as THREE from "three"
import { useSceneMode, type SceneMode } from "@/lib/scene-context"

function TruthCore({ scrollProgress, mode }: { scrollProgress: number; mode: SceneMode }) {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const middleRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const opacityRef = useRef(1)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Fade out during transition and dashboard
    const targetOpacity = mode === "landing" ? 1 : 0
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.05)

    if (opacityRef.current < 0.01) {
      groupRef.current.visible = false
      return
    }
    groupRef.current.visible = true

    // Slow rotation that responds to scroll
    groupRef.current.rotation.y = t * 0.1 + scrollProgress * Math.PI
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 + scrollProgress * 0.5

    // Each layer rotates independently
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.4
      innerRef.current.rotation.z = t * 0.3
      // @ts-ignore
      if (innerRef.current.material) innerRef.current.material.opacity = opacityRef.current
    }
    if (middleRef.current) {
      middleRef.current.rotation.y = -t * 0.2
      middleRef.current.rotation.x = t * 0.15
      // @ts-ignore
      if (middleRef.current.material) middleRef.current.material.opacity = opacityRef.current * 0.6
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = t * 0.08
      outerRef.current.rotation.y = -t * 0.05
    }

    // Subtle breathing scale
    const breathe = 1 + Math.sin(t * 0.8) * 0.03
    groupRef.current.scale.setScalar(breathe * opacityRef.current)

    // Position based on mode
    if (mode === "transitioning") {
      // Dive forward during transition
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -15, 0.03)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -5, 0.02)
    } else {
      // Normal scroll-based position
      groupRef.current.position.y = 1 - scrollProgress * 6
      groupRef.current.position.z = -2 - scrollProgress * 8
    }
  })

  return (
    <group ref={groupRef} position={[0, 1, -2]}>
      {/* Innermost - glowing core */}
      <mesh ref={innerRef} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#d4a574"
          emissive="#d4a574"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
          transparent
        />
      </mesh>

      {/* Middle layer - wireframe icosahedron */}
      <mesh ref={middleRef} scale={1.3}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#d4a574"
          emissive="#d4a574"
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer layer - glass dodecahedron */}
      <mesh ref={outerRef} scale={2}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.4}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          metalness={0.1}
          roughness={0}
          color="#d4a574"
          transmission={0.9}
        />
      </mesh>

      {/* Orbital rings */}
      {[1.6, 2.2, 2.8].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.3, 0]} scale={1}>
          <torusGeometry args={[radius, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#d4a574"
            emissive="#d4a574"
            emissiveIntensity={0.5 - i * 0.1}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={opacityRef.current}
          />
        </mesh>
      ))}
    </group>
  )
}

function SectionAccent({
  position,
  scrollProgress,
  showAfter,
  type,
  mode,
}: {
  position: [number, number, number]
  scrollProgress: number
  showAfter: number
  type: "stats" | "problem" | "how" | "cta"
  mode: SceneMode
}) {
  const ref = useRef<THREE.Group>(null)

  // Only show in landing mode
  const modeMultiplier = mode === "landing" ? 1 : 0
  const visibility = Math.max(0, Math.min(1, (scrollProgress - showAfter) * 4)) * modeMultiplier

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    ref.current.scale.setScalar(visibility * (type === "cta" ? 1.5 : 1))
    ref.current.rotation.y = t * 0.2

    // Subtle float
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2
  })

  if (visibility <= 0) return null

  return (
    <group ref={ref} position={position}>
      {type === "stats" && (
        // Grid of small cubes for stats section
        <>
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh key={i} position={[((i % 4) - 1.5) * 0.8, Math.floor(i / 4 - 1.5) * 0.8, 0]} scale={0.2}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#d4a574"
                emissive="#d4a574"
                emissiveIntensity={i % 3 === 0 ? 0.8 : 0.2}
                metalness={0.9}
                roughness={0.1}
                transparent
                opacity={visibility}
              />
            </mesh>
          ))}
        </>
      )}

      {type === "problem" && (
        // Fractured/broken geometry for "the problem"
        <Float speed={2} rotationIntensity={0.3}>
          <group>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh
                key={i}
                position={[Math.sin(i * 1.2) * 1.5, Math.cos(i * 1.5) * 1, Math.sin(i * 0.8) * 0.5]}
                rotation={[i * 0.5, i * 0.3, i * 0.2]}
                scale={0.4 + i * 0.1}
              >
                <tetrahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#d4a574" : "#8b4513"}
                  emissive={i % 2 === 0 ? "#d4a574" : "#8b4513"}
                  emissiveIntensity={0.4}
                  metalness={0.8}
                  roughness={0.2}
                  transparent
                  opacity={visibility}
                />
              </mesh>
            ))}
          </group>
        </Float>
      )}

      {type === "how" && (
        // Connected nodes for "how it works"
        <Float speed={1.5} rotationIntensity={0.2}>
          <group>
            {[
              [0, 0, 0],
              [1.5, 0.5, 0],
              [3, 0, 0.5],
            ].map((pos, i) => (
              <group key={i}>
                <mesh position={pos as [number, number, number]} scale={0.3}>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial
                    color="#d4a574"
                    emissive="#d4a574"
                    emissiveIntensity={0.6}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={visibility}
                  />
                </mesh>
                {i < 2 && (
                  <mesh
                    position={[pos[0] + 0.75 + i * 0.75, pos[1] + 0.25, pos[2] + 0.125] as [number, number, number]}
                    rotation={[0, 0, -0.3 + i * 0.3]}
                  >
                    <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
                    <meshStandardMaterial
                      color="#d4a574"
                      emissive="#d4a574"
                      emissiveIntensity={0.3}
                      transparent
                      opacity={visibility * 0.6}
                    />
                  </mesh>
                )}
              </group>
            ))}
          </group>
        </Float>
      )}

      {type === "cta" && (
        // Powerful convergence for CTA
        <Float speed={1} rotationIntensity={0.4}>
          <mesh scale={1.2}>
            <torusKnotGeometry args={[1, 0.3, 128, 32, 2, 3]} />
            <MeshTransmissionMaterial
              backside
              samples={8}
              thickness={0.3}
              chromaticAberration={0.5}
              anisotropy={0.5}
              distortion={0.3}
              distortionScale={0.5}
              temporalDistortion={0.2}
              metalness={0.1}
              roughness={0}
              color="#d4a574"
              transmission={0.9}
            />
          </mesh>
        </Float>
      )}
    </group>
  )
}

function AmbientParticles({ scrollProgress, mode }: { scrollProgress: number; mode: SceneMode }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const velocitiesRef = useRef<THREE.Vector3[]>([])

  // Different particle counts for different modes
  const targetCount = mode === "dashboard" ? 15 : 40

  const particles = useMemo(() => {
    const arr = Array.from({ length: 40 }, (_, i) => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      ),
      basePosition: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      ),
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.05,
    }))
    velocitiesRef.current = arr.map(() => new THREE.Vector3(0, 0, 0))
    return arr
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    particles.forEach((p, i) => {
      // Hide particles beyond the target count in dashboard mode
      const isVisible = i < targetCount

      if (mode === "transitioning") {
        // Scatter outward during transition
        const dir = p.position.clone().normalize()
        velocitiesRef.current[i].add(dir.multiplyScalar(0.02))
        p.position.add(velocitiesRef.current[i])
      } else if (mode === "dashboard") {
        // Calm, slow drift in dashboard
        const x = p.basePosition.x + Math.sin(t * p.speed * 0.3 + p.offset) * 1
        const y = p.basePosition.y + Math.cos(t * p.speed * 0.2) * 0.5
        const z = p.basePosition.z
        p.position.set(x, y, z)
      } else {
        // Normal landing behavior
        const x = p.basePosition.x + Math.sin(t * p.speed + p.offset) * 2
        const y = p.basePosition.y + Math.cos(t * p.speed * 0.7) * 1.5 - scrollProgress * 15
        const z = p.basePosition.z
        p.position.set(x, y, z)
      }

      dummy.position.copy(p.position)
      dummy.scale.setScalar(isVisible ? p.scale : 0)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.6} transparent opacity={0.8} />
    </instancedMesh>
  )
}

function ScrollCamera({ scrollProgress, mode }: { scrollProgress: number; mode: SceneMode }) {
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

      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.02)
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

function Scene({ scrollProgress, mode }: { scrollProgress: number; mode: SceneMode }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#d4a574" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} color="#d4a574" />

      <Environment preset="night" />

      <ScrollCamera scrollProgress={scrollProgress} mode={mode} />

      {/* THE focal point - always visible, transforms with scroll */}
      <TruthCore scrollProgress={scrollProgress} mode={mode} />

      {/* Section-specific accents that fade in */}
      <SectionAccent position={[-6, -4, -8]} scrollProgress={scrollProgress} showAfter={0.1} type="stats" mode={mode} />
      <SectionAccent position={[7, -10, -6]} scrollProgress={scrollProgress} showAfter={0.25} type="problem" mode={mode} />
      <SectionAccent position={[-5, -18, -5]} scrollProgress={scrollProgress} showAfter={0.45} type="how" mode={mode} />
      <SectionAccent position={[0, -28, -4]} scrollProgress={scrollProgress} showAfter={0.7} type="cta" mode={mode} />

      {/* Subtle ambient particles */}
      <AmbientParticles scrollProgress={scrollProgress} mode={mode} />
    </>
  )
}

function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0908] flex items-center justify-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative">
        <div className="w-20 h-20 border border-[#d4a574]/30 border-t-[#d4a574] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#d4a574] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Inner component that uses the scene context
function SceneBackgroundInner() {
  const { mode, scrollProgress, setScrollProgress } = useSceneMode()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only track scroll in landing mode
    if (mode !== "landing") return

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(1, window.scrollY / maxScroll)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode, setScrollProgress])

  return (
    <>
      <LoadingOverlay visible={loading} />
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["#0a0908"]} />
          <fog attach="fog" args={["#0a0908", 15, 40]} />
          <Scene scrollProgress={scrollProgress} mode={mode} />
        </Canvas>
      </div>
    </>
  )
}

// Wrapper that safely handles missing context (for backwards compatibility)
export default function SceneBackground() {
  try {
    return <SceneBackgroundInner />
  } catch {
    // Fallback if used outside provider (backwards compatible)
    return <SceneBackgroundFallback />
  }
}

// Fallback component for backwards compatibility
function SceneBackgroundFallback() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

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
      <LoadingOverlay visible={loading} />
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <color attach="background" args={["#0a0908"]} />
          <fog attach="fog" args={["#0a0908", 15, 40]} />
          <Scene scrollProgress={scrollProgress} mode="landing" />
        </Canvas>
      </div>
    </>
  )
}
