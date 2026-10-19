# HeatShield AI — Traffic Junction Heat Risk & Smart Duty Planner

[![Nugen API Exclusive](https://img.shields.io/badge/AI%20Service-Nugen%20API%20(Exclusive)-purple.svg)](https://api.nugen.in)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-blue.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Python%20Flask%20%2F%20Express%20TS-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

An occupational climate-safety and decision-support web platform designed for traffic police departments, supervisory inspectors, and municipal authorities. HeatShield AI addresses the severe health risks faced by traffic officers working extended hours at busy urban intersections under direct solar radiation and trapped asphalt heat.

---

## 1. Problem Overview & Solution

### The Challenge
Traffic police officers endure prolonged outdoor duty standing directly on dark bitumen asphalt surfaces that often exceed 55°C during hot afternoons. Idling vehicle exhaust under flyovers and high relative humidity severely impair human thermoregulation, leading to dehydration, heat exhaustion, and life-threatening heatstroke. Standard city-wide weather forecasts fail to capture localized junction microclimates or assist supervisors in coordinating heat-aware duty rotations.

### The HeatShield AI Solution
HeatShield AI unifies:
1. **Junction-Specific Microclimate Assessment:** Tracks temperature, relative humidity, traffic congestion, and canopy shade across simulated demonstration junctions in Pune, Maharashtra.
2. **Transparent Demonstration Heat-Risk Scoring:** A reproducible, rule-based formula that factors in ambient temperature, humidity penalties, traffic exhaust, and facility mitigations.
3. **Smart Duty & Rest Rotation Planner:** Enforces deterministic continuous standing limits (e.g., maximum 40–45 minutes during High Risk conditions) with mandatory 15-minute shaded rest breaks.
4. **Cooling Facility Prioritization:** Computes infrastructure gap scores to help municipal authorities target shade canopies, misting fans, and drinking water kiosks where most urgent.
5. **Nugen AI Safety Assistant:** Powered exclusively by the **Nugen API** through a secure server-side proxy, delivering multilingual safety guidance, rotation recommendations, and emergency protocol instructions.

---

## 2. Key Architecture & Features

### 1. Navigation Modules (9 Sections)
- **Dashboard Overview:** Executive summary with 8 key metric cards, risk distribution charts, temperature trends, and quick operational shortcuts.
- **Heat Risk Map:** Interactive Leaflet GIS map with custom color-coded risk markers (Red: High, Amber: Moderate, Green: Low), detailed slide-over inspector, search, and accessible list alternative.
- **Junction Monitoring:** Dedicated monitoring grid for the 5 Pune demonstration junctions (JM Road, Deccan Gymkhana, Shivajinagar, Swargate, Hadapsar) with in-place telemetry editor and side-by-side comparison.
- **Heat Prediction:** Interactive scenario calculator allowing supervisors to simulate microclimate shifts, validate inputs, save scenarios to junctions, and request AI explanations.
- **Smart Duty Planner:** Shift roster with configurable continuous duty limits, rest break intervals, timeline view, conflict/overload warnings, and CSV roster export.
- **Cooling Facility Priority:** Ranked municipal intervention schedule for drinking water kiosks, misting awnings, and emergency first-aid stations.
- **AI Safety Assistant:** Conversational safety copilot powered exclusively by the **Nugen API**, with structured junction context injection and verified offline safety SOP fallback.
- **Reports and Analytics:** Summary metrics, gap analyses, hotspot tracking, and CSV audit log download.
- **Settings and About:** Comprehensive preferences (3 languages, 3 visual themes, temperature units), demo scoring weights, reset demo data, Nugen API connection diagnostics, and complete methodology overview.

### 2. Multilingual Support
HeatShield AI includes complete translations across all 9 pages, dialogs, buttons, tooltips, and notifications in three selectable languages:
- **English** (Global / UK)
- **हिन्दी (Hindi)**
- **मराठी (Marathi)** (specifically tailored for Pune / Maharashtra Police operations)

Interface language is persisted across browser sessions via `localStorage` and sent with every assistant prompt to request native AI responses.

### 3. Visual Themes & Accessibility
Three selectable themes:
- **Light Professional Theme:** Optimized for indoor dispatch desks and administrative offices.
- **Dark Operations Theme:** Optimized for low-light traffic command centers.
- **High-Contrast Accessibility Theme:** High-contrast display with vivid borders and deep contrast, designed for viewing under harsh outdoor sunlight.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4 with custom high-contrast accessibility utilities
- **Icons:** Lucide React
- **Mapping:** Leaflet GIS with OpenStreetMap tiles and custom div-icon markers
- **Charts:** Recharts for risk category distributions and diurnal temperature trends

### Backend
HeatShield AI provides two interchangeable backend implementations:
1. **Python Flask Backend (`backend/app/`):** Clean modular REST architecture with route blueprints, services, config loaders, and deterministic scoring utils.
2. **Node.js / Express Server (`server.ts`):** Lightweight TypeScript Express proxy that embeds Vite in development and serves the SPA in production.

### Sole Permitted AI Service
- **Nugen API (`https://api.nugen.in/api/v3`):** The sole authorized external AI provider. No secondary or unauthorized AI services are permitted or used.

---

## 4. Environment Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Configure your environment variables:

```ini
# Server Port
PORT=3000
NODE_ENV=development

# NUGEN API CONFIGURATION (SOLE PERMITTED AI SERVICE)
NUGEN_API_KEY=your_actual_nugen_api_key
NUGEN_API_ENDPOINT=https://api.nugen.in/api/v3
NUGEN_MODEL=nugen-flash-instruct
```

> **Security Note:** The `NUGEN_API_KEY` is loaded exclusively on the backend server. It is never bundled into frontend JavaScript, stored in `localStorage`, or exposed in client network requests.

---

## 5. Installation & Setup Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** 3.10+ (for running the Python Flask backend)

### Step 1: Clone & Install Frontend Dependencies
```bash
git clone <repository-url>
cd heatshield-ai
npm install
```

### Step 2: Install Python Backend Dependencies (Optional / Standalone)
```bash
pip install -r backend/requirements.txt
```

### Step 3: Run the Development Server

#### Option A: Full-Stack Integrated Server (Node + Express + Vite)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Python Flask Backend + Vite Frontend
In terminal 1 (Flask Backend):
```bash
python backend/run.py
```
*Backend runs on `http://127.0.0.1:5000`.*

In terminal 2 (Vite Frontend):
```bash
npx vite --port 3000
```

---

## 6. REST API Endpoint Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend service health, version, and Nugen status |
| `GET` | `/api/junctions` | List all 5 Pune demonstration junctions (supports `?riskCategory=` and `?search=`) |
| `GET` | `/api/junctions/:id` | Retrieve single junction details by ID |
| `PUT` | `/api/junctions/:id` | Update simulated readings (temperature, humidity, traffic, shade, facilities) |
| `POST` | `/api/junctions/reset` | Reset all 5 demonstration junctions to baseline values |
| `POST` | `/api/heat-risk/calculate` | Transparent demonstration heat-risk score calculation |
| `GET` | `/api/duty-plans` | Retrieve duty rotation plans |
| `POST` | `/api/duty-plans/generate` | Generate deterministic duty rotation plan with constraint flags |
| `PUT` | `/api/duty-plans/:id` | Update duty plan status, notes, or checklist tasks |
| `GET` | `/api/facilities` | List cooling facility priority rankings |
| `PUT` | `/api/facilities/:id` | Update facility deployment status (`Needed`, `In Progress`, `Installed`) |
| `POST` | `/api/assistant/chat` | Secure proxy to Nugen API with structured junction context |
| `GET` | `/api/assistant/status` | Safe Nugen configuration status (without exposing secrets) |
| `GET` | `/api/assistant/test-connection` | Lightweight diagnostic ping to Nugen API |
| `GET` | `/api/reports/summary` | Aggregated executive metrics and cooling infrastructure gaps |

---

## 7. Five Simulated Pune Junctions

The initial demonstration seeds 5 realistic but explicitly simulated traffic junctions across Pune, Maharashtra:

1. **JM Road Junction (`pune-jm-road`):**
   - Location: Jungli Maharaj Road commercial axis [18.5246, 73.8478]
   - Baseline: 36.2°C, 40% RH, Moderate traffic, 35% canopy shade
   - Risk: **42 / 100 (Low Risk)**
2. **Deccan Gymkhana Junction (`pune-deccan`):**
   - Location: FC Road & Karve Road nexus [18.5173, 73.8415]
   - Baseline: 38.0°C, 46% RH, Moderate traffic, 25% canopy shade
   - Risk: **60 / 100 (Moderate Risk)**
3. **Shivajinagar Junction (`pune-shivajinagar`):**
   - Location: Metro Interchange & Court Road [18.5314, 73.8446]
   - Baseline: 38.8°C, 48% RH, Heavy traffic, 18% canopy shade
   - Risk: **68 / 100 (Moderate Risk)**
4. **Swargate Junction (`pune-swargate`):**
   - Location: Transit terminal & flyover [18.5018, 73.8586]
   - Baseline: 41.2°C, 54% RH, Gridlock congestion, 8% canopy shade
   - Risk: **86 / 100 (High Risk)**
5. **Hadapsar Junction (`pune-hadapsar`):**
   - Location: Solapur Road freight corridor [18.5029, 73.9272]
   - Baseline: 42.0°C, 50% RH, Heavy freight traffic, 10% canopy shade
   - Risk: **89 / 100 (High Risk)**

---

## 8. Verification & Testing Instructions

To verify all features:

1. **TypeScript Typecheck:**
   ```bash
   npm run lint
   ```
   *Expected: Zero compilation errors.*

2. **Production Bundle Build:**
   ```bash
   npm run build
   ```
   *Expected: Successful compilation producing optimized bundles in `dist/`.*

3. **Feature Verification Checklist:**
   - [x] All 9 navigation tabs switch views properly.
   - [x] Junction monitoring grid displays all 5 Pune junctions with "DEMO DATA" banner.
   - [x] Editing simulated temperature/humidity updates the risk score and category immediately.
   - [x] Heat risk map renders markers with color-coded pins (Red, Amber, Green) and popup inspector.
   - [x] Duty planner highlights constraint violations (>45 min standing in High Risk) and exports CSV.
   - [x] Language switcher seamlessly updates the interface into English, Hindi, and Marathi.
   - [x] Theme switcher toggles between Light, Dark, and High-Contrast modes.
   - [x] AI Assistant proxy calls the Nugen API; displays connection diagnostics and verified static safety SOP fallback if credentials are absent or invalid.
   - [x] No API keys are leaked to the browser bundle or client requests.

---

## 9. Troubleshooting

- **Nugen API returns 401 Unauthorized:**
  Check that `NUGEN_API_KEY` in `.env` contains a valid key issued by Nugen. If no key is available, the UI transparently displays the connection status and verified Pune Police heat safety SOP fallback without crashing.
- **Port 3000 is in use:**
  Change `PORT=3001` in `.env` or run with `PORT=3001 npm run dev`.
- **Leaflet map tiles not rendering:**
  Check your internet connection to access OpenStreetMap tiles, or switch to the accessible **List View** alternative built into the map view.

---

## 10. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
