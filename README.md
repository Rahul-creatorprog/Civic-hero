# 🏙️ CivicHero - Inclusive Community Issue Reporting & Authority Action Tracker

**CivicHero** is a full-stack civic participation platform engineered specifically for **all generations** — from children ("Junior Civic Heroes") to senior citizens (Elders) and municipal authorities. It bridges the gap between citizens reporting street problems and municipal departments taking verifiable action.

---

## 🌟 Key Features

### 👵 1. Senior Citizen & Accessibility Features
- **One-Tap Voice Dictation (Speech-to-Text)**: Speak the problem directly into your microphone without having to type.
- **Audio Read-Aloud (Text-to-Speech)**: Single-tap to listen to instructions, issue details, and official action timelines.
- **Font Size Scaling**: Switch between Normal, Large (120%), and Extra Large (140%) text instantly.
- **High Contrast Mode**: Crisp black/yellow high-contrast visuals for low-vision readability.
- **Senior Friendly Guide Banner**: 3 numbered visual steps with helpline direct-dial.

### 🦸 2. Junior Civic Hero Mode (Kids & Youth)
- **Gamified Civic Participation**: Earn **Civic Stars ⭐** and level up ranks (Junior Community Hero ➔ Super Neighborhood Scout ➔ Master City Guardian).
- **Celebratory Confetti**: Instant rewarding animations upon reporting issues.
- **Intuitive Visual Icon Cards**: Large 3D emojis representing what's broken in parks, playgrounds, or streets.

### 👥 3. Citizen Problem Reporting & Community Action
- **Interactive City Map (Leaflet.js)**: Color-coded map markers showing reported, in-review, in-progress, and resolved problems across the city.
- **Before & After Resolution Verification**: When authorities fix an issue, citizens see official side-by-side completion photos and certification notes.
- **Community Upvotes ("I See This Too")**: Neighbors can corroborate problems to help authorities prioritize severe safety hazards.
- **Tracking ID Search**: Look up any complaint directly with unique codes like `REP-2026-1001` or by voice.
- **Public Discussion Feed**: Citizens and officials communicate directly under each issue.

### 🏛️ 4. Municipal Authority Action & Dispatch Portal
- **Role Switcher**: Seamlessly switch between **Citizen View** and **Municipal Authority Portal**.
- **Action Workflow Pipeline**:
  - `Reported` ➔ `Under Review` ➔ `In Progress (Crew Dispatched)` ➔ `Resolved`
- **Department & Officer Assignment**: Assign work to Public Works, Electrical Board, Water & Sewage, Sanitation, or Parks.
- **Attach Resolution Proof**: Upload completion photos and official certification notes visible to all citizens.
- **Live Analytics Dashboard**: Real-time stats on resolution rate, category breakdown, urgent hazards, and active crews.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS
  - Lucide Icons
  - Leaflet & React-Leaflet (Interactive Maps)
  - Canvas Confetti
  - Web Speech API (Native Speech Synthesis & Speech Recognition)
- **Backend**:
  - Node.js & Express.js REST API
  - File-backed JSON Database with transactional updates
  - CORS & Body-Parser with base64 image support

---

## 🚀 How to Run the Project

### Option A: 1-Click Launch (Windows)
Double-click the `start.bat` file in the root folder. It will launch both backend and frontend development servers in separate windows.

---

### Option B: Manual Command Line

#### 1. Start the Backend API:
```bash
cd backend
npm start
```
*API runs at `http://localhost:5000`*

#### 2. Start the Frontend:
```bash
cd frontend
npm run dev
```
*Open your browser at `http://localhost:5173`*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/issues` | List issues (with filters by category, status, search, and sort) |
| `GET` | `/api/issues/:id` | Get issue details with action timeline and comments |
| `POST` | `/api/issues` | Submit a new community problem report |
| `POST` | `/api/issues/:id/upvote` | Upvote / corroborate an issue |
| `POST` | `/api/issues/:id/comments` | Add a community or official comment |
| `PATCH` | `/api/issues/:id/status` | **Authority Action**: Update status, assign department, attach resolution photo |
| `GET` | `/api/stats` | Real-time analytics and resolution statistics |
| `GET` | `/api/health` | Service health status |

---

## ♿ Accessibility Standards
- WCAG 2.1 AA compliant color contrast ratios.
- Aria attributes and screen-reader friendliness.
- Fully operational without a physical keyboard using voice recognition and touch icons.
