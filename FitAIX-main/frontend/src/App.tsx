import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from '@/shared/components/Providers';
import { Sidebar } from '@/shared/components/Sidebar';
import { Header } from '@/shared/components/Header';
import { MobileBottomNav } from '@/shared/components/MobileBottomNav';
import { MicroWorkoutModal } from '@/features/workout/components/MicroWorkoutModal';

import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Calendar from '@/pages/Calendar';
import Coach from '@/pages/Coach';
import Meals from '@/pages/Meals';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import Workout from '@/pages/Workout';
import Login from '@/pages/Login';

import { useAuthStore } from '@/lib/authStore';

export default function App() {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian-950 text-slate-100">
        <span className="w-10 h-10 rounded-full border-4 border-neon-cyan border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-mono text-slate-400">Restoring neural context...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-obsidian-950 text-slate-100 relative">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-24 md:pb-6 space-y-4 sm:space-y-6 scrollbar-thin">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/calendar" element={<Calendar />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/meals" element={<Meals />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <MobileBottomNav />
      </div>
      <MicroWorkoutModal />
    </Providers>
  );
}

