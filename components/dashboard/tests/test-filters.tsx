"use client"

import { Search, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TestStatus } from "@/lib/types"

interface TestFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: TestStatus | "all"
  onStatusChange: (value: TestStatus | "all") => void
  sourceFilter: string
  onSourceChange: (value: string) => void
  dateFilter: string
  onDateChange: (value: string) => void
  sources: string[]
  selectedCount: number
  onRunSelected: () => void
}

export function TestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  dateFilter,
  onDateChange,
  sources,
  selectedCount,
  onRunSelected,
}: TestFiltersProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 backdrop-blur-xl p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tests by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background/60 border-border/50 focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[160px] bg-background/60 border-border/50 hover:border-accent/30 transition-colors">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select value={sourceFilter} onValueChange={onSourceChange}>
          <SelectTrigger className="w-full lg:w-[160px] bg-background/60 border-border/50 hover:border-accent/30 transition-colors">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={onDateChange}>
          <SelectTrigger className="w-full lg:w-[160px] bg-background/60 border-border/50 hover:border-accent/30 transition-colors">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Run Selected Button */}
        <Button
          onClick={onRunSelected}
          disabled={selectedCount === 0}
          className="w-full lg:w-auto px-6 bg-accent/10 text-accent border border-accent/50 hover:bg-accent hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Selected
          {selectedCount > 0 && ` (${selectedCount})`}
        </Button>
      </div>
    </div>
  )
}
