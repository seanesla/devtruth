"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { LOGO_PATH } from "./logo"

interface AnimatedLogoProps {
  onComplete?: () => void
  size?: number
}

export function AnimatedLogo({ onComplete, size = 120 }: AnimatedLogoProps) {
  const controls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Draw stroke (1.5s)
      await controls.start("drawing")
      // Phase 2: Fill in (0.8s)
      await controls.start("filling")
      // Phase 3: Glow pulse (0.4s)
      await controls.start("glowing")
      // Phase 4: Settle (0.3s)
      await controls.start("complete")
      onComplete?.()
    }
    sequence()
  }, [controls, onComplete])

  return (
    <div className="relative" style={{ width: size, height: size * 1.1 }}>
      {/* Glow layer (behind) */}
      <motion.div
        className="absolute inset-0 blur-2xl opacity-0"
        animate={controls}
        variants={{
          drawing: { opacity: 0 },
          filling: { opacity: 0.4, transition: { duration: 0.5 } },
          glowing: { opacity: 0.9, scale: 1.15, transition: { duration: 0.3 } },
          complete: { opacity: 0.3, scale: 1, transition: { duration: 0.4 } },
        }}
      >
        <svg viewBox="0 0 185 203" className="w-full h-full">
          <g transform="translate(-9.9154, -51.1603)">
            <path d={LOGO_PATH} fill="#cd9c60" />
          </g>
        </svg>
      </motion.div>

      {/* Main logo */}
      <svg viewBox="0 0 185 203" className="relative w-full h-full">
        <defs>
          <filter id="logo-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="logo-fill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0b080" />
            <stop offset="50%" stopColor="#cd9c60" />
            <stop offset="100%" stopColor="#b8894d" />
          </linearGradient>
        </defs>

        <g transform="translate(-9.9154, -51.1603)">
          <motion.path
            d={LOGO_PATH}
            fill="transparent"
            stroke="#cd9c60"
            strokeWidth={0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={controls}
            variants={{
              drawing: {
                pathLength: 1,
                opacity: 1,
                transition: {
                  pathLength: { duration: 1.5, ease: "easeInOut" },
                  opacity: { duration: 0.3 },
                },
              },
              filling: {
                fill: "url(#logo-fill-gradient)",
                transition: { duration: 0.8, ease: "easeIn" },
              },
              glowing: {
                filter: "url(#logo-glow-filter)",
                transition: { duration: 0.2 },
              },
              complete: {
                stroke: "transparent",
                filter: "none",
                transition: { duration: 0.3 },
              },
            }}
          />
        </g>
      </svg>
    </div>
  )
}
