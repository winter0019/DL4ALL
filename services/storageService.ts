
import { WeeklyReport } from '../types';

const STORAGE_KEY = 'dl4all_reports_cache';

export const storageService = {
  getReports: (): WeeklyReport[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load reports from storage', e);
      return [];
    }
  },

  saveAllReports: (reports: WeeklyReport[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to storage', e);
    }
  },

  addReport: (report: WeeklyReport) => {
    const reports = storageService.getReports();
    const updated = [report, ...reports];
    storageService.saveAllReports(updated);
  }
};
