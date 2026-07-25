# FitAIX — Neural Performance Fitness OS

Repository link: [Vasusagar05/FitAIX](https://github.com/Vasusagar05/FitAIX)

FitAIx is a futuristic, AI-optimized fitness web application. This repository includes both the frontend (React, Vite, Tailwind CSS, TypeScript, Zustand, TanStack Query) and backend (Node.js, Express, Socket.IO) services.

---

## 🛠️ Project Structure

- **`frontend/`**: The client-side application.
- **`backend/`**: Express server providing mock REST endpoints and Socket.IO real-time event broadcasting.

---

## 🚀 Getting Started

To install dependencies and start both the frontend and backend concurrently:

1. **Install Root and Workspace Dependencies**:
   ```bash
   # From the root repository directory
   npm install
   npm run install --prefix frontend
   npm run install --prefix backend
   ```

2. **Run Concurrent Dev Server**:
   ```bash
   npm run dev
   ```
   - **Frontend**: Running at [http://localhost:3000](http://localhost:3000)
   - **Backend**: Running at [http://localhost:3001](http://localhost:3001)

---

## 🔒 Authentication & Portal Separation Update

We have implemented a comprehensive **Session Authentication flow** that divides the application into two dedicated portals:

### 1. User Portal (Guest / Standard)
* **Identity**: Log in with Username: `user` and Password: `password`.
* **Features**: Accessible to standard users, showing the neural fitness dashboard, workout engine, meal plans, smart calendar, and real-time live feed telemetry.

### 2. Admin Portal (Ops / Management)
* **Identity**: Log in with Username: `admin` and Password: `admin`.
* **Features**:
  * Exclusive **Admin Portal** route (`/admin`) guarded against standard users.
  * **System Telemetry Widgets**: CPU Load, active connections, and database status.
  * **Live Socket.IO Event Simulator**: Interactive triggers to simulate and broadcast events (Workout adaptation, Recovery shift, System notification) directly to active clients in real-time.
  * **User Management Logs**: A verification table displaying active registered accounts and system logs.

### 3. Login UI & Profile Integrations
* **Cyber-fitness Login Panel**: A glassmorphic screen with custom error validation and a dark atmospheric gym background overlay.
* **Credentials Helper**: Quick buttons at the bottom of the login form to pre-fill standard `user` and `admin` credentials.
* **Header profile badge**: Displays the logged-in user's avatar and name.
* **Sidebar Profile & Logout**: Shows user session details and a Logout button at the footer of the sidebar.
