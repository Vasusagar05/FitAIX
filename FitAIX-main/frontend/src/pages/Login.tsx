import React, { useState } from 'react';
import { Dumbbell, ShieldAlert, Key, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { signInWithGoogle } from '@/lib/firebase';

export default function Login() {
  const { login, loginWithFirebase, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const token = await signInWithGoogle();
      if (token) {
        await loginWithFirebase(token);
      }
    } catch (err: any) {
      console.error(err);
      setGoogleError(err.message || 'An error occurred during Google Sign-In.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
      <div className="relative w-full max-w-md bg-obsidian-900/60 border border-obsidian-700/55 backdrop-blur-2xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col items-center">
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
        {(error || googleError) && (
          <div className="w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 font-medium leading-relaxed">
              {googleError || error}
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

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-3 mt-3 rounded-xl bg-obsidian-950 border border-obsidian-700/80 hover:border-neon-cyan/50 active:scale-[0.98] text-slate-200 font-bold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:bg-obsidian-800/20"
        >
          {googleLoading ? (
            <span className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>


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

          </div>
        </div>
      </div>
    </div>
  );
}
