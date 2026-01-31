
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
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Gemini Smart Insights</h3>
            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">AI Analysis Engine</p>
          </div>
        </div>

        {!insights && !loading && (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              Generate an automated performance audit and strategic summary of all LGA reports using Google's advanced intelligence.
            </p>
            <button 
              onClick={handleGenerate}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-xl"
            >
              Generate AI Summary
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-white rounded-full animate-spin mb-3"></div>
            <p className="text-indigo-200 text-sm font-bold animate-pulse">Analyzing state-wide metrics...</p>
          </div>
        )}

        {insights && !loading && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-sm text-slate-100 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="prose prose-invert prose-sm">
              {insights.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
            <button 
              onClick={() => setInsights(null)}
              className="mt-6 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-300"
            >
              Reset Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
