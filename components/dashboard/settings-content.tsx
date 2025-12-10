"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SettingsContent() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    slackAlerts: false,
    dailyDigest: true,
    autoRerun: true,
  })

  return (
    <div className="max-w-2xl space-y-8">
      {/* Notifications */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Notifications</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-alerts" className="text-base">
                Email Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for failing tests</p>
            </div>
            <Switch
              id="email-alerts"
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="slack-alerts" className="text-base">
                Slack Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Send alerts to your Slack channel</p>
            </div>
            <Switch
              id="slack-alerts"
              checked={settings.slackAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, slackAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-digest" className="text-base">
                Daily Digest
              </Label>
              <p className="text-sm text-muted-foreground">Get a daily summary of all test results</p>
            </div>
            <Switch
              id="daily-digest"
              checked={settings.dailyDigest}
              onCheckedChange={(checked) => setSettings({ ...settings, dailyDigest: checked })}
            />
          </div>
        </div>
      </div>

      {/* Test Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Test Configuration</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-rerun" className="text-base">
                Auto Re-run
              </Label>
              <p className="text-sm text-muted-foreground">Automatically re-run failing tests after 5 minutes</p>
            </div>
            <Switch
              id="auto-rerun"
              checked={settings.autoRerun}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRerun: checked })}
            />
          </div>

          <div>
            <Label className="text-base">Variance Threshold</Label>
            <p className="text-sm text-muted-foreground mb-3">Mark tests as warning when variance exceeds this value</p>
            <input
              type="text"
              defaultValue="5%"
              className="h-10 w-32 rounded-md border border-border bg-background px-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Connected Sources</h2>

        <div className="space-y-4">
          {["Looker", "Tableau", "Metabase"].map((source) => (
            <div
              key={source}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span>{source}</span>
              </div>
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            Add Data Source
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
      </div>
    </div>
  )
}
