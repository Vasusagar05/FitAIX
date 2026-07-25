# FitAIx — Neural Performance Fitness OS

Repository link: [Vasusagar05/FitAIX](https://github.com/Vasusagar05/FitAIX)

A futuristic, production-grade, AI-powered fitness web application frontend built with **Vite**, **TypeScript**, **Tailwind CSS**, **Zustand**, **TanStack Query**, **Axios**, and **Socket.io** real-time simulation, now featuring role-based authentication and portal separation.

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

---

## 📁 Feature-Based Project Structure

```
src/
├── app/                     # Next.js App Router pages
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
| POST | `/auth/login` | Authenticate credentials and obtain token |
| GET | `/auth/me` | Retrieve authenticated user profile session |
| GET | `/admin/stats` | Fetch system telemetry statistics and user list (Admin only) |
| POST | `/admin/simulate-event` | Trigger live Socket.IO event simulations (Admin only) |
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
- **AI Coach Rachel** — ChatGPT-style dialogue with action cards (POST `/chat`)
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

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Build Verification

- `npx tsc --noEmit` — TypeScript strict mode: **0 errors**
- `npm run build` — Production build: **11/11 static routes compiled successfully**
