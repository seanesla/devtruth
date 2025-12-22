"use client"

import { cn } from "@/lib/utils"
import { CalendarEventBlock } from "./calendar-event-block"
import type { Suggestion } from "@/lib/types"

interface CalendarDayColumnProps {
  date: Date
  events: Suggestion[]
  onEventClick?: (suggestion: Suggestion) => void
  onTimeSlotClick?: (date: Date, hour: number) => void
}

// Time slots from 8 AM to 8 PM (12 hours)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => i + 8)

export function CalendarDayColumn({
  date,
  events,
  onEventClick,
  onTimeSlotClick,
}: CalendarDayColumnProps) {
  const isToday = isSameDay(date, new Date())
  const dayName = date.toLocaleDateString(undefined, { weekday: "short" })
  const dayNumber = date.getDate()

  return (
    <div className="flex flex-col min-w-[60px] flex-1">
      {/* Day header */}
      <div className={cn(
        "text-center py-2 border-b border-border/50",
        isToday && "bg-accent/10"
      )}>
        <div className="text-[10px] uppercase text-muted-foreground">
          {dayName}
        </div>
        <div className={cn(
          "text-sm font-medium",
          isToday && "text-accent"
        )}>
          {dayNumber}
        </div>
      </div>

      {/* Time slots */}
      <div className="relative flex-1">
        {TIME_SLOTS.map((hour) => {
          const isCurrentHour = isToday && new Date().getHours() === hour

          return (
            <button
              key={hour}
              onClick={() => onTimeSlotClick?.(date, hour)}
              className={cn(
                "w-full h-12 border-b border-border/80 flex items-center justify-center",
                "hover:bg-accent/5 transition-colors",
                "focus:outline-none focus:bg-accent/10",
                isCurrentHour && "bg-accent/10"
              )}
              aria-label={`Schedule at ${formatHour(hour)} on ${date.toDateString()}`}
            >
              {isCurrentHour && (
                <span className="text-[10px] font-medium text-accent uppercase tracking-wide">
                  Now
                </span>
              )}
            </button>
          )
        })}

        {/* Event blocks */}
        {events.map((event) => {
          const startHour = event.scheduledFor
            ? new Date(event.scheduledFor).getHours()
            : 9 // Default to 9 AM

          return (
            <CalendarEventBlock
              key={event.id}
              title={event.content}
              category={event.category}
              startHour={startHour}
              duration={event.duration}
              onClick={() => onEventClick?.(event)}
            />
          )
        })}

      </div>
    </div>
  )
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour} ${suffix}`
}
