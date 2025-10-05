
import { HistoryEntry } from '../types';

const HISTORY_KEY = 'imageDownloaderHistory';

export const getHistory = (): HistoryEntry[] => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (historyJson) {
            return JSON.parse(historyJson);
        }
    } catch (error) {
        console.error('Failed to parse history from localStorage', error);
    }
    return [];
};

export const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void => {
    const newEntry: HistoryEntry = {
        ...entry,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toLocaleString(),
    };

    const currentHistory = getHistory();
    const updatedHistory = [newEntry, ...currentHistory].slice(0, 100); // Keep last 100 entries

    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Failed to save history to localStorage', error);
    }
};
