# SochSePare (सोच से परे) — AI Decision Reasoning Auditor

> **"Don’t outsource your decision. Audit your thinking."**
> **"सोच से परे — See what your thinking is missing."**
> A Socratic reasoning auditor web application that reveals unstated assumptions, overlooked dimensions, internal conflicts, and missing information in your decisions — without ever telling you what to choose.

---

## 🎯 The Core Philosophy & Business Rules

When facing high-stakes decisions (career choices, financial commitments, life changes), human reasoning suffers from **Bounded Awareness**, **Focalism**, and **Motivated Reasoning**:
1. We fixate on what is most immediately visible (e.g. stipend, location, excitement).
2. We treat unverified beliefs as established facts (unstated assumptions).
3. We rationalize contradictions between our stated goals and actual drivers.

Existing decision tools attempt to be **decision-makers** (*"You should take Option A"* or *"Score: 82/100"*). This deprives the user of personal agency and encourages intellectual laziness.

**SochSePare** is designed with the opposite philosophy: **a Socratic Reasoning Auditor**. It never tells you what to choose. It shows you what you're missing, challenges your logic, quotes your own words back to you, and equips you with the questions that make your thinking harder to deceive.

---

## 🛡️ Strict No-Verdict Guardrail (Zero Recommendation Guarantee)

- The engine is architected to **never** output recommendations:
  - ❌ Forbidden: "You should choose A", "Choose B", "Accept...", "Reject...", "Option A is better", "I recommend...".
  - ✅ Allowed: "You may be assuming...", "You haven't mentioned...", "There is a possible conflict...", "What evidence would change your mind?", "This information is currently unknown."
- Returns verified metadata: `"verdict": null` and `"guardrail": { "verdict_given": false }`.
- **Adversarial Resilience**: If a user enters *"Should I take the $50k job or $35k job? Just tell me what to do!"*, SochSePare explicitly refuses to pick and instead audits the user's desire to outsource their choice.

---

## 🌟 Key Features & Architectural Layers

### 1. 🗺️ Cognitive Topology Visualizer (SVG Node Canvas)
- An intuitive, responsive visual tree comparing:
  - **Left Nodes**: *What You Can See* (the user's explicit factors and rationale).
  - **Apex Fork**: *The Central Dilemma & Leaning Bias*.
  - **Right Nodes**: *What You May Be Missing* (unstated assumptions, overlooked factors, and risk blind spots).

### 2. 🔍 Evidence Traceability Layer ("Why did SochSePare flag this?")
- Every flagged blind spot quotes the user's exact phrasing (`quoteTrace`).
- Users can expand an accordion to see the precise logical gap: *"You wrote: 'I'll get industry experience' → But you haven't verified mentorship or task relevance."*

### 3. 📊 Epistemic Telemetry & Coverage Ratio
- Computes a cognitive coverage metric (**% Stated Coverage** vs. **% Omissions / Blind Spots**) rather than a judgmental "decision score".
- Displays **Critical Gaps** count, **Internal Tensions** count, and **Durability Score** (FRAGILE / MODERATE).

### 4. ⚡ Diagnostic Multi-Card Engine with Interactive Triage
- Categorized into 5 distinct analytical tabs:
  1. **Unstated Assumptions**: Causal, priority, and equivalence assumptions treated as truth.
  2. **Internal Conflicts**: Tension between stated preferences and actual drivers.
  3. **Overlooked Factors**: Concrete calculated opportunity costs & missing dimensions.
  4. **Missing Information**: Critical empirical data gaps with actionable verification steps.
  5. **Falsification Sensitivity**: "What Would Change Your Mind?" interactive checklist.
- Active triage buttons on each card: `[✓ Considered]`, `[⚠️ Critical]`, `[Not Relevant]`.

### 5. 🔁 Round 2 Socratic Pressure Tests ("Challenge My Reasoning")
- Displays boundary test questions (e.g. Zero-Stipend Boundary, Production Artifact Test).
- The user commits their candid reflection, and SochSePare immediately ingests the artifact and updates the epistemic assessment.

### 6. 🚀 4 Instant Test Presets (1-Click Evaluation)
- **Internship vs. Placement Prep**: The classic ₹30k stipend + home proximity vs. campus placement preparation.
- **Friend's Startup vs. Big Tech**: Autonomy & friendship vs. corporate mentorship & runway.
- **MS Abroad vs. Staying in Role**: $95k loan & visa volatility vs. domestic career compounding.
- **Buy Home vs. Rent & Invest**: Mortgage front-loaded interest vs. systematic equity compounding.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS, Lucide React icons, Google Material Symbols, JetBrains Mono, Geist & Manrope fonts.
- **Backend**: Next.js Serverless Route Handlers (`/api/analyze` and `/api/followup`).
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) with structured JSON schema output and low temperature (0.2).
- **Zero-Setup Guarantee**: Built-in High-Fidelity Neural Simulation Engine ensures the app runs seamlessly and instantaneously even without an API key. Users/judges can also plug in their own Gemini API key anytime via the in-app settings modal.
- **Deployment**: Vercel ready (`vercel.json` included).

---

## 🚀 Getting Started Locally

```bash
# Clone repository
git clone https://github.com/Rudrakathoke2006/SochSePare.git
cd SochSePare

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## ⏱️ 90-Second Demo Script for Judges

1. **Open the App**: Notice the clear positioning: *"SochSePare (सोच से परे) — Decision Reasoning Auditor"*.
2. **Select Preset 1 ("INTERNSHIP VS PREP")**:
   - The studio auto-populates with the exact dilemma: ₹30k stipend, close to home, industry experience.
3. **Inspect the Cognitive Topology Visualizer**:
   - Left side shows stated arguments, center shows the Epistemic Fork, and right side exposes unexamined blind spots.
4. **Click "TEST NO-VERDICT"**:
   - Demonstrates the formal adversarial defense: the AI explicitly refuses to pick an option when asked "Just tell me what to do", preserving 100% decision agency.
5. **Switch Diagnostic Tabs**:
   - **Unstated Assumptions**: Shows quote trace `"It provides a credible production logo on my resume."`
   - **Internal Conflicts**: Shows side-by-side comparison of `Stated Preference` vs `Declared Target`.
   - **Missing Information**: Exposes the lack of mentorship SLA with actionable verification questions.
   - **Falsification Sensitivity**: Interactive checkable thresholds that invert reasoning.
6. **Round 2 Socratic Test**:
   - Under Epistemic Pressure Tests, type into the reflection box and click **COMMIT** to watch the real-time reflective stream ingest your answer.
7. **Click DOSSIER**:
   - Instantly downloads a clean, structured analytical dossier for offline review.

---

## ⚖️ License

MIT License. Designed and engineered for the 3-Hour AI Challenge.
