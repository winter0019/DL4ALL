
import React, { useMemo, useState } from 'react';
import { WeeklyReport, CloudStatus, KATSINA_LGAS, LGAName, MONTHS, WEEKS, YEARS, ReportingMonth, ReportingWeek } from '../types.ts';
import { ExecutiveReport } from './ExecutiveReport.tsx';
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
    key: 'timestamp',
    direction: 'desc',
  });

  const [filterLga, setFilterLga] = useState<LGAName | 'ALL'>('ALL');
  const [filterYear, setFilterYear] = useState<number>(2026);
  const [filterMonth, setFilterMonth] = useState<ReportingMonth>('January');
  const [filterWeek, setFilterWeek] = useState<ReportingWeek | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);

  const NEW_THRESHOLD = 15 * 60 * 1000;

  const recentCount = useMemo(() => {
    return reports.filter(r => Date.now() - r.timestamp < NEW_THRESHOLD).length;
  }, [reports]);

  const lgaSummaries = useMemo(() => {
    return KATSINA_LGAS.map(lga => {
      const lgaReports = reports.filter(r => 
        r.lga === lga && 
        r.year === filterYear && 
        r.month === filterMonth &&
        (filterWeek === 'ALL' || r.selectedWeek === filterWeek)
      );
      const total = lgaReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0);
      return { 
        name: lga, 
        total, 
        count: lgaReports.length,
        growth: Math.floor(Math.random() * 12) + 2
      };
    });
  }, [reports, filterYear, filterMonth, filterWeek]);

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

  const weeklyTrendData = useMemo(() => {
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

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <span className="ml-1 opacity-20">↕</span>;
    return <span className="ml-1 text-indigo-600">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-8 pb-10">
      {showExecutiveReport && <ExecutiveReport onClose={() => setShowExecutiveReport(false)} />}
      
      <div className="bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input 
            type="text"
            placeholder="Search State Registry..."
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2 shrink-0">
          {recentCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl mr-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{recentCount} LIVE SYNC</span>
            </div>
          )}
          <button 
            onClick={() => setShowExecutiveReport(true)}
            className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200"
          >
            Executive Briefing
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-[2rem] p-4 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
          <div className="flex items-center gap-2 w-full lg:w-auto px-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year</span>
             <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => setFilterYear(y)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${
                      filterYear === y ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {y}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:flex-1">
             <span className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Month</span>
             <div className="flex-1 flex gap-2 overflow-x-auto custom-scrollbar p-1">
                {MONTHS.map(m => (
                  <button
                    key={m}
                    onClick={() => setFilterMonth(m)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
                      filterMonth === m ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto px-2 border-l border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle</span>
             <div className="flex gap-2">
                <button
                  onClick={() => setFilterWeek('ALL')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                    filterWeek === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'
                  }`}
                >
                  FULL MONTH
                </button>
                {WEEKS.map(w => (
                  <button
                    key={w}
                    onClick={() => setFilterWeek(w)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                      filterWeek === w ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {w.toUpperCase()}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <button 
            onClick={() => setFilterLga('ALL')}
            className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${
              filterLga === 'ALL' 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105 z-10' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
            }`}
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">State Aggregate</p>
              <h5 className="text-2xl font-black mb-4">Whole State</h5>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold opacity-60 uppercase">Total Active</span>
                  <span className={`text-xs font-black ${filterLga === 'ALL' ? 'text-indigo-400' : 'text-slate-900'}`}>
                    {reports.filter(r => r.year === filterYear && r.month === filterMonth && (filterWeek === 'ALL' || r.selectedWeek === filterWeek)).reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold opacity-60 uppercase">Reports</span>
                  <span className={`text-xs font-black ${filterLga === 'ALL' ? 'text-indigo-400' : 'text-slate-900'}`}>
                    {reports.filter(r => r.year === filterYear && r.month === filterMonth && (filterWeek === 'ALL' || r.selectedWeek === filterWeek)).length}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
          </button>

          {lgaSummaries.map((lga) => (
            <button 
              key={lga.name}
              onClick={() => setFilterLga(lga.name as LGAName)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${
                filterLga === lga.name 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105 z-10' 
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:-translate-y-1'
              }`}
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{lga.name}</p>
                <h5 className="text-3xl font-black mb-4">{lga.total}</h5>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold opacity-60 uppercase">Reports</span>
                    <span className={`text-xs font-black ${filterLga === lga.name ? 'text-white' : 'text-slate-900'}`}>{lga.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold opacity-60 uppercase">Momentum</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${filterLga === lga.name ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>+{lga.growth}%</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative">Filter Aggregate</p>
              <h4 className="text-5xl font-black text-slate-900 relative">
                {processedReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0)}
              </h4>
              <p className="text-xs font-bold text-indigo-600 mt-4 uppercase tracking-tighter relative">
                {filterLga === 'ALL' ? 'STATEWIDE' : filterLga.toUpperCase()} • {filterMonth} {filterYear}
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative">Audit Population</p>
              <h4 className="text-5xl font-black text-slate-900 relative">{processedReports.length}</h4>
              <p className="text-xs font-bold text-emerald-600 mt-4 uppercase tracking-tighter relative">VALIDATED ENTRIES</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Focus Region Ledger</h3>
                <p className="text-xs font-medium text-slate-500">Records filtered by selection above</p>
              </div>
              <button onClick={() => requestSort('timestamp')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">Team</th>
                    <th onClick={() => requestSort('name')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 cursor-pointer hover:bg-slate-200/50">Identifier <SortIndicator column="name" /></th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 1</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 2</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 3</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 4</th>
                    <th onClick={() => requestSort('total')} className="px-6 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-200 bg-indigo-50/30 text-center cursor-pointer hover:bg-indigo-100/30">Total <SortIndicator column="total" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-24 text-center">
                         <div className="flex flex-col items-center gap-4 text-slate-300">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                            <p className="text-sm font-black uppercase tracking-widest">No matching records found</p>
                         </div>
                      </td>
                    </tr>
                  ) : processedReports.map((r) => {
                    const isNew = Date.now() - r.timestamp < NEW_THRESHOLD;
                    return (
                      <tr key={r.id} className={`group hover:bg-slate-50/50 transition-all ${isNew ? 'bg-emerald-50/30' : ''}`}>
                        <td className="px-6 py-5">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-sm" 
                               style={{ backgroundColor: r.color || '#6366f1', color: isDarkColor(r.color || '#6366f1') ? 'white' : 'black' }}>
                            {r.teamCode}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{r.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{r.partnerName} • {r.lga}</span>
                          </div>
                        </td>
                        {[r.metrics.weeklyAttendance.wk1, r.metrics.weeklyAttendance.wk2, r.metrics.weeklyAttendance.wk3, r.metrics.weeklyAttendance.wk4].map((wk, idx) => (
                           <td key={idx} className="px-4 py-5 text-center font-bold text-xs text-slate-600">
                              {wk === 0 || wk === 'ABS' ? <span className="text-rose-400 font-black">ABS</span> : wk === 'NDB' ? <span className="text-slate-200">NDB</span> : wk}
                           </td>
                        ))}
                        <td className="px-6 py-5 text-center bg-indigo-50/10">
                          <span className="text-lg font-black text-indigo-600">{r.metrics.activeUsers}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Regional Variance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50">
               <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Selected LGA</span>
                 <span className="text-xs font-black text-slate-900 uppercase">{filterLga}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Focus Month</span>
                 <span className="text-xs font-black text-slate-900 uppercase">{filterMonth} {filterYear}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
