
export type CloudStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'CONNECTING';
export type UserRole = 'ADMIN' | 'LEADER';

export type ReportingMonth = 
  | 'January' | 'February' | 'March' | 'April' 
  | 'May' | 'June' | 'July' | 'August' 
  | 'September' | 'October' | 'November' | 'December';

export type ReportingWeek = 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  lga?: LGAName;
}

export interface WeeklyBreakdown {
  wk1: number | 'ABS' | 'NDB' | 'P';
  wk2: number | 'ABS' | 'NDB' | 'P';
  wk3: number | 'ABS' | 'NDB' | 'P';
  wk4: number | 'ABS' | 'NDB' | 'P';
}

export interface WeeklyReport {
  id: string;
  lga: LGAName;
  teamCode: string;
  name: string;
  partnerName: string;
  month: ReportingMonth;
  selectedWeek: ReportingWeek;
  year: number;
  weekEnding: string;
  color: string;
  metrics: {
    totalEnrolled: number;
    activeUsers: number;
    certificatesIssued: number;
    weeklyAttendance: WeeklyBreakdown;
    communityOutreach: number;
    femaleCount: number;
    maleCount: number;
  };
  infrastructure: {
    functionalDevices: number;
    internetStatus: 'Excellent' | 'Fair' | 'Poor';
    powerAvailability: number;
  };
  challenges: string;
  timestamp: number;
}

export type LGAName = 
  | 'Katsina' 
  | 'Malumfashi' 
  | 'Kankia' 
  | 'Batagarawa' 
  | 'Mashi' 
  | 'Daura';

export const KATSINA_LGAS: LGAName[] = [
  'Katsina',
  'Malumfashi',
  'Kankia',
  'Batagarawa',
  'Mashi',
  'Daura'
];

export const MONTHS: ReportingMonth[] = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKS: ReportingWeek[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export const YEARS = [2025, 2026, 2027];
