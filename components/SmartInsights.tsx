
import React, { useState } from 'react';
import { getSmartInsights } from '../services/geminiService';
import { WeeklyReport } from '../types';

interface SmartInsightsProps {
  reports: WeeklyReport[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ reports }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getSmartInsights(reports);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-none">Executive Insights</h3>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Gemini 3 Pro Engine</p>
          </div>
        </div>

        {!insights && !loading && (
          <div className="space-y-6">
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Process the current dataset through our advanced reasoning engine to identify performance anomalies, growth opportunities, and logistical friction points.
            </p>
            <button 
              onClick={handleGenerate}
              className="w-full sm:w-auto bg-white text-indigo-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95"
            >
              Analyze Dataset
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
            <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Deep Reasoning Active...</p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-8 text-sm text-slate-200 leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="prose prose-invert prose-slate max-w-none">
                {insights.split('\n').map((line, i) => {
                  const isHeader = line.startsWith('#') || (line.toUpperCase() === line && line.length > 5 && !line.includes(':'));
                  const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•');
                  
                  return (
                    <p key={i} className={`mb-3 ${
                      isHeader ? 'text-indigo-400 font-black uppercase tracking-widest mt-6 first:mt-0' : 
                      isBullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-indigo-500' : 
                      'font-medium opacity-90'
                    }`}>
                      {line.replace(/^[#\-•]\s*/, '')}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <button 
                onClick={() => setInsights(null)}
                className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear Results
              </button>
              <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                Generated {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
