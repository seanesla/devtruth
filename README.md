# kanari

**A browser-based early warning system for burnout that analyzes your voice, predicts risk 3-7 days ahead, and schedules recovery time on your calendar.**

[![Gemini 3 Hackathon](https://img.shields.io/badge/Google%20DeepMind-Gemini%203%20Hackathon-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Browser-orange?style=flat-square)]()

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Gemini 3 Integration](#gemini-3-integration)
4. [Key Differentiators](#key-differentiators)
5. [How It Works](#how-it-works)
6. [Technology Stack](#technology-stack)
7. [Privacy Architecture](#privacy-architecture)
8. [Getting Started](#getting-started)
9. [Project Structure](#project-structure)
10. [Links](#links)
11. [Team](#team)
12. [License](#license)

---

## Problem Statement

Burnout is widespread. Gallup reports 76% of employees experience burnout at least sometimes, with 28% reporting they feel burned out "very often" or "always." But most people only recognize burnout after the damage is done. Traditional self-reporting tools are unreliable because people experiencing burnout often lack the self-awareness to accurately assess their state.

Existing solutions fall into two categories:

| Category | Examples | Limitations |
|----------|----------|-------------|
| Clinical voice biomarker platforms | Sonde Health, Kintsugi, Ellipsis Health | Primarily enterprise/B2B focused, require cloud processing |
| Consumer wellness apps | Earkick, voice journaling apps | React to current mood only, no predictive forecasting, require app installation |

**Gap:** We have not found an existing solution that combines browser-based access, client-side privacy, predictive forecasting, and calendar integration.

---

## Solution Overview

kanari is a privacy-first web application that helps remote workers, students, and professionals detect early signs of burnout through short daily voice recordings.

Users record 30-60 seconds describing their day. The app analyzes vocal biomarkers entirely within the browser, predicts burnout risk for the next 3-7 days, and optionally schedules recovery time on the user's calendar.

**Core capabilities:**

- Voice analysis for stress and fatigue biomarkers (speech rate, volume fluctuations, pause patterns, spectral energy, MFCCs)
- Longitudinal trend tracking across multiple sessions
- 3-7 day predictive risk forecasting
- Gemini 3-powered personalized intervention suggestions
- Calendar integration for proactive scheduling of recovery blocks

---

## Gemini 3 Integration

kanari uses a **hybrid analysis approach** that combines local acoustic processing with Gemini 3 Flash's multimodal capabilities. This architecture leverages each tool's strengths:

| Task | Tool | Why |
|------|------|-----|
| MFCCs, spectral features, RMS | **Meyda (local)** | Designed for DSP, precise numerical values |
| Speech rate, pause patterns | **Local heuristics** | Fast, accurate, no API latency |
| Emotion detection | **Gemini 3 Flash** | Native multimodal audio understanding |
| Semantic stress/fatigue cues | **Gemini 3 Flash** | Language + tone understanding |
| Personalized suggestions | **Gemini 3 Flash** | Context-aware generation |

### How Gemini 3 is Used

**1. Audio Semantic Analysis**

Gemini 3 Flash analyzes voice recordings for emotional content and semantic stress/fatigue cues:

- **Transcription with timestamps** - Speech segments broken into logical chunks
- **Emotion detection** - Per-segment emotion classification (happy, sad, angry, neutral)
- **Semantic observations** - Qualitative cues like rushed delivery, hesitations, monotone voice
- **Stress/fatigue interpretation** - Natural language explanation of indicators

This complements local acoustic analysis which extracts precise numerical features but cannot understand semantic content.

**2. Personalized Suggestion Generation**

When vocal biomarkers indicate elevated stress, Gemini 3 generates context-aware recovery suggestions based on:

- Current stress/fatigue score (from hybrid analysis)
- Trend direction and duration
- Time of day and day of week
- Upcoming calendar density (if calendar is connected)

**3. Calendar Action Generation**

When the user opts to schedule recovery time, Gemini 3 generates appropriate calendar event details (title, duration, description) based on the specific intervention recommended.

### Hybrid Scoring

Final scores combine acoustic and semantic analysis with weighted blending:

- **70% weight**: Acoustic features (objective, precise measurements)
- **30% weight**: Semantic adjustments from Gemini (contextual refinement)

This approach ensures reliable baseline scores from local analysis while incorporating Gemini's understanding of semantic content and emotional tone.

### Example: Audio Analysis Request

```javascript
const response = await fetch('/api/gemini/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    audioData: audioBase64,  // Base64-encoded audio
    mimeType: 'audio/webm'
  })
});

// Response includes:
// - segments: Transcript with timestamps and per-segment emotion
// - observations: Semantic stress/fatigue cues with relevance levels
// - stressInterpretation: Qualitative stress assessment
// - fatigueInterpretation: Qualitative fatigue assessment
// - summary: Overall emotional state assessment
```

---

## Key Differentiators

Based on competitive analysis of the voice biomarker and mental wellness market:

| Differentiator | kanari | Competitors |
|----------------|----------------|-------------|
| **Platform** | Browser (any device, no install) | Native apps or enterprise APIs |
| **Processing** | Entirely client-side | Cloud-based |
| **Prediction** | 3-7 day forecasting | Current state only |
| **Calendar Integration** | Auto-schedules recovery blocks | Display only or none |
| **Access Model** | Free, no account required | Subscription or enterprise license |

**Why these matter:**

- **Browser-based:** Zero friction adoption. Works on Chromebooks, locked-down work laptops, borrowed devices.
- **Predictive:** The difference between "you seem stressed" and "you're heading toward high burnout risk by Thursday" is the difference between a mood tracker and a prevention tool.
- **Calendar integration:** Closes the "so what" loop. Does not just tell you to take a break; schedules it.
- **Client-side:** For users who care about privacy, "never leaves your device" is categorically different from "encrypted in transit."

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   1. RECORD          2. ANALYZE              3. COMBINE       4. ACT       │
│                                                                             │
│   ┌─────────┐       ┌─────────────┐         ┌──────────┐    ┌─────────┐   │
│   │  30-60  │       │ LOCAL       │         │  Hybrid  │    │ Gemini 3│   │
│   │ seconds │──┬───▶│ Meyda +     │────────▶│  70/30   │───▶│ Suggests│   │
│   │  voice  │  │    │ Heuristics  │         │  Blend   │    │ Actions │   │
│   └─────────┘  │    └─────────────┘         └──────────┘    └─────────┘   │
│                │           │                      │               │        │
│                │           ▼                      ▼               ▼        │
│                │    ┌─────────────┐         ┌──────────┐    ┌─────────┐   │
│                │    │ Acoustic    │         │ IndexedDB│    │ Google  │   │
│                │    │ Breakdown   │         │ (local)  │    │ Calendar│   │
│                │    └─────────────┘         └──────────┘    └─────────┘   │
│                │                                                           │
│                │    ┌─────────────┐                                       │
│                └───▶│ GEMINI 3    │                                       │
│                     │ - Emotion   │─────────────────┘                     │
│                     │ - Semantic  │                                       │
│                     └─────────────┘                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Step 1: Record**
User speaks naturally for 30-60 seconds about their day, current state, or anything on their mind. The prompt is intentionally open-ended to capture natural speech patterns.

**Step 2: Analyze (Parallel Processing)**
Two analyses run in parallel:

**Local Acoustic Analysis:**
- Meyda extracts vocal biomarkers (MFCCs, spectral centroid, spectral flux, RMS, ZCR)
- Heuristics calculate stress/fatigue scores from acoustic features
- Provides transparent breakdown of which features contributed to scores

**Gemini Semantic Analysis:**
- Transcribes audio with timestamps
- Detects emotion per segment (happy, sad, angry, neutral)
- Identifies semantic stress/fatigue cues (rushed speech, hesitations, monotone)
- Provides qualitative interpretation of vocal patterns

**Step 3: Combine**
Hybrid scoring combines both analyses with weighted blending:
- **70% acoustic** (objective, precise measurements)
- **30% semantic** (contextual refinement from Gemini)

Scores are compared against historical baseline stored in IndexedDB.

**Step 4: Act**
Gemini 3 generates personalized intervention suggestions based on hybrid scores. If the user connects their calendar, the app can automatically schedule recovery blocks.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19.x | Component-based UI |
| Tailwind CSS 4.x | Utility-first styling |
| Framer Motion | Animations and transitions |
| Recharts | Trend visualization |

### Audio Processing

| Technology | Purpose |
|------------|---------|
| Web Audio API | Microphone access and real-time capture |
| Meyda | Audio feature extraction (MFCCs, spectral centroid, RMS, spectral flux) |
| @ricky0123/vad-web | Voice activity detection using Silero VAD via ONNX |

### Analysis

| Technology | Purpose |
|------------|---------|
| Local heuristics | Research-backed stress/fatigue scoring from acoustic features |
| Gemini 3 Flash | Multimodal audio analysis for emotion detection and semantic cues |
| ONNX Runtime Web | WebAssembly-based model execution for Silero VAD |

### Storage and Integration

| Technology | Purpose |
|------------|---------|
| IndexedDB | Local storage for historical data |
| Web Crypto API | AES-GCM encryption for stored metrics |
| Google Calendar API v3 | Recovery block scheduling |

### AI

| Technology | Purpose |
|------------|---------|
| Gemini 3 API | Personalized suggestion generation and pattern interpretation |

---

## Privacy Architecture

kanari uses a hybrid analysis approach with clear privacy boundaries:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │   Audio ──▶ Meyda Features ──▶ Acoustic Scores           │  │
│  │      │                              │                     │  │
│  │      │                              ▼                     │  │
│  │      │                     Encrypted Storage (IndexedDB)  │  │
│  │      │                                                    │  │
│  └──────│────────────────────────────────────────────────────┘  │
└─────────│───────────────────────────────────────────────────────┘
          │
          │ Audio (for semantic analysis)
          ▼
┌─────────────────┐
│  Gemini 3 API   │
│  - Emotion      │ ──▶ Semantic Analysis
│  - Transcription│     (not stored by API)
│  - Cues         │
└─────────────────┘
```

**Processed locally (never leaves device):**
- Raw audio for acoustic feature extraction (MFCCs, spectral features, RMS)
- Speech rate and pause pattern calculation
- Acoustic stress/fatigue scores
- Historical trend data (encrypted in IndexedDB)

**Sent to Gemini API:**
- Audio recording (for emotion detection and semantic analysis)
- Processed per [Gemini API data usage policy](https://ai.google.dev/gemini-api/terms)
- Not used for model training

**What Gemini receives:**
- Audio content for semantic analysis
- Request for emotion/stress analysis

**What is never collected:**
- Personal identifiers
- Location data
- Account information (no login required)

---

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- Modern browser: Chrome 111+, Safari 16.4+, Firefox 128+ (required by Tailwind CSS v4)
- Microphone access
- Gemini API key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd kanari

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
kanari/
├── public/
│   └── models/              # ONNX models for VAD and emotion recognition
├── app/
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout with providers
│   ├── globals.css          # Global styles and CSS variables
│   └── dashboard/
│       ├── page.tsx         # Dashboard overview with trends
│       ├── record/          # Voice recording interface
│       ├── history/         # Recording history
│       ├── suggestions/     # Gemini-powered recommendations
│       └── settings/        # App settings and integrations
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── scene/               # 3D background (React Three Fiber)
│   └── dashboard/           # Dashboard-specific components
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── utils.ts             # Utility functions
│   ├── constants.ts         # App constants
│   ├── scene-context.tsx    # 3D scene state management
│   └── navbar-context.tsx   # Navigation state
└── README.md
```

---

## Links

| Resource | URL |
|----------|-----|
| Live Demo | [TO BE ADDED] |
| Demo Video | [TO BE ADDED] |
| Code Repository | [TO BE ADDED] |
| Devpost Submission | [TO BE ADDED] |

---

## Team

| Name | Role | Contact |
|------|------|---------|
| [TO BE ADDED] | [TO BE ADDED] | [TO BE ADDED] |

---

## Hackathon Submission Details

**Hackathon:** Google DeepMind Gemini 3 Hackathon

**Submission Period:** December 17, 2025 - February 9, 2026

**Gemini 3 Features Used:**
- **Multimodal audio analysis** for emotion detection and semantic stress/fatigue cues
- **Structured JSON output** for transcript segments, observations, and interpretations
- **Text generation** for personalized wellness interventions
- **Pattern analysis** for burnout trend interpretation

**Judging Criteria Addressed:**

| Criterion | Weight | How Addressed |
|-----------|--------|---------------|
| Technical Execution | 40% | Client-side ML pipeline, Gemini 3 integration, calendar API |
| Innovation/Wow Factor | 30% | Browser-based burnout predictor with predictive forecasting and calendar integration |
| Potential Impact | 20% | Addresses widespread employee burnout (76% affected per Gallup) |
| Presentation/Demo | 10% | Clear problem definition, architectural diagram, live demo |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Disclaimer

kanari is a wellness tool, not a medical device. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. If you are experiencing severe stress, anxiety, depression, or other mental health concerns, please consult a qualified healthcare professional.
