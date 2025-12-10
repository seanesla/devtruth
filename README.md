```
     ____             __              __  __  
    / __ \___ _   __ / /_ _____ __ __/ /_/ /_ 
   / / / / _ \ | / // __// ___// // / __/ __ \
  / /_/ /  __/ |/ // /_ / /   / // / /_/ / / /
 /_____/\___/|___/ \__//_/    \___/\__/_/ /_/ 
                                              
```

<div align="center">

**Semantic Unit Tests for KPIs**

*Tableau Hackathon 2025 Submission*

---

`Tableau Next` | `Tableau Cloud` | `Semantic Models` | `VizQL Data Service`

---

</div>

## Overview

A prototype that keeps KPIs consistent across Tableau dashboards by turning KPI definitions in **Tableau Next Semantic Models** into automated "tests".

<br>

## The Problem

<table>
<tr>
<td width="100%">

> *Two dashboards show "Revenue". Both look correct.*
> *But one includes refunds and one doesn't.*

</td>
</tr>
</table>

Over time, copies, tweaks, and quick fixes cause **metric drift**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Same KPI name    →    Different meanings    →    Lost trust    │
└─────────────────────────────────────────────────────────────────┘
```

Fixing it by hand is time-consuming and easy to miss.

**/dev/truth** helps by regularly checking dashboards against the official KPI definition.

<br>

## How It Works

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│  Semantic Model  │ ──── │  /dev/truth      │ ──── │  Dashboard       │
│  (Source of      │      │  (Comparison     │      │  (What users     │
│   Truth)         │      │   Engine)        │      │   actually see)  │
│                  │      │                  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                         │                         │
        │                         ▼                         │
        │              ┌──────────────────┐                 │
        └───────────── │   Pass / Fail    │ ────────────────┘
                       │   Report         │
                       └──────────────────┘
```

<br>

#### Step by Step

| Step | Action |
|:----:|--------|
| `01` | Reads KPI definitions from a Tableau Next **Semantic Model** |
| `02` | Queries selected dashboards/views using **VizQL Data Service** |
| `03` | Compares the results to the semantic definition |
| `04` | Flags potential issues with explanations |

<br>

## Platforms Used

```
┌────────────────────────────────────────────────────────────────┐
│  TABLEAU NEXT                                                  │
│  └── Semantic Models (the "source of truth" for KPIs)         │
├────────────────────────────────────────────────────────────────┤
│  TABLEAU CLOUD                                                 │
│  └── VizQL Data Service (query dashboard data programmatically)│
└────────────────────────────────────────────────────────────────┘
```

<br>

## Target Users

| Audience | Use Case |
|----------|----------|
| **Business users / leaders** | Quick reassurance that a key KPI is being used consistently |
| **Analysts / BI developers** | Faster way to find dashboards that accidentally drifted from the agreed definition |
| **Data governance / CoE teams** | Lightweight connection between Semantic Models and real dashboards |

<br>

## Example Workflow

```
1. Define official KPIs in Tableau Next Semantic Model
                          │
                          ▼
2. Select KPIs and dashboards to check in /dev/truth
                          │
                          ▼
3. Run tests
                          │
                          ▼
4. Review results
   ┌────────────────────────────────────────────────────────────┐
   │  [PASS]  Executive Revenue Overview                        │
   │          matches semantic Revenue                          │
   ├────────────────────────────────────────────────────────────┤
   │  [REVIEW] Sales Ops – Regional Revenue                     │
   │           uses a different filter, deviates by 6%          │
   └────────────────────────────────────────────────────────────┘
                          │
                          ▼
5. Decide: Update the dashboard OR update the Semantic Model
```

<br>

## Technical Overview

<details>
<summary><b>Click to expand</b></summary>

<br>

/dev/truth is designed to run inside the Tableau Next / Salesforce ecosystem and work with Tableau Cloud.

#### Input

- Tableau Next **Semantic Model**: KPI definitions and optional "check rules" (tolerance, required filters, etc.)
- List of Tableau dashboards/views to test

#### Core Steps

1. Resolve the semantic metric definition and its rules
2. Use **VizQL Data Service** to query the values that each selected view displays for that metric
3. Compare returned values against the semantic metric and rules
4. Generate a structured result (per view: pass/fail + explanation)

#### Output

- A simple UI/report inside a dashboard extension or web app
- Optionally, structured JSON for integration with other tools

</details>

<br>

## Project Scope

```
┌─────────────────────────────────────────────────────────────────┐
│  THIS IS A PROTOTYPE FOR TABLEAU HACKATHON 2025                 │
└─────────────────────────────────────────────────────────────────┘
```

| In Scope | Out of Scope |
|----------|--------------|
| Small number of KPIs | Detection of every possible KPI issue |
| Chosen set of dashboards/views | Full semantic parsing of arbitrary calculated fields |
| Straightforward checks (tolerance, basic rules) | Production-ready deployment |

The goal is to **demonstrate the concept clearly** and show how Tableau Next, Semantic Models, VizQL Data Service, and agentic logic can work together.

<br>

## Limitations

```
┌─────────────────────────────────────────────────────────────────┐
│  • Works best when Semantic Model definitions are complete      │
│  • Works best when dashboards map cleanly to those semantics    │
│  • Tool suggests WHERE inconsistencies are                      │
│  • Humans decide WHAT the correct definition should be          │
└─────────────────────────────────────────────────────────────────┘
```

<br>

---

<div align="center">

**/dev/truth** — *because metrics should mean what they say*

</div>
