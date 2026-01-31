
import { WeeklyReport, LGAName } from '../types';

const INITIAL_MOCK_DATA: WeeklyReport[] = [
  // --- KATSINA LGA DATA ---
  { id: 'kt-1', lga: 'Katsina', teamCode: '02162', name: 'ZUWAIRA KALLA', partnerName: 'DOGARA MUSA', weekEnding: '2026-01-31', color: '#F48232', 
    metrics: { totalEnrolled: 450, activeUsers: 52, certificatesIssued: 12, weeklyAttendance: { wk1: 19, wk2: 10, wk3: 23, wk4: 0 }, communityOutreach: 5, femaleCount: 220, maleCount: 230 },
    infrastructure: { functionalDevices: 50, internetStatus: 'Excellent', powerAvailability: 95 }, challenges: 'Consistent growth.', timestamp: Date.now() - 2000 },
  { id: 'kt-2', lga: 'Katsina', teamCode: '02496', name: 'ALICE AMEH', partnerName: 'NIMMYEL FRIDAY', weekEnding: '2026-01-31', color: '#0D2137', 
    metrics: { totalEnrolled: 400, activeUsers: 50, certificatesIssued: 8, weeklyAttendance: { wk1: 20, wk2: 30, wk3: 'ABS', wk4: 0 }, communityOutreach: 3, femaleCount: 180, maleCount: 220 },
    infrastructure: { functionalDevices: 45, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Absent in WK3.', timestamp: Date.now() - 3000 },
  { id: 'kt-3', lga: 'Katsina', teamCode: '02492', name: 'JAMES OLATEJU', partnerName: 'PATIENCE GABRIEL', weekEnding: '2026-01-31', color: '#084B6F', 
    metrics: { totalEnrolled: 350, activeUsers: 20, certificatesIssued: 5, weeklyAttendance: { wk1: 'ABS', wk2: 5, wk3: 15, wk4: 0 }, communityOutreach: 2, femaleCount: 150, maleCount: 200 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Poor', powerAvailability: 60 }, challenges: 'Infrastructure issues early month.', timestamp: Date.now() - 4000 },
  { id: 'kt-4', lga: 'Katsina', teamCode: '02495', name: 'SENJONG DAWULENG', partnerName: 'OGAR IYOWO', weekEnding: '2026-01-31', color: '#006B2B', 
    metrics: { totalEnrolled: 300, activeUsers: 10, certificatesIssued: 2, weeklyAttendance: { wk1: 'ABS', wk2: 10, wk3: 'ABS', wk4: 0 }, communityOutreach: 1, femaleCount: 100, maleCount: 200 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 70 }, challenges: 'Low engagement.', timestamp: Date.now() - 5000 },
  { id: 'kt-5', lga: 'Katsina', teamCode: '02166', name: 'FATIMA YUSUF', partnerName: 'VICTOR BALA', weekEnding: '2026-01-31', color: '#9B26AF', 
    metrics: { totalEnrolled: 420, activeUsers: 51, certificatesIssued: 15, weeklyAttendance: { wk1: 'ABS', wk2: 31, wk3: 20, wk4: 0 }, communityOutreach: 4, femaleCount: 200, maleCount: 220 },
    infrastructure: { functionalDevices: 48, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'Strong mid-month surge.', timestamp: Date.now() - 6000 },
  { id: 'kt-6', lga: 'Katsina', teamCode: '02697', name: 'PEACE JOSEPH', partnerName: 'JAMES AYEREWAJU', weekEnding: '2026-01-31', color: '#60B236', 
    metrics: { totalEnrolled: 500, activeUsers: 60, certificatesIssued: 20, weeklyAttendance: { wk1: 'ABS', wk2: 41, wk3: 19, wk4: 0 }, communityOutreach: 6, femaleCount: 250, maleCount: 250 },
    infrastructure: { functionalDevices: 55, internetStatus: 'Excellent', powerAvailability: 100 }, challenges: 'Peak state performance.', timestamp: Date.now() - 7000 },
  
  // --- BATAGARAWA LGA DATA ---
  { id: 'bat-1', lga: 'Batagarawa', teamCode: '02636', name: 'DANLADI BASHIR', partnerName: 'GODWIN SOLOMON', weekEnding: '2026-01-31', color: '#6366f1', 
    metrics: { totalEnrolled: 300, activeUsers: 50, certificatesIssued: 10, weeklyAttendance: { wk1: 0, wk2: 25, wk3: 17, wk4: 8 }, communityOutreach: 2, femaleCount: 150, maleCount: 150 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Steady attendance.', timestamp: Date.now() - 12000 },
  { id: 'bat-2', lga: 'Batagarawa', teamCode: '02637', name: 'STEPHEN JOSHUA', partnerName: 'MNGUEMBER AGBER', weekEnding: '2026-01-31', color: '#0ea5e9', 
    metrics: { totalEnrolled: 250, activeUsers: 5, certificatesIssued: 0, weeklyAttendance: { wk1: 'ABS', wk2: 5, wk3: 'ABS', wk4: 'ABS' }, communityOutreach: 1, femaleCount: 100, maleCount: 150 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Poor', powerAvailability: 60 }, challenges: 'High absenteeism.', timestamp: Date.now() - 13000 },
  { id: 'bat-3', lga: 'Batagarawa', teamCode: '02638', name: 'MUHAMMAD SALISU', partnerName: 'AFOLABI MUIDEEN', weekEnding: '2026-01-31', color: '#f59e0b', 
    metrics: { totalEnrolled: 320, activeUsers: 50, certificatesIssued: 12, weeklyAttendance: { wk1: 'ABS', wk2: 20, wk3: 20, wk4: 10 }, communityOutreach: 3, femaleCount: 160, maleCount: 160 },
    infrastructure: { functionalDevices: 35, internetStatus: 'Fair', powerAvailability: 85 }, challenges: 'Late start but picked up.', timestamp: Date.now() - 14000 },
  { id: 'bat-4', lga: 'Batagarawa', teamCode: '02698', name: 'AMINA IDRIS HALILU', partnerName: 'SHEHU MUSA MELIGA', weekEnding: '2026-01-31', color: '#10b981', 
    metrics: { totalEnrolled: 350, activeUsers: 62, certificatesIssued: 15, weeklyAttendance: { wk1: 13, wk2: 20, wk3: 19, wk4: 10 }, communityOutreach: 4, femaleCount: 200, maleCount: 150 },
    infrastructure: { functionalDevices: 40, internetStatus: 'Excellent', powerAvailability: 95 }, challenges: 'Consistent team effort.', timestamp: Date.now() - 15000 },
  { id: 'bat-5', lga: 'Batagarawa', teamCode: '01952', name: 'BILYAMINU HAMZA', partnerName: 'AHMED MUTARI', weekEnding: '2026-01-31', color: '#64748b', 
    metrics: { totalEnrolled: 100, activeUsers: 0, certificatesIssued: 0, weeklyAttendance: { wk1: 'ABS', wk2: 0, wk3: 'ABS', wk4: 'ABS' }, communityOutreach: 0, femaleCount: 50, maleCount: 50 },
    infrastructure: { functionalDevices: 10, internetStatus: 'Poor', powerAvailability: 40 }, challenges: 'Inactive center.', timestamp: Date.now() - 16000 },
  { id: 'bat-6', lga: 'Batagarawa', teamCode: '01950', name: 'ISHAYA VICTOR', partnerName: 'GWOM PAM', weekEnding: '2026-01-31', color: '#ec4899', 
    metrics: { totalEnrolled: 180, activeUsers: 15, certificatesIssued: 2, weeklyAttendance: { wk1: 10, wk2: 5, wk3: 'ABS', wk4: 'ABS' }, communityOutreach: 1, femaleCount: 80, maleCount: 100 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 70 }, challenges: 'Engagement dropped after wk 2.', timestamp: Date.now() - 17000 },
  { id: 'bat-7', lga: 'Batagarawa', teamCode: '03011', name: 'UMAR FARUQ MAGAJI', partnerName: 'AMIR BAPULLO', weekEnding: '2026-01-31', color: '#8b5cf6', 
    metrics: { totalEnrolled: 220, activeUsers: 29, certificatesIssued: 5, weeklyAttendance: { wk1: 12, wk2: 'ABS', wk3: 7, wk4: 10 }, communityOutreach: 2, femaleCount: 110, maleCount: 110 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 75 }, challenges: 'Recovering after ABS week.', timestamp: Date.now() - 18000 },
  { id: 'bat-8', lga: 'Batagarawa', teamCode: '02985', name: 'OBED LAMIDO', partnerName: 'MUSLIUDEEN AISHAT', weekEnding: '2026-01-31', color: '#f43f5e', 
    metrics: { totalEnrolled: 380, activeUsers: 59, certificatesIssued: 14, weeklyAttendance: { wk1: 15, wk2: 12, wk3: 23, wk4: 9 }, communityOutreach: 5, femaleCount: 190, maleCount: 190 },
    infrastructure: { functionalDevices: 45, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'Strongest BAT team.', timestamp: Date.now() - 19000 },
  { id: 'bat-9', lga: 'Batagarawa', teamCode: '02639', name: 'MUSA BUKHARI', partnerName: 'JENNIFER GIDEON', weekEnding: '2026-01-31', color: '#14b8a6', 
    metrics: { totalEnrolled: 240, activeUsers: 23, certificatesIssued: 4, weeklyAttendance: { wk1: 4, wk2: 'ABS', wk3: 10, wk4: 9 }, communityOutreach: 2, femaleCount: 120, maleCount: 120 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Progressing well.', timestamp: Date.now() - 20000 },
  { id: 'bat-10', lga: 'Batagarawa', teamCode: '03549', name: 'MARRY ABDULLAHI M.', partnerName: 'HAMISU FIDAUSI', weekEnding: '2026-01-31', color: '#fbbf24', 
    metrics: { totalEnrolled: 260, activeUsers: 27, certificatesIssued: 6, weeklyAttendance: { wk1: 7, wk2: 6, wk3: 'ABS', wk4: 7 }, communityOutreach: 2, femaleCount: 130, maleCount: 130 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Excellent', powerAvailability: 85 }, challenges: 'Regular flow.', timestamp: Date.now() - 21000 },

  // --- KANKIA LGA DATA ---
  { id: 'kan-1', lga: 'Kankia', teamCode: '02159', name: 'FIDELIS JOSEPH AGIDA', partnerName: 'ABDULLAHI HARUNA', weekEnding: '2026-01-31', color: '#4f46e5', 
    metrics: { totalEnrolled: 280, activeUsers: 52, certificatesIssued: 10, weeklyAttendance: { wk1: 'NDB', wk2: 25, wk3: 27, wk4: 0 }, communityOutreach: 2, femaleCount: 140, maleCount: 140 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'NT in week 1.', timestamp: Date.now() - 25000 },
  { id: 'kan-2', lga: 'Kankia', teamCode: '02161', name: 'LYDIA DANIEL', partnerName: 'IDOKO EMMANUEL AGADA', weekEnding: '2026-01-31', color: '#06b6d4', 
    metrics: { totalEnrolled: 300, activeUsers: 52, certificatesIssued: 12, weeklyAttendance: { wk1: 'NDB', wk2: 25, wk3: 27, wk4: 0 }, communityOutreach: 3, femaleCount: 150, maleCount: 150 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 85 }, challenges: 'Smooth progress.', timestamp: Date.now() - 26000 },
  { id: 'kan-3', lga: 'Kankia', teamCode: '01877', name: 'MARIAM NANA NASIRU', partnerName: "LONGKAT DA'AR", weekEnding: '2026-01-31', color: '#f59e0b', 
    metrics: { totalEnrolled: 350, activeUsers: 60, certificatesIssued: 15, weeklyAttendance: { wk1: 'NDB', wk2: 30, wk3: 30, wk4: 0 }, communityOutreach: 4, femaleCount: 175, maleCount: 175 },
    infrastructure: { functionalDevices: 35, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'High engagement teams.', timestamp: Date.now() - 27000 },
  { id: 'kan-4', lga: 'Kankia', teamCode: '01878', name: 'MOHAMMED IBRAHIM', partnerName: 'JACOB SAMUEL', weekEnding: '2026-01-31', color: '#10b981', 
    metrics: { totalEnrolled: 220, activeUsers: 34, certificatesIssued: 4, weeklyAttendance: { wk1: 'NDB', wk2: 13, wk3: 21, wk4: 0 }, communityOutreach: 2, femaleCount: 110, maleCount: 110 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 70 }, challenges: 'Building consistency.', timestamp: Date.now() - 28000 },
  { id: 'kan-5', lga: 'Kankia', teamCode: '02160', name: 'MUHAMMAD ZAYYAD AHMAD', partnerName: 'AUDU THANKGOD', weekEnding: '2026-01-31', color: '#8b5cf6', 
    metrics: { totalEnrolled: 240, activeUsers: 38, certificatesIssued: 6, weeklyAttendance: { wk1: 'NDB', wk2: 14, wk3: 24, wk4: 0 }, communityOutreach: 3, femaleCount: 120, maleCount: 120 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 75 }, challenges: 'Operational growth.', timestamp: Date.now() - 29000 },
  { id: 'kan-6', lga: 'Kankia', teamCode: '02938', name: 'TAYE BENJAMIN ABOLSYI', partnerName: 'OLADIPUPO RUTH ABOSEDE', weekEnding: '2026-01-31', color: '#f43f5e', 
    metrics: { totalEnrolled: 200, activeUsers: 30, certificatesIssued: 5, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 15, wk4: 0 }, communityOutreach: 1, femaleCount: 100, maleCount: 100 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Poor', powerAvailability: 60 }, challenges: 'Stable attendance.', timestamp: Date.now() - 30000 },

  // --- MALUMFASHI (MAL) LGA DATA ---
  { id: 'mal-1', lga: 'Malumfashi', teamCode: '02939', name: 'HUSSAINI LADAN', partnerName: 'AMINU YAHYA MODIBBO', weekEnding: '2026-01-31', color: '#6366f1', 
    metrics: { totalEnrolled: 400, activeUsers: 79, certificatesIssued: 15, weeklyAttendance: { wk1: 20, wk2: 30, wk3: 29, wk4: 0 }, communityOutreach: 4, femaleCount: 200, maleCount: 200 },
    infrastructure: { functionalDevices: 40, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'High ground total.', timestamp: Date.now() - 35000 },
  { id: 'mal-2', lga: 'Malumfashi', teamCode: '02168', name: 'ADAMU MUHAMMAD', partnerName: 'SLAHUDDEEN SALEH', weekEnding: '2026-01-31', color: '#0ea5e9', 
    metrics: { totalEnrolled: 300, activeUsers: 36, certificatesIssued: 8, weeklyAttendance: { wk1: 'ABS', wk2: 20, wk3: 16, wk4: 0 }, communityOutreach: 2, femaleCount: 150, maleCount: 150 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Recovering from ABS in week 1.', timestamp: Date.now() - 36000 },
  { id: 'mal-3', lga: 'Malumfashi', teamCode: '02169', name: 'YAKUBU AISHA', partnerName: 'MAMUDU HAJARA', weekEnding: '2026-01-31', color: '#f59e0b', 
    metrics: { totalEnrolled: 250, activeUsers: 19, certificatesIssued: 4, weeklyAttendance: { wk1: 5, wk2: 'ABS', wk3: 14, wk4: 0 }, communityOutreach: 1, femaleCount: 120, maleCount: 130 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 70 }, challenges: 'Fluctuating attendance.', timestamp: Date.now() - 37000 },
  { id: 'mal-4', lga: 'Malumfashi', teamCode: '04360', name: 'ADAM JIBRIN', partnerName: 'OLASOLA PRECIOUS', weekEnding: '2026-01-31', color: '#10b981', 
    metrics: { totalEnrolled: 200, activeUsers: 0, certificatesIssued: 0, weeklyAttendance: { wk1: 'NDB', wk2: 'ABS', wk3: 0, wk4: 0 }, communityOutreach: 0, femaleCount: 100, maleCount: 100 },
    infrastructure: { functionalDevices: 15, internetStatus: 'Poor', powerAvailability: 50 }, challenges: 'Critical zero performance.', timestamp: Date.now() - 38000 },
  { id: 'mal-5', lga: 'Malumfashi', teamCode: '00000', name: 'BALA MAMSIFUN', partnerName: 'NTAM SILAS', weekEnding: '2026-01-31', color: '#64748b', 
    metrics: { totalEnrolled: 150, activeUsers: 0, certificatesIssued: 0, weeklyAttendance: { wk1: 'NDB', wk2: 'NDB', wk3: 'NDB', wk4: 0 }, communityOutreach: 0, femaleCount: 75, maleCount: 75 },
    infrastructure: { functionalDevices: 10, internetStatus: 'Poor', powerAvailability: 40 }, challenges: 'Continuous NDB status.', timestamp: Date.now() - 39000 },

  // --- DAURA (DAU) LGA DATA ---
  { id: 'dau-1', lga: 'Daura', teamCode: '01879', name: 'IBRAHIM ISHAQ', partnerName: 'ABUSUFYAN JIBRIN', weekEnding: '2026-01-31', color: '#F48232', 
    metrics: { totalEnrolled: 300, activeUsers: 47, certificatesIssued: 10, weeklyAttendance: { wk1: 'NDB', wk2: 17, wk3: 15, wk4: 15 }, communityOutreach: 3, femaleCount: 150, maleCount: 150 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Excellent', powerAvailability: 95 }, challenges: 'Consistent monthly performance.', timestamp: Date.now() - 40000 },
  { id: 'dau-2', lga: 'Daura', teamCode: '01880', name: 'HILKIAH ADAMU', partnerName: 'EMMANUEL WAGAM', weekEnding: '2026-01-31', color: '#0D2137', 
    metrics: { totalEnrolled: 250, activeUsers: 31, certificatesIssued: 6, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 120, maleCount: 130 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Steady progress.', timestamp: Date.now() - 41000 },
  { id: 'dau-3', lga: 'Daura', teamCode: '01881', name: 'SHOLA ADEBAYO', partnerName: 'GODWIN ABDULLAHI', weekEnding: '2026-01-31', color: '#084B6F', 
    metrics: { totalEnrolled: 250, activeUsers: 31, certificatesIssued: 5, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 125, maleCount: 125 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 75 }, challenges: 'Partner absent in later weeks.', timestamp: Date.now() - 42000 },
  { id: 'dau-4', lga: 'Daura', teamCode: '01882', name: 'JOSHUA YOHANNA', partnerName: 'BASIRA HAMISU', weekEnding: '2026-01-31', color: '#006B2B', 
    metrics: { totalEnrolled: 260, activeUsers: 31, certificatesIssued: 7, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 3, femaleCount: 130, maleCount: 130 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'Good team coordination.', timestamp: Date.now() - 43000 },
  { id: 'dau-5', lga: 'Daura', teamCode: '03719', name: 'IBRAHIM USMAN', partnerName: 'RASHIDA YAKUBU', weekEnding: '2026-01-31', color: '#9B26AF', 
    metrics: { totalEnrolled: 280, activeUsers: 35, certificatesIssued: 8, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 10 }, communityOutreach: 2, femaleCount: 140, maleCount: 140 },
    infrastructure: { functionalDevices: 30, internetStatus: 'Fair', powerAvailability: 85 }, challenges: 'Leader ABS but partner sustained metrics.', timestamp: Date.now() - 44000 },
  { id: 'dau-6', lga: 'Daura', teamCode: '03720', name: 'HASSAN ISA', partnerName: 'WOKGAM BUNSHAK', weekEnding: '2026-01-31', color: '#60B236', 
    metrics: { totalEnrolled: 240, activeUsers: 31, certificatesIssued: 6, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 120, maleCount: 120 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Poor', powerAvailability: 70 }, challenges: 'Partner led weeks 2-4.', timestamp: Date.now() - 45000 },
  { id: 'dau-7', lga: 'Daura', teamCode: '03721', name: 'ANTHANASIUS DAVID', partnerName: 'IYANUOLUWA OGUNLOYE', weekEnding: '2026-01-31', color: '#F43F5E', 
    metrics: { totalEnrolled: 220, activeUsers: 21, certificatesIssued: 4, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 'ABS', wk4: 6 }, communityOutreach: 1, femaleCount: 110, maleCount: 110 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Fair', powerAvailability: 80 }, challenges: 'Fluctuation in week 3.', timestamp: Date.now() - 46000 },
  { id: 'dau-8', lga: 'Daura', teamCode: '03536', name: 'JONATHAN SAMUEL', partnerName: 'FELIX ILIYA', weekEnding: '2026-01-31', color: '#10B981', 
    metrics: { totalEnrolled: 250, activeUsers: 31, certificatesIssued: 5, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 125, maleCount: 125 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Excellent', powerAvailability: 95 }, challenges: 'Stable growth.', timestamp: Date.now() - 47000 },
  { id: 'dau-9', lga: 'Daura', teamCode: '03537', name: 'BUHARI BAKOJI', partnerName: 'EBENEZER SAMUEL', weekEnding: '2026-01-31', color: '#8B5CF6', 
    metrics: { totalEnrolled: 260, activeUsers: 31, certificatesIssued: 6, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 130, maleCount: 130 },
    infrastructure: { functionalDevices: 25, internetStatus: 'Fair', powerAvailability: 85 }, challenges: 'Consistent team presence.', timestamp: Date.now() - 48000 },
  { id: 'dau-10', lga: 'Daura', teamCode: '04237', name: 'MAFENG RWANG', partnerName: 'DAHIRU UMARU', weekEnding: '2026-01-31', color: '#EC4899', 
    metrics: { totalEnrolled: 250, activeUsers: 31, certificatesIssued: 5, weeklyAttendance: { wk1: 'NDB', wk2: 15, wk3: 10, wk4: 6 }, communityOutreach: 2, femaleCount: 125, maleCount: 125 },
    infrastructure: { functionalDevices: 20, internetStatus: 'Excellent', powerAvailability: 90 }, challenges: 'Good metrics despite leader ABS.', timestamp: Date.now() - 49000 },
  { id: 'dau-11', lga: 'Daura', teamCode: '04238', name: 'HABAKKUK LUCKY', partnerName: 'ADAMU USMAN', weekEnding: '2026-01-31', color: '#64748B', 
    metrics: { totalEnrolled: 200, activeUsers: 26, certificatesIssued: 4, weeklyAttendance: { wk1: 'NDB', wk2: 10, wk3: 10, wk4: 6 }, communityOutreach: 1, femaleCount: 100, maleCount: 100 },
    infrastructure: { functionalDevices: 15, internetStatus: 'Fair', powerAvailability: 75 }, challenges: 'Developing capacity.', timestamp: Date.now() - 50000 },
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
