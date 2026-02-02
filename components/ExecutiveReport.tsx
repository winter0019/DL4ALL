
import React from 'react';

interface ExecutiveReportProps {
  onClose: () => void;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ onClose }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[1rem] shadow-2xl flex flex-col custom-scrollbar border-t-[12px] border-indigo-900">
        <div className="sticky top-0 bg-white px-12 py-8 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-xl">
              <span className="font-black text-lg">KS</span>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase">Katsina State Government</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office of Strategic Performance Analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-12 md:p-20 font-serif text-slate-800">
          <div className="border-b-2 border-slate-900 pb-8 mb-12">
            <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">MEMORANDUM</h1>
            <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
              <span className="font-black text-slate-500 uppercase">TO:</span>
              <span className="font-bold">DL4ALL Project Steering Committee / Katsina State Program Lead</span>
              
              <span className="font-black text-slate-500 uppercase">FROM:</span>
              <span className="font-bold">Performance Analysis Unit</span>
              
              <span className="font-black text-slate-500 uppercase">DATE:</span>
              <span className="font-bold">{currentDate}</span>
              
              <span className="font-black text-slate-500 uppercase">SUBJECT:</span>
              <span className="font-bold border-b border-slate-900 pb-1">Performance Audit & Operational Risk Assessment: Regional Pilot Clusters</span>
            </div>
          </div>

          <div className="space-y-12 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">I. Executive Summary</h2>
              <p>
                An analysis of the most recent four-week performance cycle reveals high variability in operational output across primary clusters. 
                While the initiative continues to demonstrate significant mid-cycle promise, the data indicates localized systemic challenges in reporting 
                consistency toward the end of the operational month. Immediate, data-driven intervention is recommended to prevent program attrition in high-density urban zones.
              </p>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">II. Top Performers & High Output Velocity</h2>
              <p className="mb-6">
                Despite broader volatility, specific regions have maintained an "Output Velocity" that should serve as a benchmark for the state.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
                  <h3 className="text-xs font-black text-emerald-700 uppercase mb-2">Regional Leader (Volume)</h3>
                  <p className="text-lg font-black text-slate-900">Katsina Central Cluster</p>
                  <p className="text-sm mt-2 opacity-80">Currently maintaining the highest aggregate active volume with peak state performance recorded in the mid-month surge.</p>
                </div>
                <div className="bg-slate-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
                  <h3 className="text-xs font-black text-indigo-700 uppercase mb-2">Operational Star (Durability)</h3>
                  <p className="text-lg font-black text-slate-900">Team 02636 (Batagarawa)</p>
                  <p className="text-sm mt-2 opacity-80">Demonstrating a "Sustainable Reporting Pulse." This team is the only unit consistently maintaining activity through the Week 4 transition.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">III. Attendance Gaps & Churn Risk</h2>
              <p className="mb-4">
                We have identified a critical "Phase-Out" pattern where teams demonstrate initial competence followed by an abrupt cessation of field activity.
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li><span className="font-bold">High-Risk Churn:</span> Deployment 02496 demonstrated a high-growth trajectory early in the cycle before a total blackout in Week 3. This suggests a failure of retention rather than capability.</li>
                <li><span className="font-bold">Systemic Reporting Failure:</span> The "Week 4 Blackout" across 80% of urban teams indicates an administrative bottleneck, likely linked to logistical synchronization or localized access issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">IV. Mandated Strategic Directives</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="font-black text-indigo-600">01.</span>
                  <p><span className="font-bold">Immediate Re-Engagement:</span> Conduct emergency field audits for teams showing high-volume capability followed by zero-reporting. Identify and resolve field-level disputes within 48 hours.</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-black text-indigo-600">02.</span>
                  <p><span className="font-bold">Administrative Correction:</span> Investigate the discrepancy between Batagarawa's sustained activity and Katsina Central's Week 4 drop-off. Replicate the Batagarawa field coordination model state-wide.</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-black text-indigo-600">03.</span>
                  <p><span className="font-bold">Resource Optimization:</span> Teams with consistent "ABS" entries across a 21-day period are to be placed on immediate probation or replaced to ensure effective resource allocation.</p>
                </div>
              </div>
            </section>

            <div className="pt-12 mt-12 border-t border-slate-100 flex justify-between items-end">
              <div className="space-y-1">
                <div className="h-0.5 w-40 bg-slate-900"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">Authorized by the Performance Analysis Unit</p>
              </div>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">End of Briefing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
