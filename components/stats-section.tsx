export function StatsSection() {
  const stats = [
    { value: "99.7%", label: "Accuracy rate" },
    { value: "2M+", label: "KPIs validated daily" },
    { value: "340+", label: "Data sources supported" },
    { value: "<50ms", label: "Average validation time" },
  ]

  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-semibold tracking-tight md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
