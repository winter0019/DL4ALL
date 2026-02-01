
import { WeeklyReport, LGAName, ReportingMonth, ReportingWeek } from '../types';

const INITIAL_MOCK_DATA: WeeklyReport[] = [
  // --- KATSINA LGA DATA ---
  { id: 'kt-1', lga: 'Katsina', teamCode: '02162', name: 'ZUWAIRA KALLA', partnerName: 'DOGARA MUSA', month: 'January', selectedWeek: 'Week 3', year: 2026, weekEnding: '2026-01-31', color: '#F48232', 
    metrics: { totalEnrolled: 450, activeUsers: 52, certificatesIssued: 12, weeklyAttendance: { wk1: 19, wk2: 10, wk3: 23, wk4: 0 }, communityOutreach: 5, femaleCount: 220, maleCount: 230 },
    infrastructure: { functionalDevices: 50, internetStatus: 'Excellent', powerAvailability: 95 }, challenges: 'Consistent growth.', timestamp: Date.now() - 200000 },
  { id: 'kt-2', lga: 'Katsina', teamCode: '02496', name: 'ALICE AMEH', partnerName: 'NIMMYEL FRIDAY', month: 'January', selectedWeek: 'Week 2', year: 2026, weekEnding: '2026-01-31', color: '#0D2137', 
    metrics: { totalEnrolled: 400, activeUsers: 50, certificatesIssued: 8, weeklyAttendance: { wk1: 20, wk2: 30, wk3: 'ABS', wk4: 0 }, communityOutreach: 3, femaleCount: 180, maleCount: 220 },
    infrastructure: { functionalDevices: 45, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Absent in WK3.', timestamp: Date.now() - 300000 },
  { id: 'kt-3', lga: 'Katsina', teamCode: '02492', name: 'JAMES OLATEJU', partnerName: 'PATIENCE GABRIEL', month: 'January', selectedWeek: 'Week 3', year: 2026, weekEnding: '2026-01-31', color: '#084B6F', 
    metrics: { totalEnrolled: 350, activeUsers: 20, certificatesIssued: 5, weeklyAttendance: { wk1: 'ABS', wk2: 5, wk3: 15, wk4: 0 }, communityOutreach: 2, femaleCount: 150, maleCount: 200 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Poor', powerAvailability: 60 }, challenges: 'Infrastructure issues early month.', timestamp: Date.now() - 400000 },
  { id: 'kt-4', lga: 'Katsina', teamCode: '02495', name: 'SENJONG DAWULENG', partnerName: 'OGAR IYOWO', month: 'January', selectedWeek: 'Week 2', year: 2026, weekEnding: '2026-01-31', color: '#006B2B', 
    metrics: { totalEnrolled: 300, activeUsers: 10, certificatesIssued: 2, weeklyAttendance: { wk1: 'ABS', wk2: 10, wk3: 'ABS', wk4: 0 }, communityOutreach: 1, femaleCount: 100, maleCount: 200 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 70 }, challenges: 'Low engagement.', timestamp: Date.now() - 500000 },
  { id: 'kt-5', lga: 'Katsina', teamCode: '02166', name: 'FATIMA YUSUF', partnerName: 'VICTOR BALA', month: 'January', selectedWeek: 'Week 2', year: 2026, weekEnding: '2026-01-31', color: '#9B26AF', 
    metrics: { totalEnrolled: 420, activeUsers: 51, certificatesIssued: 15, weeklyAttendance: { wk1: 'ABS', wk2: 31, wk3: 20, wk4: 0 }, communityOutreach: 4, femaleCount: 200, maleCount: 220 },
    infrastructure: { functionalDevices: 48, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'Strong mid-month surge.', timestamp: Date.now() - 600000 },
  { id: 'kt-6', lga: 'Katsina', teamCode: '02697', name: 'PEACE JOSEPH', partnerName: 'JAMES AYEREWAJU', month: 'January', selectedWeek: 'Week 2', year: 2026, weekEnding: '2026-01-31', color: '#60B236', 
    metrics: { totalEnrolled: 500, activeUsers: 60, certificatesIssued: 20, weeklyAttendance: { wk1: 'ABS', wk2: 41, wk3: 19, wk4: 0 }, communityOutreach: 6, femaleCount: 250, maleCount: 250 },
    infrastructure: { functionalDevices: 55, internetStatus: 'Excellent', powerAvailability: 100 }, challenges: 'Peak state performance.', timestamp: Date.now() - 700000 },
  
  // --- BATAGARAWA LGA DATA ---
  { id: 'bat-1', lga: 'Batagarawa', teamCode: '02636', name: 'DANLADI BASHIR', partnerName: 'GODWIN SOLOMON', month: 'January', selectedWeek: 'Week 4', year: 2026, weekEnding: '2026-01-31', color: '#6366f1', 
    metrics: { totalEnrolled: 300, activeUsers: 50, certificatesIssued: 10, weeklyAttendance: { wk1: 0, wk2: 25, wk3: 17, wk4: 8 }, communityOutreach: 2, femaleCount: 150, maleCount: 150 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Steady attendance.', timestamp: Date.now() - 1200000 },
];

const STORAGE_KEY = 'dl4all_local_ledger';

const getStoredData = (): WeeklyReport[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MOCK_DATA;
  }
};

let listeners: ((data: WeeklyReport[]) => void)[] = [];

export const firestoreService = {
  subscribeToReports: (onUpdate: (reports: WeeklyReport[]) => void, onError: (error: any) => void) => {
    const data = getStoredData();
    setTimeout(() => onUpdate(data), 100);
    listeners.push(onUpdate);
    return () => { listeners = listeners.filter(l => l !== onUpdate); };
  },

  submitReport: async (report: WeeklyReport): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentData = getStoredData();
        const updatedData = [report, ...currentData];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        listeners.forEach(l => l(updatedData));
        resolve();
      }, 1000);
    });
  }
};
