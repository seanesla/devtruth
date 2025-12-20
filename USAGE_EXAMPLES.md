# ML + Gemini Integration - Usage Examples

Quick reference for using the ML and Gemini integration in your components.

## 1. Analyzing Voice Recordings

### Basic Inference

```typescript
"use client"

import { useState } from "react"
import { useInference } from "@/hooks/use-inference"
import type { AudioFeatures } from "@/lib/types"

export function VoiceAnalyzer() {
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null)
  const { metrics, isValid, error } = useInference(audioFeatures)

  // After extracting features from audio (via Meyda):
  const handleAnalyze = (extractedFeatures: AudioFeatures) => {
    setAudioFeatures(extractedFeatures)
  }

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {isValid && metrics && (
        <div>
          <h3>Analysis Results</h3>
          <p>Stress: {metrics.stressScore}/100 ({metrics.stressLevel})</p>
          <p>Fatigue: {metrics.fatigueScore}/100 ({metrics.fatigueLevel})</p>
          <p>Confidence: {Math.round(metrics.confidence * 100)}%</p>
        </div>
      )}
    </div>
  )
}
```

### Batch Analysis

```typescript
"use client"

import { useBatchInference } from "@/hooks/use-inference"
import type { Recording } from "@/lib/types"

export function RecordingHistory({ recordings }: { recordings: Recording[] }) {
  const metricsMap = useBatchInference(recordings)

  return (
    <div>
      {recordings.map((recording) => {
        const metrics = metricsMap.get(recording.id)
        return (
          <div key={recording.id}>
            <p>{new Date(recording.createdAt).toLocaleDateString()}</p>
            {metrics && (
              <p>Stress: {metrics.stressScore}, Fatigue: {metrics.fatigueScore}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

## 2. Generating Suggestions from Gemini

### Basic Usage

```typescript
"use client"

import { useState } from "react"
import { useSuggestions } from "@/hooks/use-suggestions"
import type { VoiceMetrics } from "@/lib/types"

export function SuggestionGenerator() {
  const { suggestions, loading, error, fetchSuggestions } = useSuggestions()

  const handleGenerate = async (metrics: VoiceMetrics) => {
    await fetchSuggestions(metrics, "declining")
  }

  return (
    <div>
      {loading && <p>Generating suggestions...</p>}
      {error && <p>Error: {error}</p>}
      {suggestions.map((suggestion) => (
        <div key={suggestion.id}>
          <h4>{suggestion.category}</h4>
          <p>{suggestion.content}</p>
          <p>{suggestion.duration} minutes</p>
        </div>
      ))}
    </div>
  )
}
```

### With Persistence (Recommended)

```typescript
"use client"

import { usePersistentSuggestions } from "@/hooks/use-suggestions"
import { Button } from "@/components/ui/button"

export function SuggestionsPage() {
  const {
    suggestions,
    loading,
    error,
    fetchSuggestions,
    updateSuggestion,
    clearSuggestions,
  } = usePersistentSuggestions()

  const handleAccept = (id: string) => {
    updateSuggestion(id, "accepted")
  }

  const handleDismiss = (id: string) => {
    updateSuggestion(id, "dismissed")
  }

  return (
    <div>
      {suggestions
        .filter((s) => s.status !== "dismissed")
        .map((suggestion) => (
          <div key={suggestion.id}>
            <p>{suggestion.content}</p>
            {suggestion.status === "pending" && (
              <>
                <Button onClick={() => handleAccept(suggestion.id)}>Accept</Button>
                <Button onClick={() => handleDismiss(suggestion.id)}>Dismiss</Button>
              </>
            )}
            {suggestion.status === "accepted" && <span>✓ Accepted</span>}
          </div>
        ))}
    </div>
  )
}
```

## 3. Burnout Prediction

### Calculate Prediction

```typescript
"use client"

import { useMemo } from "react"
import { predictBurnoutRisk, recordingsToTrendData } from "@/lib/ml/forecasting"
import type { Recording } from "@/lib/types"

export function BurnoutAlert({ recordings }: { recordings: Recording[] }) {
  const prediction = useMemo(() => {
    const trendData = recordingsToTrendData(recordings)
    return predictBurnoutRisk(trendData)
  }, [recordings])

  if (!prediction || prediction.riskLevel === "low") {
    return <p>✓ You're doing well!</p>
  }

  return (
    <div className={`alert alert-${prediction.riskLevel}`}>
      <h3>Burnout Risk: {prediction.riskLevel}</h3>
      <p>Risk Score: {prediction.riskScore}/100</p>
      <p>Trend: {prediction.trend}</p>
      <p>Predicted in {prediction.predictedDays} days</p>
      <ul>
        {prediction.factors.map((factor, i) => (
          <li key={i}>{factor}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Display with Styling

```typescript
"use client"

import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

const riskConfig = {
  low: { color: "text-green-500", icon: TrendingUp },
  moderate: { color: "text-yellow-500", icon: Minus },
  high: { color: "text-red-500", icon: TrendingDown },
  critical: { color: "text-red-700", icon: AlertTriangle },
}

export function BurnoutCard({ prediction }: { prediction: BurnoutPrediction }) {
  const config = riskConfig[prediction.riskLevel]
  const Icon = config.icon

  return (
    <div className={`card ${config.color}`}>
      <Icon className="h-8 w-8" />
      <h3>Risk: {prediction.riskLevel}</h3>
      <p>{prediction.riskScore}/100</p>
    </div>
  )
}
```

## 4. Complete Recording Flow

### From Recording to Suggestions

```typescript
"use client"

import { useState } from "react"
import { useInference } from "@/hooks/use-inference"
import { usePersistentSuggestions } from "@/hooks/use-suggestions"
import { predictBurnoutRisk } from "@/lib/ml/forecasting"
import type { AudioFeatures, Recording } from "@/lib/types"

export function RecordingWorkflow() {
  const [recording, setRecording] = useState<Recording | null>(null)
  const { metrics } = useInference(recording?.features)
  const { fetchSuggestions } = usePersistentSuggestions()

  const handleRecordingComplete = async (
    features: AudioFeatures,
    recordings: Recording[]
  ) => {
    // 1. Create recording with features
    const newRecording: Recording = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      duration: 45,
      status: "processing",
      features,
    }

    setRecording(newRecording)

    // 2. Inference happens automatically via useInference hook
    // Wait for metrics to be calculated
    if (metrics) {
      // 3. Save recording with metrics to IndexedDB
      newRecording.metrics = metrics
      newRecording.status = "complete"
      // await saveToIndexedDB(newRecording)

      // 4. Calculate burnout prediction from all recordings
      const allRecordings = [...recordings, newRecording]
      const trendData = allRecordings
        .filter((r) => r.metrics)
        .map((r) => ({
          date: r.createdAt.split("T")[0],
          stressScore: r.metrics!.stressScore,
          fatigueScore: r.metrics!.fatigueScore,
        }))

      const prediction = predictBurnoutRisk(trendData)

      // 5. If risk is elevated, fetch suggestions
      if (prediction.riskLevel !== "low") {
        await fetchSuggestions(metrics, prediction.trend)
      }
    }
  }

  return (
    <div>
      <h2>Record your voice</h2>
      {/* Recording UI here */}
    </div>
  )
}
```

## 5. Direct API Calls (Alternative to Hooks)

### Calling Gemini API Directly

```typescript
// Only use this if you need more control than the hooks provide

const response = await fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    stressScore: 75,
    stressLevel: "high",
    fatigueScore: 60,
    fatigueLevel: "tired",
    trend: "declining",
  }),
})

if (response.ok) {
  const { suggestions } = await response.json()
  console.log(`Received ${suggestions.length} suggestions`)
} else {
  const { error } = await response.json()
  console.error(`API error: ${error}`)
}
```

### Testing the API

```typescript
// Health check
const health = await fetch("/api/gemini")
const data = await health.json()
console.log(`API configured: ${data.configured}`)
```

## 6. Using with IndexedDB (Future Implementation)

### Save and Load Pattern

```typescript
// Example structure for IndexedDB integration

// Save recording with metrics
async function saveRecording(recording: Recording) {
  const db = await openDB("kanari", 1)
  await db.put("recordings", recording)
}

// Load all recordings
async function loadRecordings(): Promise<Recording[]> {
  const db = await openDB("kanari", 1)
  return db.getAll("recordings")
}

// Use in component
export function Dashboard() {
  const [recordings, setRecordings] = useState<Recording[]>([])

  useEffect(() => {
    loadRecordings().then(setRecordings)
  }, [])

  const metricsMap = useBatchInference(recordings)
  const prediction = useMemo(() => {
    const trendData = recordingsToTrendData(recordings)
    return predictBurnoutRisk(trendData)
  }, [recordings])

  return (
    <div>
      <BurnoutCard prediction={prediction} />
      <RecordingHistory recordings={recordings} metricsMap={metricsMap} />
    </div>
  )
}
```

## 7. Error Handling Patterns

### Graceful Degradation

```typescript
export function SmartComponent() {
  const { metrics, isValid, error: inferenceError } = useInference(features)
  const { suggestions, loading, error: apiError, fetchSuggestions } = useSuggestions()

  if (inferenceError) {
    return <p>Could not analyze audio. Please try recording again.</p>
  }

  if (!isValid) {
    return <p>Recording too short. Please record for at least 30 seconds.</p>
  }

  if (apiError) {
    return (
      <div>
        <p>Could not fetch suggestions: {apiError}</p>
        <button onClick={() => fetchSuggestions(metrics!, "stable")}>
          Retry
        </button>
      </div>
    )
  }

  // Normal flow
  return <div>...</div>
}
```

### Retry Logic

```typescript
async function fetchWithRetry(
  fetchFn: () => Promise<void>,
  maxRetries = 3
) {
  let attempt = 0
  while (attempt < maxRetries) {
    try {
      await fetchFn()
      return
    } catch (error) {
      attempt++
      if (attempt === maxRetries) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
}

// Usage
try {
  await fetchWithRetry(() => fetchSuggestions(metrics, trend))
} catch (error) {
  console.error("Failed after 3 retries:", error)
}
```

## 8. Performance Optimization

### Memoization

```typescript
import { useMemo } from "react"

export function OptimizedDashboard({ recordings }: { recordings: Recording[] }) {
  // Only recalculate when recordings array changes
  const trendData = useMemo(() => recordingsToTrendData(recordings), [recordings])
  const prediction = useMemo(() => predictBurnoutRisk(trendData), [trendData])

  // Batch inference is already memoized in the hook
  const metricsMap = useBatchInference(recordings)

  return <div>...</div>
}
```

### Conditional Fetching

```typescript
export function SuggestionFetcher({ metrics, prediction }) {
  const { fetchSuggestions } = usePersistentSuggestions()
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    // Only fetch if:
    // 1. Risk is elevated
    // 2. Haven't fetched yet
    // 3. Have valid metrics
    if (
      prediction.riskLevel !== "low" &&
      !hasFetched &&
      metrics
    ) {
      fetchSuggestions(metrics, prediction.trend)
      setHasFetched(true)
    }
  }, [prediction, metrics, hasFetched, fetchSuggestions])

  return null // Side-effect only component
}
```

## Common Patterns

### Pattern 1: Record → Analyze → Suggest
```typescript
1. User records voice → AudioFeatures extracted
2. useInference(features) → VoiceMetrics calculated
3. Save recording + features + metrics to IndexedDB
4. Load all recordings → calculate BurnoutPrediction
5. If elevated risk → fetchSuggestions()
```

### Pattern 2: Dashboard View
```typescript
1. Load recordings from IndexedDB
2. useBatchInference(recordings) → Map of metrics
3. recordingsToTrendData + predictBurnoutRisk → BurnoutPrediction
4. Display trends, prediction, and existing suggestions
```

### Pattern 3: Suggestion Management
```typescript
1. usePersistentSuggestions() → load from localStorage
2. Display pending/accepted suggestions
3. User accepts → updateSuggestion(id, "accepted")
4. User dismisses → updateSuggestion(id, "dismissed")
5. Suggestions auto-save to localStorage
```

## TypeScript Tips

### Type Imports
```typescript
import type {
  AudioFeatures,
  VoiceMetrics,
  Recording,
  BurnoutPrediction,
  Suggestion,
  TrendData,
} from "@/lib/types"
```

### Type Guards
```typescript
function hasMetrics(recording: Recording): recording is Recording & { metrics: VoiceMetrics } {
  return recording.metrics !== undefined
}

// Usage
const recordingsWithMetrics = recordings.filter(hasMetrics)
```

This should give you everything you need to integrate the ML and Gemini systems into your app!
