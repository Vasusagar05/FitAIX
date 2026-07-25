import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, Key, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function Login() {
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-obsidian-950 overflow-hidden px-4 select-none">
      {/* Fitness Background Image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none filter grayscale brightness-50 contrast-125"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop')` }}
      />

      {/* Background Decorative Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-neon-cyan/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-neon-violet/10 blur-[150px] pointer-events-none" />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="relative w-full max-w-md bg-obsidian-900/60 border border-obsidian-700/55 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        {/* Glowing border top accent */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-neon-cyan/50 shadow-sm" />

        {/* Brand Logo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-emerald p-[1.5px] shadow-neon-cyan/35 shadow-xl mb-6">
          <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-neon-cyan" />
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-1">
          Welcome to FitAI<span className="text-neon-cyan">x</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-8 uppercase tracking-widest">
          Neural Performance OS
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 font-medium leading-relaxed">
              {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-950/85 border border-obsidian-700/80 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 text-slate-200 text-sm font-medium transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-950/85 border border-obsidian-700/80 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 text-slate-200 text-sm font-medium transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet hover:brightness-110 active:scale-[0.98] text-obsidian-950 font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-neon-cyan/20"
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-obsidian-950 border-t-transparent animate-spin" />
            ) : (
              'Initialize Session'
            )}
          </button>
        </form>

        {/* Credentials Helper Bottom */}
        <div className="w-full border-t border-obsidian-800/80 mt-8 pt-6">
          <div className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-3 text-center">
            Demo Portal Credentials
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillCredentials('user', 'password')}
              className="p-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-cyan/40 hover:bg-obsidian-800/40 text-left transition-all group cursor-pointer"
            >
              <div className="text-[10px] font-bold text-neon-cyan uppercase tracking-wider mb-0.5">
                User Portal
              </div>
              <div className="text-[11px] text-slate-300 font-mono group-hover:text-white">
                user / password
              </div>
            </button>
            <button
              onClick={() => fillCredentials('admin', 'admin')}
              className="p-2.5 rounded-xl bg-obsidian-950/60 border border-obsidian-800 hover:border-neon-violet/40 hover:bg-obsidian-800/40 text-left transition-all group cursor-pointer"
            >
              <div className="text-[10px] font-bold text-neon-violet uppercase tracking-wider mb-0.5">
                Admin Portal
              </div>
              <div className="text-[11px] text-slate-300 font-mono group-hover:text-white">
                admin / admin
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
