import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { 
  Users, 
  Cpu, 
  Database, 
  Radio, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  Send, 
  Activity,
  UserCheck
} from 'lucide-react';

interface Alert {
  id: string;
  level: string;
  message: string;
  time: string;
}

interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  neuralEngineLoad: string;
  databaseStatus: string;
  latencyMs: number;
  systemAlerts: Alert[];
  userList: UserListItem[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [simulationMsg, setSimulationMsg] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data.data);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const simulateEvent = async (eventType: string) => {
    setIsSimulating(true);
    setSimulationMsg('');
    try {
      const response = await apiClient.post('/admin/simulate-event', { eventType });
      setSimulationMsg(`Success: ${response.data.message}`);
      setTimeout(() => setSimulationMsg(''), 4500);
    } catch (err: any) {
      setSimulationMsg(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-violet animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading Admin Control Telemetry...</p>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Access Denied or Failed to Load Admin Telemetry.</p>
        <button onClick={fetchStats} className="px-4 py-2 rounded-xl bg-neon-violet text-white font-bold text-xs cursor-pointer">
          Retry Admin Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            FitAI<span className="text-neon-violet">x</span> Admin Command Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            System Operations • WebSocket Simulator • Neural Engine Master Config
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-950/60 border border-obsidian-700 font-mono text-xs text-neon-violet">
          <Activity className="w-4 h-4" />
          <span>Operations Live • 14ms Response</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-neon-cyan" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
            <p className="text-[10px] text-neon-emerald font-mono mt-1">+12% from last week</p>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="p-5 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-wider">Active Subscriptions</span>
            <UserCheck className="w-5 h-5 text-neon-emerald" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{stats.activeSubscriptions}</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">83.7% Adherence Rate</p>
          </div>
        </div>

        {/* Neural load */}
        <div className="p-5 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-wider">Neural Engine Load</span>
            <Cpu className="w-5 h-5 text-neon-violet" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white">{stats.neuralEngineLoad}</h3>
            <p className="text-[10px] text-neon-emerald font-mono mt-1">Nominal performance</p>
          </div>
        </div>

        {/* Database Status */}
        <div className="p-5 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-wider">Telemetry DB</span>
            <Database className="w-5 h-5 text-neon-amber" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-white capitalize">{stats.databaseStatus}</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Auto-replication online</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WebSocket Simulator */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-neon-violet animate-pulse" />
                <h2 className="text-lg font-bold text-white">Live Socket.IO Event Simulator</h2>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neon-violet/10 text-neon-violet border border-neon-violet/30">
                WebSocket Driver
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Simulate events and push telemetry updates in real-time. Active clients on the dashboard will immediately receive these signals and adapt their user interface via Socket.IO events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => simulateEvent('workout')}
                disabled={isSimulating}
                className="p-4 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-cyan/50 hover:bg-obsidian-850/30 text-left transition-all group cursor-pointer flex flex-col justify-between h-28"
              >
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Workout Update</span>
                  <span className="text-[9px] text-slate-500 font-mono">workout_updated</span>
                </div>
              </button>

              <button
                onClick={() => simulateEvent('recovery')}
                disabled={isSimulating}
                className="p-4 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-emerald/50 hover:bg-obsidian-850/30 text-left transition-all group cursor-pointer flex flex-col justify-between h-28"
              >
                <div className="w-8 h-8 rounded-lg bg-neon-emerald/10 border border-neon-emerald/20 flex items-center justify-center text-neon-emerald group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Recovery Shift</span>
                  <span className="text-[9px] text-slate-500 font-mono">recovery_score_updated</span>
                </div>
              </button>

              <button
                onClick={() => simulateEvent('notification')}
                disabled={isSimulating}
                className="p-4 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-violet/50 hover:bg-obsidian-850/30 text-left transition-all group cursor-pointer flex flex-col justify-between h-28"
              >
                <div className="w-8 h-8 rounded-lg bg-neon-violet/10 border border-neon-violet/20 flex items-center justify-center text-neon-violet group-hover:scale-110 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">System Alert</span>
                  <span className="text-[9px] text-slate-500 font-mono">notification_received</span>
                </div>
              </button>
            </div>
          </div>

          {simulationMsg && (
            <div className="p-3 rounded-lg bg-obsidian-950 border border-neon-violet/30 text-xs text-neon-violet font-mono mt-2 animate-fade-in">
              {simulationMsg}
            </div>
          )}
        </div>

        {/* System Operations log */}
        <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">System Operations Logs</h2>
            <span className="w-2.5 h-2.5 rounded-full bg-neon-emerald animate-pulse" />
          </div>
          <div className="space-y-3">
            {stats.systemAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-obsidian-950/50 border border-obsidian-800 flex items-start gap-2.5">
                {alert.level === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-neon-amber shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs text-slate-200 font-medium leading-normal">{alert.message}</p>
                  <span className="text-[9px] text-slate-500 font-mono block mt-1">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Portal Section */}
      <div className="p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-800/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-lg font-bold text-white">User Accounts & Portal Verifications</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">4 Accounts Registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-obsidian-800 text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/50 text-slate-300">
              {stats.userList.map((usr) => (
                <tr key={usr.id} className="hover:bg-obsidian-800/20 transition-all text-xs">
                  <td className="py-3.5 px-4 font-bold text-white">{usr.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{usr.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      usr.role === 'admin' 
                        ? 'bg-neon-violet/10 text-neon-violet border-neon-violet/30' 
                        : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse" />
                      <span>Online</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{usr.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
