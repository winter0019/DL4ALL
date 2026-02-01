
import React, { useMemo, useState } from 'react';
import { WeeklyReport, CloudStatus, KATSINA_LGAS, LGAName } from '../types.ts';
import { SmartInsights } from './SmartInsights.tsx';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showExecutiveReport, setShowExecutiveReport] = useState(false);

  const lgaSummaries = useMemo(() => {
    return KATSINA_LGAS.map(lga => {
      const lgaReports = reports.filter(r => r.lga === lga);
      const total = lgaReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0);
      return { name: lga, total, count: lgaReports.length };
    });
  }, [reports]);

  const stats = useMemo(() => {
    const activeUsers = reports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0);
    return { groundTotal: activeUsers };
  }, [reports]);

  const processedReports = useMemo(() => {
    let items = reports.filter(r => {
      const matchesLga = filterLga === 'ALL' || r.lga === filterLga;
      const term = searchTerm.toLowerCase();
      const matchesSearch = r.name.toLowerCase().includes(term) || 
                           r.partnerName.toLowerCase().includes(term) ||
                           r.teamCode.toLowerCase().includes(term);
      return matchesLga && matchesSearch;
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
  }, [reports, sortConfig, filterLga, searchTerm]);

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
            placeholder="Search by Leader, Partner, or Team Code..."
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <button 
            onClick={() => setShowExecutiveReport(true)}
            className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200"
          >
            View State Briefing
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
        <button 
          onClick={() => setFilterLga('ALL')}
          className={`flex-shrink-0 px-8 py-6 rounded-[2rem] border-2 transition-all group ${
            filterLga === 'ALL' 
              ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
          }`}
        >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">State Wide</p>
          <h5 className="text-xl font-black">All Records</h5>
          <p className={`text-[10px] font-bold mt-2 ${filterLga === 'ALL' ? 'text-indigo-400' : 'text-slate-400'}`}>
            {reports.length} Active Teams
          </p>
        </button>

        {lgaSummaries.map((lga) => (
          <button 
            key={lga.name}
            onClick={() => setFilterLga(lga.name as LGAName)}
            className={`flex-shrink-0 px-8 py-6 rounded-[2rem] border-2 transition-all min-w-[180px] text-left ${
              filterLga === lga.name 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{lga.name}</p>
            <h5 className="text-xl font-black">{lga.total}</h5>
            <p className={`text-[10px] font-bold mt-2 ${filterLga === lga.name ? 'text-indigo-200' : 'text-slate-400'}`}>
              {lga.count} Active Entries
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative">Focus Performance</p>
              <h4 className="text-5xl font-black text-slate-900 relative">
                {processedReports.reduce((acc, r) => acc + (Number(r.metrics.activeUsers) || 0), 0)}
              </h4>
              <p className="text-xs font-bold text-indigo-600 mt-4 uppercase tracking-tighter relative">
                {filterLga === 'ALL' ? 'State Aggregate' : `${filterLga} Region Total`}
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative">Records Selected</p>
              <h4 className="text-5xl font-black text-slate-900 relative">{processedReports.length}</h4>
              <p className="text-xs font-bold text-emerald-600 mt-4 uppercase tracking-tighter relative">Filtered Dataset Size</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Focus Region Ledger</h3>
                <p className="text-xs font-medium text-slate-500">Currently viewing {filterLga} operations</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => requestSort('timestamp')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500" title="Sort by Recency">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50">
                    <th onClick={() => requestSort('teamCode')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 cursor-pointer hover:bg-slate-200/50">Team <SortIndicator column="teamCode" /></th>
                    <th onClick={() => requestSort('name')} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 cursor-pointer hover:bg-slate-200/50">Name / Partner <SortIndicator column="name" /></th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 1</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 2</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 3</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 text-center">WK 4</th>
                    <th onClick={() => requestSort('total')} className="px-6 py-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-200 bg-indigo-50/30 text-center cursor-pointer hover:bg-indigo-100/30 transition-colors">Total <SortIndicator column="total" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedReports.map((r) => {
                    const isNew = Date.now() - r.timestamp < 60000;
                    return (
                      <tr key={r.id} className={`group transition-all duration-300 relative ${
                        isNew 
                          ? 'bg-emerald-50/40 border-l-4 border-l-emerald-500' 
                          : 'hover:bg-slate-50/50 border-l-4 border-l-transparent'
                      }`}>
                        <td className="px-6 py-5 align-middle">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-sm relative group-hover:scale-110 transition-transform" 
                               style={{ backgroundColor: r.color || '#6366f1', color: isDarkColor(r.color || '#6366f1') ? 'white' : 'black' }}>
                            {r.teamCode}
                            {isNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-bounce"></span>}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              {filterLga === 'ALL' && <span className="text-[9px] font-black text-indigo-600 uppercase">{r.lga}</span>}
                              {isNew && (
                                <span className="px-1.5 py-0.5 bg-emerald-600 text-[8px] font-black text-white rounded-md tracking-widest animate-subtle-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{r.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Partner: {r.partnerName}</span>
                          </div>
                        </td>
                        {[r.metrics.weeklyAttendance.wk1, r.metrics.weeklyAttendance.wk2, r.metrics.weeklyAttendance.wk3, r.metrics.weeklyAttendance.wk4].map((wk, idx) => (
                          <td key={idx} className="px-4 py-5 text-center font-bold text-xs text-slate-600">
                            {wk === 0 || wk === 'ABS' ? <span className="text-slate-300">ABS</span> : wk === 'NDB' ? <span className="text-slate-200">NDB</span> : wk}
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

        <div className="lg:col-span-4 space-y-8">
          <SmartInsights reports={processedReports} />
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Attendance Gaps</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40}>
                    {weeklyTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === (weeklyTrendData.length - 1) ? '#6366f1' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase text-center tracking-[0.1em]">Metric aggregation for selected region</p>
          </div>
        </div>
      </div>
    </div>
  );
};
