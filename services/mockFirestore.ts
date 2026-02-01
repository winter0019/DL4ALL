
import { WeeklyReport } from '../types';

const MOCK_DATA: WeeklyReport[] = [
  {
    id: '1',
    lga: 'Katsina',
    teamCode: '02162',
    name: 'ZUWAIRA KALLA',
    partnerName: 'DOGARA MUSA',
    month: 'January',
    selectedWeek: 'Week 4',
    year: 2026,
    weekEnding: '2026-01-31',
    color: '#F48232',
    metrics: {
      totalEnrolled: 450,
      activeUsers: 52,
      certificatesIssued: 12,
      weeklyAttendance: { wk1: 19, wk2: 10, wk3: 23, wk4: 0 },
      communityOutreach: 5,
      femaleCount: 220,
      maleCount: 230
    },
    infrastructure: { functionalDevices: 50, internetStatus: 'Excellent', powerAvailability: 95 },
    challenges: 'High engagement in WK3.',
    timestamp: Date.now()
  },
  {
    id: '2',
    lga: 'Katsina',
    teamCode: '02496',
    name: 'ALICE AMEH',
    partnerName: 'NIMMYEL FRIDAY',
    month: 'January',
    selectedWeek: 'Week 4',
    year: 2026,
    weekEnding: '2026-01-31',
    color: '#0D2137',
    metrics: {
      totalEnrolled: 400,
      activeUsers: 50,
      certificatesIssued: 8,
      weeklyAttendance: { wk1: 20, wk2: 30, wk3: 0, wk4: 0 },
      communityOutreach: 3,
      femaleCount: 180,
      maleCount: 220
    },
    infrastructure: { functionalDevices: 45, internetStatus: 'Fair', powerAvailability: 80 },
    challenges: 'Absent in week 3.',
    timestamp: Date.now()
  },
  {
    id: '7',
    lga: 'Batagarawa',
    teamCode: '02636',
    name: 'DANLADI BASHIR',
    partnerName: 'GODWIN SOLOMON',
    month: 'January',
    selectedWeek: 'Week 4',
    year: 2026,
    weekEnding: '2026-01-31',
    color: '#6366f1',
    metrics: {
      totalEnrolled: 300,
      activeUsers: 50,
      certificatesIssued: 10,
      weeklyAttendance: { wk1: 0, wk2: 25, wk3: 17, wk4: 8 },
      communityOutreach: 2,
      femaleCount: 150,
      maleCount: 150
    },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 80 },
    challenges: 'Steady attendance.',
    timestamp: Date.now()
  }
];

let listeners: ((data: WeeklyReport[]) => void)[] = [];
let currentData: WeeklyReport[] = [...MOCK_DATA];

export const firestoreService = {
  subscribeToReports: (
    onUpdate: (reports: WeeklyReport[]) => void,
    onError: (error: any) => void
  ) => {
    setTimeout(() => onUpdate(currentData), 800);
    listeners.push(onUpdate);
    return () => { listeners = listeners.filter(l => l !== onUpdate); };
  },

  submitReport: async (report: WeeklyReport): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentData = [report, ...currentData];
        listeners.forEach(l => l([...currentData]));
        resolve();
      }, 1500);
    });
  }
};
