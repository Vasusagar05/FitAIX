import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/shared/components/Providers';
import { Sidebar } from '@/shared/components/Sidebar';
import { Header } from '@/shared/components/Header';
import { MicroWorkoutModal } from '@/features/workout/components/MicroWorkoutModal';

export const metadata: Metadata = {
  title: 'FitAIx | Neural Performance Fitness OS',
  description: 'Futuristic AI-Powered Fitness & Performance Application built with RESTful Architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-obsidian-950 text-slate-100">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Workspace */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
                {children}
              </main>
            </div>
          </div>

          {/* Micro Workout Launcher Modal */}
          <MicroWorkoutModal />
        </Providers>
      </body>
    </html>
  );
}
