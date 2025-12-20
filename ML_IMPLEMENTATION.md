# ML + Gemini Integration Implementation Guide

This document describes the complete ML and Gemini integration for the kanari burnout detection system.

## Overview

The implementation consists of three main subsystems:
1. **Heuristic-based inference** - Client-side stress/fatigue classification
2. **Burnout forecasting** - Predictive risk analysis from historical trends
3. **Gemini-powered suggestions** - Personalized recovery recommendations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client-Side Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Audio Recording → Feature Extraction → ML Inference        │
│       (Web Audio)      (Meyda)           (lib/ml/)          │
│                                                              │
│  Historical Data → Forecasting → Burnout Prediction         │
│    (IndexedDB)     (lib/ml/)                                │
│                                                              │
│  Metrics + Trend → API Call → Gemini → Suggestions          │
│                  (/api/gemini)  (Cloud)  (Response)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Files Created

### 1. `/lib/ml/inference.ts`
**Purpose:** Heuristic-based stress and fatigue classification

**Key Functions:**
- `analyzeVoiceMetrics(features: AudioFeatures): VoiceMetrics`
  - Main inference function
  - Takes audio features, returns stress/fatigue scores and levels

- `validateFeatures(features: AudioFeatures): boolean`
  - Validates audio features before analysis
  - Ensures data quality for reliable results

**Research-Backed Heuristics:**
- **Stress indicators:**
  - High speech rate (>5.5 syllables/sec)
  - High RMS energy/variance (loud, intense speech)
  - High spectral flux (rapid spectral changes)
  - High zero crossing rate (vocal tension)

- **Fatigue indicators:**
  - Low speech rate (<3 syllables/sec)
  - Low RMS energy (quiet, weak voice)
  - High pause ratio (frequent breaks)
  - Low spectral centroid (less bright voice)

**Score Ranges:**
- Stress: 0-100 (low < 30 < moderate < 50 < elevated < 70 < high)
- Fatigue: 0-100 (rested < 30 < normal < 50 < tired < 70 < exhausted)
- Confidence: 0-1 (based on data quality)

**Example Usage:**
```typescript
import { analyzeVoiceMetrics, validateFeatures } from "@/lib/ml/inference"

if (validateFeatures(audioFeatures)) {
  const metrics = analyzeVoiceMetrics(audioFeatures)
  console.log(`Stress: ${metrics.stressScore}/100 (${metrics.stressLevel})`)
  console.log(`Fatigue: ${metrics.fatigueScore}/100 (${metrics.fatigueLevel})`)
}
```

### 2. `/lib/ml/forecasting.ts`
**Purpose:** 3-7 day burnout risk prediction using trend analysis

**Key Functions:**
- `predictBurnoutRisk(trendData: TrendData[]): BurnoutPrediction`
  - Main forecasting function
  - Analyzes historical stress/fatigue trends
  - Returns risk score, level, predicted days, and contributing factors

- `recordingsToTrendData(recordings): TrendData[]`
  - Helper to convert Recording objects to trend data format

**Algorithm:**
1. Calculate linear regression slope (trend direction)
2. Compute volatility (standard deviation)
3. Compare recent vs overall averages
4. Generate risk score (0-100) from multiple factors:
   - Recent average (40% weight)
   - Upward trend (30% weight)
   - Volatility (20% weight)
   - Recent vs overall comparison (10% weight)

**Risk Levels:**
- Low: 0-34 (7 days forecast)
- Moderate: 35-54 (5-7 days)
- High: 55-74 (3-5 days)
- Critical: 75-100 (3 days)

**Example Usage:**
```typescript
import { predictBurnoutRisk, recordingsToTrendData } from "@/lib/ml/forecasting"

const trendData = recordingsToTrendData(recordings)
const prediction = predictBurnoutRisk(trendData)

console.log(`Risk: ${prediction.riskScore}/100 (${prediction.riskLevel})`)
console.log(`Predicted in ${prediction.predictedDays} days`)
console.log(`Trend: ${prediction.trend}`)
console.log(`Factors: ${prediction.factors.join(", ")}`)
```

### 3. `/lib/gemini/prompts.ts`
**Purpose:** Prompt engineering for Gemini API

**Key Components:**
- `SYSTEM_PROMPT` - Establishes Gemini's role as wellness assistant
- `generateUserPrompt(context)` - Creates user prompt with wellness data
- `buildWellnessContext(...)` - Builds context object with time/day info

**Privacy Guarantees:**
- Only sends numerical scores (stress/fatigue 0-100)
- Only sends categorical levels (low/moderate/elevated/high)
- NEVER sends audio data or transcripts
- Includes time of day and day of week for context

**Example Usage:**
```typescript
import { buildWellnessContext, generateUserPrompt } from "@/lib/gemini/prompts"

const context = buildWellnessContext(75, "high", 60, "tired", "declining")
const userPrompt = generateUserPrompt(context)
// Prompt includes: stress=75 (high), fatigue=60 (tired), trend=declining, afternoon, weekday
```

### 4. `/lib/gemini/client.ts`
**Purpose:** Server-side Gemini API client

**Key Functions:**
- `callGeminiAPI(apiKey, request): Promise<GeminiResponse>`
  - Low-level API call wrapper
  - Handles HTTP communication with Gemini

- `generateSuggestions(apiKey, systemPrompt, userPrompt): Promise<GeminiSuggestionRaw[]>`
  - High-level function to generate suggestions
  - Parses and validates JSON response

- `validateAPIKey(apiKey): string`
  - Validates API key format and existence

**Configuration:**
- Model: `gemini-2.0-flash-exp`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`
- Temperature: 0.8 (balanced creativity)
- Response format: `application/json`

**Security:**
- Only used server-side (Next.js API routes)
- API key stored in `process.env.GEMINI_API_KEY`
- Never exposed to client

### 5. `/app/api/gemini/route.ts`
**Purpose:** Next.js API route for Gemini suggestions

**Endpoints:**

**POST /api/gemini**
```typescript
// Request
{
  stressScore: number,      // 0-100
  stressLevel: StressLevel, // "low" | "moderate" | "elevated" | "high"
  fatigueScore: number,     // 0-100
  fatigueLevel: FatigueLevel, // "rested" | "normal" | "tired" | "exhausted"
  trend: TrendDirection     // "improving" | "stable" | "declining"
}

// Response (success)
{
  suggestions: Suggestion[]
}

// Response (error)
{
  error: string,
  details?: string
}
```

**GET /api/gemini**
```typescript
// Health check
{
  status: "ok",
  configured: boolean,
  endpoint: "/api/gemini",
  methods: ["POST"]
}
```

**Validation:**
- All required fields present and correct type
- Scores in valid range (0-100)
- Categorical values match allowed enums
- Returns 400 for invalid requests
- Returns 502 for Gemini API errors

**Example Usage:**
```typescript
const response = await fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    stressScore: 75,
    stressLevel: "high",
    fatigueScore: 60,
    fatigueLevel: "tired",
    trend: "declining"
  })
})

const { suggestions } = await response.json()
```

### 6. `/hooks/use-inference.ts`
**Purpose:** React hook for ML inference

**Hook: `useInference(features)`**
```typescript
const { metrics, isValid, error } = useInference(audioFeatures)

// Returns:
// - metrics: VoiceMetrics | null
// - isValid: boolean
// - error: string | null
```

**Hook: `useBatchInference(recordings)`**
```typescript
const metricsMap = useBatchInference(recordings)
// Returns: Map<recordingId, VoiceMetrics>
```

**Features:**
- Automatic memoization (only recomputes when features change)
- Feature validation
- Error handling
- Client-side only

### 7. `/hooks/use-suggestions.ts`
**Purpose:** React hook for Gemini suggestions

**Hook: `useSuggestions()`**
```typescript
const {
  suggestions,        // Suggestion[]
  loading,           // boolean
  error,            // string | null
  fetchSuggestions, // (metrics, trend) => Promise<void>
  updateSuggestion, // (id, status) => void
  clearSuggestions  // () => void
} = useSuggestions()
```

**Hook: `usePersistentSuggestions(storageKey?)`**
- Same API as `useSuggestions()`
- Persists suggestions to localStorage
- Loads on mount
- Appends new suggestions to existing ones

**Example Usage:**
```typescript
const { suggestions, loading, error, fetchSuggestions, updateSuggestion } = usePersistentSuggestions()

// Fetch new suggestions
await fetchSuggestions(voiceMetrics, "declining")

// Accept a suggestion
updateSuggestion(suggestionId, "accepted")

// Dismiss a suggestion
updateSuggestion(suggestionId, "dismissed")
```

### 8. `/app/dashboard/suggestions/page.tsx`
**Updates:** Real Gemini integration with UI

**Features:**
- Loads suggestions from localStorage (persistent)
- Displays loading state during API calls
- Shows error messages if API fails
- Suggestion cards with:
  - Category icon and color coding
  - Duration estimate
  - Content and rationale
  - Accept/Dismiss buttons
  - Status badges (pending/accepted)
  - Schedule button for accepted suggestions

**Category Icons:**
- Break: Coffee
- Exercise: Dumbbell
- Mindfulness: Brain
- Social: Users
- Rest: Calendar

**Category Colors:**
- Break: Accent (amber)
- Exercise: Success (green)
- Mindfulness: Purple
- Social: Blue
- Rest: Amber

### 9. `/app/dashboard/page.tsx`
**Updates:** Burnout prediction display

**Features:**
- Calculates burnout prediction from historical data
- Risk level visual indicators:
  - Low: Green, TrendingUp icon
  - Moderate: Amber, Minus icon
  - High: Red, TrendingDown icon
  - Critical: Red, AlertTriangle icon
- Displays:
  - Risk score (0-100)
  - Forecast window (3-7 days)
  - Trend direction
  - Contributing factors
  - Confidence level
- Action buttons for high-risk users:
  - View Suggestions
  - Record Check-in

## Setup Instructions

### 1. Install Dependencies
No additional dependencies needed beyond existing Next.js/React/TypeScript setup.

### 2. Set Up Gemini API Key

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=AIza...your-key-here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Test the API Route

```bash
# Health check
curl http://localhost:3000/api/gemini

# Test suggestion generation
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "stressScore": 75,
    "stressLevel": "high",
    "fatigueScore": 60,
    "fatigueLevel": "tired",
    "trend": "declining"
  }'
```

## Integration with Recording Flow

The complete flow once audio recording is implemented:

```
1. User records 30-60 second voice sample
   ↓
2. Meyda extracts AudioFeatures (MFCCs, spectral features, RMS, etc.)
   ↓
3. useInference() analyzes features → VoiceMetrics
   ↓
4. Save Recording + AudioFeatures + VoiceMetrics to IndexedDB
   ↓
5. Load historical recordings
   ↓
6. predictBurnoutRisk() analyzes trend → BurnoutPrediction
   ↓
7. If risk elevated, fetchSuggestions() calls Gemini → Suggestions
   ↓
8. Display metrics, prediction, and suggestions in dashboard
```

## Testing Strategy

### Unit Tests (To Be Implemented)

**lib/ml/inference.test.ts:**
```typescript
test("high stress indicators produce high stress score", () => {
  const features = {
    speechRate: 6.0,        // Fast
    rms: 0.35,              // Loud
    spectralFlux: 0.2,      // Dynamic
    zcr: 0.1,               // High
    // ... other features
  }
  const metrics = analyzeVoiceMetrics(features)
  expect(metrics.stressScore).toBeGreaterThan(60)
  expect(metrics.stressLevel).toBe("high")
})
```

**lib/ml/forecasting.test.ts:**
```typescript
test("declining trend produces higher risk score", () => {
  const decliningData = [
    { date: "2025-01-01", stressScore: 40, fatigueScore: 40 },
    { date: "2025-01-02", stressScore: 50, fatigueScore: 50 },
    { date: "2025-01-03", stressScore: 60, fatigueScore: 60 },
    { date: "2025-01-04", stressScore: 70, fatigueScore: 70 },
  ]
  const prediction = predictBurnoutRisk(decliningData)
  expect(prediction.trend).toBe("declining")
  expect(prediction.riskScore).toBeGreaterThan(50)
})
```

### Integration Tests

**app/api/gemini/route.test.ts:**
```typescript
test("POST /api/gemini returns valid suggestions", async () => {
  const response = await fetch("http://localhost:3000/api/gemini", {
    method: "POST",
    body: JSON.stringify({
      stressScore: 75,
      stressLevel: "high",
      fatigueScore: 60,
      fatigueLevel: "tired",
      trend: "declining"
    })
  })

  const data = await response.json()
  expect(response.ok).toBe(true)
  expect(data.suggestions).toBeDefined()
  expect(data.suggestions.length).toBeGreaterThan(0)

  const suggestion = data.suggestions[0]
  expect(suggestion.content).toBeDefined()
  expect(suggestion.rationale).toBeDefined()
  expect(suggestion.duration).toBeGreaterThan(0)
  expect(suggestion.category).toMatch(/^(break|exercise|mindfulness|social|rest)$/)
})
```

## Performance Considerations

### Client-Side Inference
- Heuristic calculations are lightweight (<1ms)
- No TensorFlow.js bundle needed (saves ~1MB)
- Runs synchronously without blocking UI

### Forecasting
- Linear regression is O(n) where n = number of data points
- Typically <10ms for 14 days of data
- Can be memoized based on data hash

### Gemini API Calls
- Typical response time: 1-3 seconds
- Rate limit: 15 requests/minute (free tier)
- Consider implementing:
  - Request debouncing (don't spam API)
  - Caching (same metrics = same suggestions for 1 hour)
  - Fallback suggestions if API fails

## Privacy & Security

### What Leaves the Device
- ✅ Numerical scores (stress/fatigue 0-100)
- ✅ Categorical levels (low/moderate/elevated/high)
- ✅ Trend direction (improving/stable/declining)
- ✅ Time of day and day of week

### What Stays Local
- ❌ Audio recordings (NEVER sent to server)
- ❌ Audio features (NEVER sent to server)
- ❌ Voice transcripts (not even extracted)
- ❌ Personal identifiers

### API Key Security
- Stored in environment variables (not in code)
- Only accessible server-side
- Never exposed to client
- Rotate regularly

## Future Enhancements

### Phase 2: Advanced ML
- Train TensorFlow.js model on larger dataset
- Add voice quality features (jitter, shimmer)
- Personalized baseline calibration
- Multi-day pattern detection

### Phase 3: Calendar Integration
- Google Calendar API integration
- Auto-schedule recovery blocks
- Conflict detection and resolution
- Calendar event creation from suggestions

### Phase 4: Longitudinal Analysis
- Weekly/monthly trend reports
- Correlation with calendar events (meetings, deadlines)
- Effectiveness tracking (did suggestions help?)
- Personalized intervention timing

## Troubleshooting

### Gemini API Returns 400
- Check API key is valid and active
- Verify request payload matches expected format
- Check API quota limits

### Inference Returns Low Confidence
- Ensure recording is >30 seconds
- Check audio quality (not too quiet)
- Verify sufficient speech (pauseCount > 2)
- Check microphone permissions

### Suggestions Not Persisting
- Check localStorage is enabled
- Verify browser storage quota not exceeded
- Check for console errors during save

### Burnout Prediction Shows "Insufficient Data"
- Need at least 2 recordings with metrics
- Ideally 7-14 days of data for accuracy
- Check recordings have valid metrics attached

## Support

For questions or issues:
1. Check implementation comments in source files
2. Review type definitions in `/lib/types.ts`
3. Test API route with curl/Postman
4. Check browser console for errors
5. Verify Gemini API key is configured

## License

This implementation is part of the kanari project for Google DeepMind Gemini 3 Hackathon 2025.
