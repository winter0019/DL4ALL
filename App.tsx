
import React, { useState, useEffect } from 'react';
import { ReportForm } from './components/ReportForm.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Login } from './components/Login.tsx';
import { firestoreService } from './services/firestoreService.ts';
import { WeeklyReport, CloudStatus, User } from './types.ts';

// Declare window extension for TypeScript - removed local conflicting declaration as it's provided globally as AIStudio

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'REPORT' | 'ADMIN'>('REPORT');
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus | 'LOCAL-SYNC'>('CONNECTING');
  const [lastError, setLastError] = useState<any>(null);
  const [isApiKeySelected, setIsApiKeySelected] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);

  // Use useEffect to check for existing API key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore - window.aistudio is globally defined in the environment as AIStudio
      if (window.aistudio) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      }
      setCheckingKey(false);
    };
    checkKey();
  }, []);

  // Subscribe to report updates from the persistence service
  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToReports(
      (updatedReports) => {
        setReports(updatedReports);
        setCloudStatus('LOCAL-SYNC');
        setLastError(null);
      },
      (error: any) => {
        console.error("Persistence Service Error:", error);
        setCloudStatus('ERROR');
        setLastError(error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Automatically switch views based on user role
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setView('ADMIN');
    } else if (user?.role === 'LEADER') {
      setView('REPORT');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setView('REPORT');
  };

  const handleActivateAI = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success after opening dialog per instructions to mitigate race conditions
      setIsApiKeySelected(true);
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Mandatory AI Key Selection for Gemini 3 Pro series models
  if (!isApiKeySelected && !checkingKey) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Activate High-Performance AI</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            To enable deep-scan analytics and executive state briefings, this portal requires a secure connection to Google's Pro Intelligence Engine.
          </p>
          
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 text-left">
            <h4 className="text-amber-800 text-xs font-black uppercase tracking-widest mb-2">Requirements</h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              Users must select an API Key from a paid Google Cloud Project. Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-900">Billing Documentation</a> to ensure your project is properly configured.
            </p>
          </div>

          <button 
            onClick={handleActivateAI}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-tight shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            SELECT PROJECT API KEY
          </button>
          
          <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Katsina State Digital Literacy Initiative
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    CONNECTED: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    'LOCAL-SYNC': 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]',
    CONNECTING: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse',
    ERROR: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    DISCONNECTED: 'bg-slate-300'
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">DL4ALL</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                  <span className={`w-2 h-2 rounded-full ${statusColors[cloudStatus as keyof typeof statusColors] || statusColors.DISCONNECTED}`}></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {cloudStatus}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Katsina State DLCs</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
              <button 
                onClick={() => setView('REPORT')} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                  view === 'REPORT' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Reporting
              </button>
              {user.role === 'ADMIN' && (
                <button 
                  onClick={() => setView('ADMIN')} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                    view === 'ADMIN' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Analytics
                </button>
              )}
            </nav>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{user.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.lga || user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {view === 'REPORT' ? 'LGA Team Leader Portal' : 'State-Wide Operations'}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 font-medium">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              {view === 'REPORT' ? 'Submit metrics for centralized state processing.' : 'Consolidated performance data and audit logs.'}
            </p>
          </div>
        </div>

        {view === 'REPORT' ? (
          <ReportForm reports={reports} user={user} />
        ) : (
          <AdminDashboard reports={reports} error={lastError} cloudStatus={cloudStatus as CloudStatus} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="font-black text-xs">DL</span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Digital Literacy for All</p>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">
            &copy; 2026 Katsina State Government. Secure Local-Sync Persistence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
