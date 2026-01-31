
import React, { useState } from 'react';
import { User, KATSINA_LGAS } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const lowerUser = username.toLowerCase().trim();
    const lowerPass = password.toLowerCase().trim();

    // Verification Logic
    setTimeout(() => {
      // Admin Check
      if (lowerUser === 'admin' && lowerPass === 'admin123') {
        onLogin({ username: 'admin', name: 'STATE ADMINISTRATOR', role: 'ADMIN' });
        setLoading(false);
        return;
      }

      // LGA Leader Check
      const matchingLGA = KATSINA_LGAS.find(lga => lga.toLowerCase() === lowerUser);
      
      if (matchingLGA && lowerPass === `${lowerUser}123`) {
        onLogin({ 
          username: lowerUser, 
          name: `LEADER ${matchingLGA.toUpperCase()}`, 
          role: 'LEADER', 
          lga: matchingLGA 
        });
      } else {
        setError('Authentication failed. Check credentials or contact HQ.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">DL4ALL Portal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Katsina State Operations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Username (LGA Name)</label>
            <input 
              required
              type="text"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              placeholder="e.g. katsina"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Password</label>
            <input 
              required
              type="password"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-bold">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-tight shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};
