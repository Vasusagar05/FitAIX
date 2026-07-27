# FitAIx — Neural Performance Fitness OS

A futuristic, production-grade, AI-powered fitness web application frontend built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Zustand**, **TanStack Query**, **Axios**, and **Socket.io** real-time simulation.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS (Glassmorphism) |
| API Client | Axios (Centralized REST `/api/v1/`) |
| Server State | TanStack Query v5 (React Query) |
| Client State | Zustand |
| Real-Time | Socket.io client simulation |
| Charts | Recharts |
| Icons | Lucide React |
| AI Coach | Groq (llama-3.3-70b-versatile) |

---

## 📁 Feature-Based Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── api/chat/route.ts    # AI Coach Rachel — Groq API endpoint
│   ├── dashboard/page.tsx
│   ├── workout/page.tsx
│   ├── coach/page.tsx
│   ├── progress/page.tsx
│   ├── calendar/page.tsx
│   ├── meals/page.tsx
│   └── settings/page.tsx
│
├── features/                # Feature-based modules
│   ├── dashboard/           # services/, hooks/, components/, types.ts
│   ├── workout/
│   ├── coach/
│   ├── progress/
│   ├── calendar/
│   └── meals/
│
├── shared/                  # Reusable UI components & hooks
│   ├── components/          # GlassCard, Button, Badge, Sidebar, Header
│   └── hooks/               # useSocketEvents
│
└── lib/                     # Infrastructure
    ├── apiClient.ts          # Axios REST client + interceptors + mock handler
    ├── socketClient.ts       # Socket.io simulation service
    ├── queryClient.ts        # TanStack Query client
    └── store.ts              # Zustand global state
```

---

## 🌐 RESTful API Design (`/api/v1/`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Fetch dashboard telemetry |
| GET | `/workouts/today` | Fetch today's AI-adapted workout |
| PATCH | `/exercises/:id` | Update exercise (sets, weight, completion) |
| POST | `/workouts` | Generate new AI workout plan |
| POST | `/chat` | Send message to AI Coach Rachel |
| GET | `/progress` | Fetch 1RM strength and AI memory timeline |
| GET | `/schedule` | Weekly planner with muscle heatmaps |
| PATCH | `/schedule/:id` | Reschedule a workout day |
| GET | `/meals` | Fetch macronutrient-tailored meal plan |
| POST | `/grocery-list` | Generate shopping list |

---

## ⚡ Key Features

- **AI Recovery Score Meter** — Radial SVG gauge with HRV, Sleep, and CNS readiness breakdown
- **Workout Engine** — Live exercise card tracking with REST PATCH calls + AI Explanation Panel
- **Version Comparison** — Side-by-side Previous vs AI-Adapted workout comparison
- **AI Coach Rachel** — Groq-powered dialogue with action cards (POST `/chat`)
- **Progress Analytics** — Interactive Recharts 1RM area charts + AI Memory Timeline
- **Smart Calendar** — Weekly heatmap grid with overuse risk warnings
- **Meal Plan + Grocery Generator** — Budget-filtered meals + 1-click interactive shopping list
- **Real-Time Socket Feed** — Live AI telemetry stream via `useSocketEvents` hook
- **Scenario Switcher** — Normal / Travel Mode / Low Equipment Mode
- **View Mode** — Simple vs Advanced Analytics Toggle
- **7-Min Micro Workout Modal** — Streak protection quick session launcher

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Copy the env template and add your Groq API key
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root with:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com/keys](https://console.groq.com/keys).

---

## ✅ Build Verification

- `npx tsc --noEmit` — TypeScript strict mode: **0 errors**
- `npm run build` — Production build: **11/11 static routes compiled successfully**
