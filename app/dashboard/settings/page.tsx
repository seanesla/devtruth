import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { SettingsContent } from "@/components/dashboard/settings-content"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-border/40 bg-card/30 backdrop-blur-2xl px-6 lg:px-8">
          <h1 className="text-xl font-serif">Settings</h1>
        </header>
        <main className="p-6 lg:p-8">
          <SettingsContent />
        </main>
      </div>
    </div>
  )
}
