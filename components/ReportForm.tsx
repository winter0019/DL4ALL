
import React, { useState, useRef, useEffect } from 'react';
import { KATSINA_LGAS, WeeklyReport, LGAName, User } from '../types';
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

export const ReportForm: React.FC<ReportFormProps> = ({ reports, user }) => {
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    lga: (user.lga || '') as LGAName | '',
    teamCode: '',
    period: 'Jan-26',
    week: 'Week 1',
    attendance: 'PRESENT' as 'PRESENT' | 'ABSENT' | 'NO DATA',
    meritScore: 0,
    challenges: ''
  });

  // Sync LGA if user changes or initially loads
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
          // If admin, they can extract any LGA. If leader, check it matches.
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
            alert(`You are not authorized to upload records for ${extractedLGA}.`);
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
        partnerName: 'DL4ALL Operations',
        weekEnding: '2026-01-31',
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
      alert("Submission failed. Check your internet connection.");
    }
  };

  const inputLabelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 block";
  const selectClass = "w-full bg-[#F1F5F9]/60 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer transition-all";

  const isLgaDisabled = user.role !== 'ADMIN';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* AI Smart Update Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${scanning ? 'bg-indigo-600 animate-pulse' : 'bg-slate-100'}`}>
            <svg className={`w-6 h-6 ${scanning ? 'text-white animate-spin' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">AI Smart-Update Available</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload PDF for {user.lga || 'State'} records</p>
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 transition-transform active:scale-95"
        >
          {scanning ? 'SCANNING...' : 'SELECT DOCUMENT'}
        </button>
        <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-16 -mt-16 opacity-50"></div>

        <div className="flex items-center gap-5 mb-16">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Performance Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Row 1: LGA and Team Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={inputLabelClass}>Local Gov Area</label>
              <select 
                disabled={isLgaDisabled}
                className={`${selectClass} ${isLgaDisabled ? 'bg-slate-50 cursor-not-allowed opacity-80' : ''}`}
                value={formData.lga}
                onChange={(e) => setFormData({ ...formData, lga: e.target.value as LGAName, teamCode: '' })}
              >
                {!isLgaDisabled && <option value="">Select LGA</option>}
                {KATSINA_LGAS.map(lga => <option key={lga} value={lga}>{lga}</option>)}
              </select>
            </div>
            <div>
              <label className={inputLabelClass}>Team Selection</label>
              <select 
                disabled={!formData.lga}
                className={`${selectClass} ${!formData.lga ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={formData.teamCode}
                onChange={(e) => setFormData({ ...formData, teamCode: e.target.value })}
              >
                <option value="">{formData.lga ? 'Select Team' : 'Select LGA First'}</option>
                {formData.lga && LGA_TEAMS[formData.lga].map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={inputLabelClass}>Reporting Period</label>
              <select className={selectClass} value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})}>
                <option>Jan-26</option>
                <option>Feb-26</option>
              </select>
            </div>
            <div>
              <label className={inputLabelClass}>Week</label>
              <select className={selectClass} value={formData.week} onChange={e => setFormData({...formData, week: e.target.value})}>
                <option>Week 1</option>
                <option>Week 2</option>
                <option>Week 3</option>
                <option>Week 4</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <label className={`${inputLabelClass} text-center`}>Center Attendance</label>
            <div className="inline-flex bg-[#F1F5F9]/60 p-1.5 rounded-2xl border border-slate-100">
              {['PRESENT', 'ABSENT', 'NO DATA'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance: status as any })}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                    formData.attendance === status 
                      ? 'bg-white text-indigo-600 shadow-lg ring-1 ring-slate-200' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="py-10 text-center border-y border-slate-100">
            <label className={`${inputLabelClass} text-center`}>Weekly Merit Score</label>
            <div className="relative inline-block mt-4 group">
              <input 
                type="number"
                className="w-48 text-center text-7xl font-black text-indigo-600 bg-transparent border-none outline-none focus:ring-0"
                value={formData.meritScore}
                onChange={(e) => setFormData({ ...formData, meritScore: parseInt(e.target.value) || 0 })}
              />
              <div className="h-2 w-full bg-indigo-600/5 rounded-full mt-2 group-focus-within:bg-indigo-600/10 transition-colors"></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Validated Ground Metrics Only</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 font-black text-sm animate-bounce">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                SYNC SUCCESSFUL
              </div>
            )}
            <button
              disabled={submitting || !formData.lga}
              type="submit"
              className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black text-sm tracking-tight shadow-2xl transition-all ${
                submitting || !formData.lga
                  ? 'bg-slate-300 text-white cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
              }`}
            >
              {submitting ? 'TRANSMITTING...' : 'SAVE TO STATE LEDGER'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="flex justify-center gap-10 text-slate-400">
         <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
         </div>
      </div>
    </div>
  );
};
