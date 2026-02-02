
import React, { useMemo, useState } from 'react';
import { WeeklyReport, CloudStatus, KATSINA_LGAS, LGAName, MONTHS, WEEKS, YEARS, ReportingMonth, ReportingWeek } from '../types.ts';
import { ExecutiveReport } from './ExecutiveReport.tsx';
import { SmartInsights } from './SmartInsights.tsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';

interface AdminDashboardProps {
  reports: WeeklyReport[];
  error: any;
  cloudStatus: CloudStatus;
}

type SortKey = 'lga' | 'teamCode' | 'name' | 'total' | 'timestamp';
type SortDirection = 'asc' | 'desc';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'total',
    direction: 'desc',
  });

  const [filterLga, setFilterLga] = useState<LGAName | 'ALL'>('ALL');
  const [filterYear, setFilterYear] = useState<number>(2026);
  const [filterMonth, setFilterMonth] = useState<ReportingMonth>('January');
  const [filterWeek, setFilterWeek] = useState<ReportingWeek | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <span className="ml-1 opacity-20">↕</span>;
    return <span className="ml-1 text-indigo-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  const lgaSummaries = useMemo(() => {
    const summaries = KATSINA_LGAS.map(lga => {
      const lgaReports = reports.filter(r => 
        r.lga === lga && 
        r.year === filterYear && 
        r.month === filterMonth &&
        (filterWeek === 'ALL' || r.selectedWeek === filterWeek)
      );
      const totalActive = lgaReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0);
      return { 
        name: lga, 
        totalActive, 
        totalReports: lgaReports.length,
        avgEngagement: lgaReports.length > 0 ? (totalActive / lgaReports.length).toFixed(1) : 0
      };
    });
    // Rank by performance volume
    return summaries.sort((a, b) => b.totalActive - a.totalActive);
  }, [reports, filterYear, filterMonth, filterWeek]);

  const topLGA = lgaSummaries[0];

  const processedReports = useMemo(() => {
    let items = reports.filter(r => {
      const matchesLga = filterLga === 'ALL' || r.lga === filterLga;
      const matchesYear = r.year === filterYear;
      const matchesMonth = r.month === filterMonth;
      const matchesWeek = filterWeek === 'ALL' || r.selectedWeek === filterWeek;
      
      const term = searchTerm.toLowerCase();
      const matchesSearch = r.name.toLowerCase().includes(term) || 
                           r.partnerName.toLowerCase().includes(term) ||
                           r.teamCode.toLowerCase().includes(term);
      return matchesLga && matchesYear && matchesMonth && matchesWeek && matchesSearch;
    });

    items.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof WeeklyReport];
      let bValue: any = b[sortConfig.key as keyof WeeklyReport];

      if (sortConfig.key === 'total') {
        aValue = Number(a.metrics.activeUsers) || 0;
        bValue = Number(b.metrics.activeUsers) || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [reports, sortConfig, filterLga, filterYear, filterMonth, filterWeek, searchTerm]);

  const topTeam = useMemo(() => {
    if (processedReports.length === 0) return null;
    return [...processedReports].sort((a, b) => (Number(b.metrics.activeUsers) || 0) - (Number(a.metrics.activeUsers) || 0))[0];
  }, [processedReports]);

  const totalActiveUsers = useMemo(() => {
    return processedReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0);
  }, [processedReports]);

  const attendanceTrend = useMemo(() => {
    const trend = [
      { name: 'WK 1', value: 0 },
      { name: 'WK 2', value: 0 },
      { name: 'WK 3', value: 0 },
      { name: 'WK 4', value: 0 },
    ];
    processedReports.forEach(r => {
      const b = r.metrics.weeklyAttendance;
      const parseVal = (v: any) => typeof v === 'number' ? v : 0;
      trend[0].value += parseVal(b.wk1);
      trend[1].value += parseVal(b.wk2);
      trend[2].value += parseVal(b.wk3);
      trend[3].value += parseVal(b.wk4);
    });
    return trend;
  }, [processedReports]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const isDarkColor = (hex: string) => {
    if (!hex) return true;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 150;
  };

  const selectStyle = "bg-white border border-slate-200 rounded-2xl px-5 py-3 text-xs font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-sm hover:border-slate-300";

  return (
    <div className="space-y-12 pb-20">
      {showExecutiveReport && <ExecutiveReport onClose={() => setShowExecutiveReport(false)} />}
      
      {/* 1. STATE SNAPSHOT & PERFORMANCE CHAMPIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col md:flex-row items-center gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="grid grid-cols-2 md:flex items-center gap-10 w-full md:w-auto md:border-r border-slate-100 pr-0 md:pr-12">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">State Aggregate</p>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{totalActiveUsers}</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Active Users</p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Audit Population</p>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{processedReports.length}</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Total Records</p>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <div className="relative flex-1 w-full">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input 
                type="text"
                placeholder="Search Team Identity..."
                className="w-full bg-slate-50 border-none rounded-[1.5rem] pl-14 pr-8 py-5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">State Operation Champion</p>
            {topTeam ? (
              <>
                <h3 className="text-2xl font-black tracking-tight mb-2">{topTeam.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">{topTeam.lga}</span>
                  <span className="text-lg font-black">{topTeam.metrics.activeUsers} Active</span>
                </div>
              </>
            ) : (
              <h3 className="text-xl font-black">Scanning Ledger...</h3>
            )}
            <button 
              onClick={() => setShowExecutiveReport(true)}
              className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg"
            >
              Strategic Briefing
            </button>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <svg className="w-24 h-24 text-white/5 absolute bottom-0 right-0 -mr-6 -mb-6 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
      </div>

      {/* 2. GLOBAL FILTERS BAR */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 lg:space-y-0 lg:flex lg:items-center lg:gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cycle Analysis</span>
          <div className="relative group">
            <select className={selectStyle} value={filterYear} onChange={(e) => setFilterYear(Number(e.target.value))}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg></div>
          </div>
          <div className="relative group">
            <select className={selectStyle} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value as ReportingMonth)}>
              {MONTHS.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg></div>
          </div>
          <div className="relative group">
            <select className={selectStyle} value={filterWeek} onChange={(e) => setFilterWeek(e.target.value as ReportingWeek | 'ALL')}>
              <option value="ALL">ALL WEEKS</option>
              {WEEKS.map(w => <option key={w} value={w}>{w.toUpperCase()}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg></div>
          </div>
        </div>
        
        <div className="h-10 w-px bg-slate-100 hidden lg:block"></div>
        
        <div className="flex-1 overflow-x-auto custom-scrollbar flex gap-2 p-1">
          <button
            onClick={() => setFilterLga('ALL')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              filterLga === 'ALL' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            CONSORTIUM
          </button>
          {KATSINA_LGAS.map((lga) => (
            <button
              key={lga}
              onClick={() => setFilterLga(lga)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filterLga === lga ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {lga}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LGA SCORECARDS - REDESIGNED FOR SUPERIOR ORGANIZATION */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Regional Scorecard</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Ranked by Operational Aggregate</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-400 uppercase">Top Cluster:</span>
             <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">{topLGA.name}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {lgaSummaries.map((lga, idx) => (
            <button 
              key={lga.name}
              onClick={() => setFilterLga(lga.name as LGAName)}
              className={`group p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden flex flex-col justify-between h-auto md:h-[280px] ${
                filterLga === lga.name 
                  ? 'bg-white border-indigo-600 shadow-2xl scale-[1.02] z-10' 
                  : 'bg-white border-white text-slate-600 hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx < 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lga.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${lga.totalActive > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active State</span>
                      </div>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-tighter border border-emerald-100">Market Leader</span>
                  )}
                </div>

                <div className="mt-4 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h5 className="text-6xl font-black text-slate-900 tracking-tighter">{lga.totalActive}</h5>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Aggregate</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Records</p>
                    <p className="text-xl font-black text-slate-900 leading-none">{lga.totalReports}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                    <p className="text-xl font-black text-emerald-600 leading-none">{lga.avgEngagement}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-slate-50/50 rounded-full blur-3xl -mr-20 -mb-20 group-hover:bg-indigo-50/50 transition-colors duration-500"></div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN LEDGER SECTION */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Consolidated Ledger</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">
              {filterLga === 'ALL' ? 'State-Wide Directives' : `${filterLga} Region Audit`}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{processedReports.length} Authenticated Entries</span>
             </div>
             <button onClick={() => requestSort('total')} className="p-4 bg-[#0F172A] rounded-2xl hover:bg-indigo-600 transition-all text-white shadow-xl shadow-slate-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Identity</th>
                <th onClick={() => requestSort('name')} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">Supervisor <SortIndicator column="name" /></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Wk 1</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Wk 2</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Wk 3</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Wk 4</th>
                <th onClick={() => requestSort('total')} className="px-10 py-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center cursor-pointer bg-indigo-50/30">Active Total <SortIndicator column="total" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedReports.map((r) => (
                <tr key={r.id} className="group hover:bg-slate-50/20 transition-colors">
                  <td className="px-10 py-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm" 
                         style={{ backgroundColor: r.color || '#6366f1', color: isDarkColor(r.color || '#6366f1') ? 'white' : 'black' }}>
                      {r.teamCode}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{r.lga}</span>
                      <span className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">{r.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner: {r.partnerName}</span>
                    </div>
                  </td>
                  {[r.metrics.weeklyAttendance.wk1, r.metrics.weeklyAttendance.wk2, r.metrics.weeklyAttendance.wk3, r.metrics.weeklyAttendance.wk4].map((wk, idx) => (
                    <td key={idx} className="px-6 py-8 text-center text-sm font-bold">
                      {wk === 0 || wk === 'ABS' ? <span className="text-rose-400 opacity-60">ABS</span> : wk === 'NDB' ? <span className="opacity-20">NDB</span> : <span className="text-slate-900 font-black">{wk}</span>}
                    </td>
                  ))}
                  <td className="px-10 py-8 text-center bg-indigo-50/5">
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">{r.metrics.activeUsers}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. STRATEGIC ANALYTICS */}
      <div className="space-y-12">
        <SmartInsights reports={processedReports} />
        
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Operational Cycle Velocity</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Aggregated Engagement Trend Analysis</p>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={20}/>
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}}/>
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px'}}/>
                <Bar dataKey="value" fill="#6366f1" radius={[14, 14, 0, 0]} barSize={64}>
                  {attendanceTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#6366f1' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
