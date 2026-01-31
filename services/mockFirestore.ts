
import { WeeklyReport } from '../types';

const MOCK_DATA: WeeklyReport[] = [
  {
    id: '1',
    lga: 'Katsina',
    teamCode: '02162',
    name: 'ZUWAIRA KALLA',
    partnerName: 'DOGARA MUSA',
    weekEnding: '2026-01-31',
    color: '#F48232', // Orange from PDF
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
    weekEnding: '2026-01-31',
    color: '#0D2137', // Navy from PDF
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
    id: '3',
    lga: 'Katsina',
    teamCode: '02492',
    name: 'JAMES OLATEJU',
    partnerName: 'PATIENCE GABRIEL',
    weekEnding: '2026-01-31',
    color: '#084B6F', // Blue-Teal from PDF
    metrics: {
      totalEnrolled: 350,
      activeUsers: 20,
      certificatesIssued: 5,
      weeklyAttendance: { wk1: 0, wk2: 5, wk3: 15, wk4: 0 },
      communityOutreach: 2,
      femaleCount: 150,
      maleCount: 200
    },
    infrastructure: { functionalDevices: 30, internetStatus: 'Poor', powerAvailability: 60 },
    challenges: 'Network issues in early weeks.',
    timestamp: Date.now()
  },
  {
    id: '4',
    lga: 'Katsina',
    teamCode: '02495',
    name: 'SENJONG DAWULENG',
    partnerName: 'OGAR IYOWO',
    weekEnding: '2026-01-31',
    color: '#006B2B', // Dark Green from PDF
    metrics: {
      totalEnrolled: 300,
      activeUsers: 10,
      certificatesIssued: 2,
      weeklyAttendance: { wk1: 0, wk2: 10, wk3: 0, wk4: 0 },
      communityOutreach: 1,
      femaleCount: 100,
      maleCount: 200
    },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 70 },
    challenges: 'Low turnout.',
    timestamp: Date.now()
  },
  {
    id: '5',
    lga: 'Katsina',
    teamCode: '02166',
    name: 'FATIMA YUSUF',
    partnerName: 'VICTOR BALA',
    weekEnding: '2026-01-31',
    color: '#9B26AF', // Purple from PDF
    metrics: {
      totalEnrolled: 420,
      activeUsers: 51,
      certificatesIssued: 15,
      weeklyAttendance: { wk1: 0, wk2: 31, wk3: 20, wk4: 0 },
      communityOutreach: 4,
      femaleCount: 200,
      maleCount: 220
    },
    infrastructure: { functionalDevices: 48, internetStatus: 'Excellent', powerAvailability: 90 },
    challenges: 'Strong Week 2 performance.',
    timestamp: Date.now()
  },
  {
    id: '6',
    lga: 'Katsina',
    teamCode: '02697',
    name: 'PEACE JOSEPH',
    partnerName: 'JAMES AYEREWAJU',
    weekEnding: '2026-01-31',
    color: '#60B236', // Light Green from PDF
    metrics: {
      totalEnrolled: 500,
      activeUsers: 60,
      certificatesIssued: 20,
      weeklyAttendance: { wk1: 0, wk2: 41, wk3: 19, wk4: 0 },
      communityOutreach: 6,
      femaleCount: 250,
      maleCount: 250
    },
    infrastructure: { functionalDevices: 55, internetStatus: 'Excellent', powerAvailability: 100 },
    challenges: 'Peak performance reached in Jan.',
    timestamp: Date.now()
  },
  {
    id: '9',
    lga: 'Katsina',
    teamCode: '02493',
    name: 'DAMAK LISAN',
    partnerName: 'ADEH EMMANUEL',
    weekEnding: '2026-01-31',
    color: '#FE0000', // Red from PDF
    metrics: {
      totalEnrolled: 480,
      activeUsers: 60,
      certificatesIssued: 18,
      weeklyAttendance: { wk1: 20, wk2: 30, wk3: 10, wk4: 0 },
      communityOutreach: 5,
      femaleCount: 240,
      maleCount: 240
    },
    infrastructure: { functionalDevices: 50, internetStatus: 'Excellent', powerAvailability: 95 },
    challenges: 'Consistent flow across weeks.',
    timestamp: Date.now()
  },
  {
    id: '10',
    lga: 'Katsina',
    teamCode: '02473',
    name: 'SUNDAY MICHEST',
    partnerName: 'JANE OMALE',
    weekEnding: '2026-01-31',
    color: '#FFFF00', // Yellow from PDF
    metrics: {
      totalEnrolled: 300,
      activeUsers: 30,
      certificatesIssued: 5,
      weeklyAttendance: { wk1: 0, wk2: 30, wk3: 0, wk4: 0 },
      communityOutreach: 2,
      femaleCount: 150,
      maleCount: 150
    },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 80 },
    challenges: 'One-week peak activity.',
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
