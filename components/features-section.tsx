import { Shield, Zap, GitBranch, Bell } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Ground Truth Validation",
      description: "Compare dashboard KPIs against raw data sources. No more silent calculation errors.",
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Continuous validation with instant alerts when metrics drift from expected values.",
    },
    {
      icon: GitBranch,
      title: "Lineage Tracking",
      description: "Trace every metric back to its source. Understand exactly how numbers are calculated.",
    },
    {
      icon: Bell,
      title: "Smart Alerting",
      description: "Context-aware notifications that distinguish noise from genuine data quality issues.",
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl text-balance">
            Everything you need to trust your data
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for teams who can't afford to make decisions on bad data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-lg border border-border bg-card p-8 transition-all hover:border-accent/50 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
