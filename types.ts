
export type CloudStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'CONNECTING';
export type UserRole = 'ADMIN' | 'LEADER';

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
