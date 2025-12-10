"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei"
import * as THREE from "three"

function TruthCore({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const middleRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Slow rotation that responds to scroll
    groupRef.current.rotation.y = t * 0.1 + scrollProgress * Math.PI
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 + scrollProgress * 0.5

    // Each layer rotates independently
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.4
      innerRef.current.rotation.z = t * 0.3
    }
    if (middleRef.current) {
      middleRef.current.rotation.y = -t * 0.2
      middleRef.current.rotation.x = t * 0.15
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = t * 0.08
      outerRef.current.rotation.y = -t * 0.05
    }

    // Subtle breathing scale
    const breathe = 1 + Math.sin(t * 0.8) * 0.03
    groupRef.current.scale.setScalar(breathe)

    // Move down and scale up as user scrolls
    groupRef.current.position.y = 1 - scrollProgress * 6
    groupRef.current.position.z = -2 - scrollProgress * 8
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
}: {
  position: [number, number, number]
  scrollProgress: number
  showAfter: number
  type: "stats" | "problem" | "how" | "cta"
}) {
  const ref = useRef<THREE.Group>(null)
  const visibility = Math.max(0, Math.min(1, (scrollProgress - showAfter) * 4))

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

function AmbientParticles({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 10] as [
        number,
        number,
        number,
      ],
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.05,
    }))
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    particles.forEach((p, i) => {
      const x = p.position[0] + Math.sin(t * p.speed + p.offset) * 2
      const y = p.position[1] + Math.cos(t * p.speed * 0.7) * 1.5 - scrollProgress * 15
      const z = p.position[2]

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(p.scale)
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

function ScrollCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()

  useFrame(() => {
    // Camera path: starts centered, moves down and back as scroll progresses
    const targetY = 1.5 - scrollProgress * 4
    const targetZ = 8 + scrollProgress * 3

    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03)

    // Look at a point that moves with scroll
    const lookY = 0.5 - scrollProgress * 5
    camera.lookAt(0, lookY, -5)
  })

  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#d4a574" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={1} color="#d4a574" />

      <Environment preset="night" />

      <ScrollCamera scrollProgress={scrollProgress} />

      {/* THE focal point - always visible, transforms with scroll */}
      <TruthCore scrollProgress={scrollProgress} />

      {/* Section-specific accents that fade in */}
      <SectionAccent position={[-6, -4, -8]} scrollProgress={scrollProgress} showAfter={0.1} type="stats" />
      <SectionAccent position={[7, -10, -6]} scrollProgress={scrollProgress} showAfter={0.25} type="problem" />
      <SectionAccent position={[-5, -18, -5]} scrollProgress={scrollProgress} showAfter={0.45} type="how" />
      <SectionAccent position={[0, -28, -4]} scrollProgress={scrollProgress} showAfter={0.7} type="cta" />

      {/* Subtle ambient particles */}
      <AmbientParticles scrollProgress={scrollProgress} />
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

export default function SceneBackground() {
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
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
      </div>
    </>
  )
}
