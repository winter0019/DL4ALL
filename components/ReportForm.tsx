
import React, { useState, useRef, useEffect } from 'react';
import { KATSINA_LGAS, WeeklyReport, LGAName, User, MONTHS, WEEKS, YEARS, ReportingMonth, ReportingWeek } from '../types';
import { firestoreService } from '../services/firestoreService';
import { extractDataFromDocument } from '../services/geminiService';

interface ReportFormProps {
  reports: WeeklyReport[];
  user: User;
}

const LGA_TEAMS: Record<string, string[]> = {
  Katsina: ['Team 02162', 'Team 02496', 'Team 02492', 'Team 02495', 'Team 02166'],
  Malumfashi: ['Team 02939', 'Team 02168', 'Team 02169', 'Team 04360', 'Team 00000'],
  Kankia: [
    'Team 02159', 'Team 02161', 'Team 01877', 'Team 01878', 'Team 02160', 'Team 02938'
  ],
  Batagarawa: [
    'Team 02636', 'Team 02637', 'Team 02638', 'Team 02698', 'Team 01952',
    'Team 01950', 'Team 03011', 'Team 02985', 'Team 02639', 'Team 03549'
  ],
  Mashi: ['Team 06401', 'Team 06402'],
  Daura: [
    'Team 01879', 'Team 01880', 'Team 01881', 'Team 01882', 'Team 03719', 
    'Team 03720', 'Team 03721', 'Team 03536', 'Team 03537', 'Team 04237', 'Team 04238'
  ],
};

export const ReportForm: React.FC<ReportFormProps> = ({ user }) => {
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    lga: (user.lga || '') as LGAName | '',
    teamCode: '',
    year: 2026,
    month: 'January' as ReportingMonth,
    week: 'Week 1' as ReportingWeek,
    attendance: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'NO DATA',
    meritScore: 0,
    challenges: ''
  });

  useEffect(() => {
    if (user.lga) {
      setFormData(prev => ({ ...prev, lga: user.lga as LGAName }));
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await extractDataFromDocument(base64, file.type);
        
        if (extracted) {
          const extractedLGA = extracted.lga as LGAName;
          const isAuthorized = user.role === 'ADMIN' || extractedLGA === user.lga;

          if (isAuthorized) {
            setFormData(prev => ({
              ...prev,
              lga: extractedLGA || prev.lga,
              teamCode: extracted.teamCode ? `Team ${extracted.teamCode}` : prev.teamCode,
              meritScore: extracted.total || 0,
            }));
          } else {
            alert(`Unauthorized: You cannot upload records for ${extractedLGA}.`);
          }
        }
        setScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Scan failed", error);
      setScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lga || !formData.teamCode) return;

    setSubmitting(true);
    
    try {
      const newReport: WeeklyReport = {
        id: Math.random().toString(36).substr(2, 9),
        lga: formData.lga as LGAName,
        teamCode: formData.teamCode.split(' ')[1] || '00000',
        name: user.name,
        partnerName: 'DL4ALL Ops',
        month: formData.month,
        selectedWeek: formData.week,
        year: formData.year,
        weekEnding: new Date().toISOString(),
        color: '#6366F1',
        metrics: {
          totalEnrolled: 0,
          activeUsers: formData.attendance === 'PRESENT' ? formData.meritScore : 0,
          certificatesIssued: 0,
          communityOutreach: 0,
          femaleCount: 0,
          maleCount: 0,
          weeklyAttendance: { 
            wk1: formData.week === 'Week 1' ? (formData.attendance === 'PRESENT' ? formData.meritScore : 'ABS') : 0,
            wk2: formData.week === 'Week 2' ? (formData.attendance === 'PRESENT' ? formData.meritScore : 'ABS') : 0,
            wk3: formData.week === 'Week 3' ? (formData.attendance === 'PRESENT' ? formData.meritScore : 'ABS') : 0,
            wk4: formData.week === 'Week 4' ? (formData.attendance === 'PRESENT' ? formData.meritScore : 'ABS') : 0,
          }
        },
        infrastructure: { functionalDevices: 0, internetStatus: 'Excellent', powerAvailability: 100 },
        challenges: formData.challenges,
        timestamp: Date.now()
      };

      await firestoreService.submitReport(newReport);
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData(prev => ({ ...prev, meritScore: 0, challenges: '' }));
    } catch (err) {
      console.error("Submit failed", err);
      setSubmitting(false);
    }
  };

  const inputLabelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block";
  const selectWrapperClass = "relative group";
  const selectClass = "w-full bg-[#F1F5F9]/80 border-none rounded-2xl px-6 py-5 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer transition-all pr-12";

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Smart Scanner Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${scanning ? 'bg-indigo-600 animate-pulse' : 'bg-slate-50'}`}>
            <svg className={`w-7 h-7 ${scanning ? 'text-white animate-spin' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-base leading-tight">Smart Data Entry</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan Document for automatic form assistance</p>
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="w-full md:w-auto px-10 py-4 bg-[#0F172A] text-white rounded-[1.25rem] text-[10px] font-black tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
        >
          {scanning ? 'SCANNING...' : 'SELECT DOCUMENT'}
        </button>
        <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
      </div>

      {/* Main Entry Form */}
      <div className="bg-white rounded-[3.5rem] p-12 md:p-20 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
        <div className="flex items-center gap-6 mb-16">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Weekly Performance</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Team Performance Registry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className={selectWrapperClass}>
              <label className={inputLabelClass}>Local Gov Area</label>
              <select 
                disabled={user.role !== 'ADMIN'}
                className={`${selectClass} ${user.role !== 'ADMIN' ? 'bg-slate-50 opacity-60' : ''}`}
                value={formData.lga}
                onChange={(e) => setFormData({ ...formData, lga: e.target.value as LGAName, teamCode: '' })}
              >
                {user.role === 'ADMIN' && <option value="">Select LGA</option>}
                {KATSINA_LGAS.map(lga => <option key={lga} value={lga}>{lga}</option>)}
              </select>
              <div className="absolute right-6 top-[72px] -translate-y-1/2 pointer-events-none text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <div className={selectWrapperClass}>
              <label className={inputLabelClass}>Operations Team</label>
              <select 
                disabled={!formData.lga}
                className={`${selectClass} ${!formData.lga ? 'opacity-50' : ''}`}
                value={formData.teamCode}
                onChange={(e) => setFormData({ ...formData, teamCode: e.target.value })}
              >
                <option value="">{formData.lga ? 'Select Team Code' : 'Awaiting LGA...'}</option>
                {formData.lga && LGA_TEAMS[formData.lga].map(team => <option key={team} value={team}>{team}</option>)}
              </select>
              <div className="absolute right-6 top-[72px] -translate-y-1/2 pointer-events-none text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={selectWrapperClass}>
              <label className={inputLabelClass}>Year</label>
              <select 
                className={selectClass} 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="absolute right-6 top-[72px] -translate-y-1/2 pointer-events-none text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <div className={selectWrapperClass}>
              <label className={inputLabelClass}>Month</label>
              <select 
                className={selectClass} 
                value={formData.month} 
                onChange={e => setFormData({...formData, month: e.target.value as ReportingMonth})}
              >
                {MONTHS.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
              </select>
              <div className="absolute right-6 top-[72px] -translate-y-1/2 pointer-events-none text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <div className={selectWrapperClass}>
              <label className={inputLabelClass}>Week</label>
              <select 
                className={selectClass} 
                value={formData.week} 
                onChange={e => setFormData({...formData, week: e.target.value as ReportingWeek})}
              >
                {WEEKS.map(w => <option key={w} value={w}>{w.toUpperCase()}</option>)}
              </select>
              <div className="absolute right-6 top-[72px] -translate-y-1/2 pointer-events-none text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <div className="py-12 text-center border-y border-slate-50">
            <label className={`${inputLabelClass} text-center`}>Active Users Detected</label>
            <div className="relative inline-block mt-4">
              <input 
                type="number"
                className="w-64 text-center text-9xl font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 tracking-tighter"
                value={formData.meritScore}
                onChange={(e) => setFormData({ ...formData, meritScore: parseInt(e.target.value) || 0 })}
              />
              <div className="h-1.5 w-full bg-indigo-600/10 rounded-full mt-4"></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 font-black text-sm animate-bounce">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                TRANSMISSION SUCCESSFUL
              </div>
            )}
            <button
              disabled={submitting || !formData.lga || !formData.teamCode}
              type="submit"
              className={`w-full max-w-lg py-6 rounded-[1.75rem] font-black text-sm tracking-widest shadow-2xl transition-all ${
                submitting || !formData.lga || !formData.teamCode
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
              }`}
            >
              {submitting ? 'SYNCING DATA...' : 'SAVE TO CENTRAL LEDGER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
