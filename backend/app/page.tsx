'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // পাসওয়ার্ড ভ্যালিডেশন
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (email && password) {
      if (rememberMe) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.setItem('isAuthenticated', 'true');
      }

      // /admin রাউটে পাঠাবে
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f8] text-slate-800 p-6 sm:p-10">
      <div className="relative w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white mb-4 shadow-md">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-900 uppercase">
            Maheen Accessories Ltd.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
            Control Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
            <AlertCircle size={20} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maheenaccessories.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all text-base"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
              * Password must be minimum 6 characters long
            </p>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800 accent-slate-900 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <a href="#" className="font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-base transition-all duration-200 shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400 font-medium">
            Protected area. Authorized personnel only.
          </p>
        </div>

      </div>
    </div>
  );
}