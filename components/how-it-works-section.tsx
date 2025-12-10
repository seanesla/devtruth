export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect your data",
      description: "Link your dashboards and raw data sources. We support Looker, Tableau, Metabase, and 340+ more.",
    },
    {
      number: "02",
      title: "Define truth tests",
      description: "Set up validation rules for your KPIs. Compare dashboard values against ground truth calculations.",
    },
    {
      number: "03",
      title: "Monitor continuously",
      description: "Get real-time validation results. Know instantly when metrics drift or calculations break.",
    },
  ]

  return (
    <section id="how-it-works" className="border-y border-border bg-card/30 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">Get started in minutes, not months.</p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <span className="mb-4 block text-6xl font-semibold text-accent/20">{step.number}</span>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
