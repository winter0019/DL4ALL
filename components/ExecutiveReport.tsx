
import React from 'react';

interface ExecutiveReportProps {
  onClose: () => void;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl flex flex-col custom-scrollbar">
        <div className="sticky top-0 bg-white px-10 py-6 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Executive Briefing</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Katsina State Performance Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-10 md:p-16">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-3xl font-black text-slate-900 mb-8 border-b-4 border-indigo-600 pb-4 inline-block">DL4ALL Katsina State</h1>
            
            <section className="mb-12">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                1. Attendance Gaps: Numeric to "ABS" Transition
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">The following teams recorded measurable activity early in January but subsequently dropped to <strong>ABS (Absent)</strong> in Week 3. These represent high-priority churn risks.</p>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-2 uppercase">Katsina LGA</h3>
                  <ul className="list-none space-y-4 p-0">
                    <li className="text-sm text-slate-700">
                      <strong>Team 02496 (Alice Ameh / Nimmyel Friday):</strong> Strong start (W1: 20, W2: 30) followed by <strong>ABS in W3</strong>.
                      <div className="mt-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full inline-block">Assessment: Critical Loss</div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 mb-2 uppercase">Batagarawa LGA</h3>
                  <ul className="list-none space-y-3 p-0">
                    <li className="text-sm text-slate-700"><strong>Team 01950:</strong> Decline (10 → 5) to ABS in W3.</li>
                    <li className="text-sm text-slate-700"><strong>Team 03011:</strong> Inconsistent performance (12 → ABS → 7).</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                2. Top Performers: High Consistency
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-3">Malumfashi Star</h3>
                  <p className="text-sm text-slate-800 font-black mb-1">TEAM 02939 (Hussaini Ladan)</p>
                  <p className="text-2xl font-black text-emerald-600">Total: 79</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-2 uppercase">Assessment: Highest State-Wide Momentum</p>
                </div>
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <h3 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-3">Kankia Recovery</h3>
                  <p className="text-sm text-slate-800 font-black mb-1">TEAM 01877 (Mariam Nana)</p>
                  <p className="text-2xl font-black text-indigo-600">Total: 60</p>
                  <p className="text-[10px] text-indigo-700 font-bold mt-2 uppercase">Assessment: Strong Post-NDB Recovery</p>
                </div>
              </div>
            </section>

            <section className="mb-12 bg-slate-900 p-8 md:p-12 rounded-[2rem] text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
               <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                 <span className="w-2 h-8 bg-amber-400 rounded-full"></span>
                 3. Strategic Recommendations
               </h2>
               <div className="space-y-8">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400">A</div>
                   <div>
                     <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Systemic Audit</p>
                     <p className="text-sm text-slate-300">Investigate the "NDB" pattern in Daura and Kankia. Attendance figures in Daura appear unusually uniform; conduct spot audits to rule out placeholder reporting.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400">B</div>
                   <div>
                     <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Targeted Intervention</p>
                     <p className="text-sm text-slate-300">Stabilize Batagarawa. The LGA exhibits high volatility. Retrain Team 01952 and deploy field visits to identify structural barriers.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400">C</div>
                   <div>
                     <p className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Resource Reallocation</p>
                     <p className="text-sm text-slate-300">Verify Team 00000 in Malumfashi. If confirmed as a ghost entry or failed deployment, reallocate resources to Team 02939 to scale high-impact zones.</p>
                   </div>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
