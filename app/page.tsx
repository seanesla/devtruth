"use client"

import type React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import SceneBackground from "@/components/scene-background"
import { useEffect, useRef, useState } from "react"

export default function LandingPage() {
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">
      <SceneBackground />

      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-1000 ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Link href="/" className="font-mono text-sm tracking-tight text-foreground">
          /dev/truth
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="text-sm border border-foreground/20 px-4 py-2 hover:bg-foreground hover:text-background transition-all"
          >
            Enter
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12">
        <div className="relative z-10 max-w-3xl">
          <p
            className={`text-muted-foreground mb-6 tracking-wide uppercase text-xs transition-all duration-1000 delay-200 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            KPI Validation Platform
          </p>
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight mb-8 transition-all duration-1000 delay-400 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Your metrics
            <br />
            <span className="text-accent">are lying</span>
            <br />
            to you.
          </h1>
          <p
            className={`text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed mb-12 transition-all duration-1000 delay-600 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            /dev/truth validates every KPI against ground truth. Find the drift before it finds you.
          </p>
          <Link
            href="/dashboard"
            className={`group inline-flex items-center gap-3 text-lg border-b border-foreground pb-2 hover:text-accent hover:border-accent transition-all duration-1000 delay-800 ${
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Start validating
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-foreground/30 to-foreground/50 animate-pulse" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* Stats */}
      <ScrollReveal>
        <section className="border-t border-border/50 bg-background/40 backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "2M+", label: "KPIs validated daily" },
              { value: "0.02s", label: "Avg validation time" },
              { value: "847", label: "Silent errors caught" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-8 md:p-12 border-r border-border/50 last:border-r-0 border-b md:border-b-0 group hover:bg-foreground/5 transition-colors"
              >
                <p className="text-3xl md:text-5xl font-serif mb-2 group-hover:text-accent transition-colors">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* The Problem */}
      <ScrollReveal>
        <section className="py-32 px-6 md:px-12 bg-background/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">The Problem</p>
                <h2 className="text-4xl md:text-5xl font-serif leading-[1.1]">Every dashboard has a dirty secret.</h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Filters that exclude inconvenient data. Joins that silently drop rows. Calculations that made sense
                  once but drifted over time.
                </p>
                <p>
                  Your team makes decisions on these numbers every day. But when was the last time anyone checked if
                  they were true?
                </p>
                <p className="text-foreground font-medium">/dev/truth checks. Continuously.</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* How it works */}
      <ScrollReveal>
        <section className="py-32 px-6 md:px-12 bg-card/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-16">How It Works</p>

            <div className="space-y-0">
              {[
                {
                  num: "01",
                  title: "Connect your sources",
                  desc: "Point to your dashboards, BI tools, and raw data. We handle Looker, Tableau, Metabase, dbt, and raw SQL.",
                },
                {
                  num: "02",
                  title: "Define truth tests",
                  desc: "Declare what should be true about your KPIs. Revenue should match the sum of transactions. Churn should align with cancellations.",
                },
                {
                  num: "03",
                  title: "Validate continuously",
                  desc: "Tests run on schedule or on-demand. When a metric drifts from truth, you know immediately—with context.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-12 gap-6 py-12 border-b border-border/50 last:border-b-0 group hover:bg-foreground/5 transition-colors -mx-6 px-6"
                >
                  <div className="md:col-span-2">
                    <span className="text-6xl md:text-8xl font-serif text-foreground/10 group-hover:text-accent/30 transition-colors">
                      {step.num}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-2xl md:text-3xl font-medium">{step.title}</h3>
                  </div>
                  <div className="md:col-span-5 md:col-start-8">
                    <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className="py-32 px-6 md:px-12 bg-background/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-serif mb-8">Stop guessing.</h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-md mx-auto">
              Know your metrics are true, or know exactly why they're not.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-lg hover:bg-accent hover:scale-105 transition-all"
            >
              Enter /dev/truth
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 md:px-12 bg-background/70 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">/dev/truth</span>
          <span>© 2025</span>
        </div>
      </footer>
    </div>
  )
}

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      {children}
    </div>
  )
}
