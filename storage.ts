import type { JournalEntry, UserProfile } from '../types';

const STORAGE_KEY = 'soul_journal_entries';
const USER_KEY = 'soul_journal_user';

export const getEntries = (): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveEntries = (entries: JournalEntry[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const addEntry = (entry: JournalEntry): JournalEntry[] => {
  const entries = getEntries();
  const updated = [entry, ...entries]; // push to front so newest is first
  saveEntries(updated);
  return updated;
};

export const deleteEntry = (id: string): JournalEntry[] => {
  const entries = getEntries();
  const updated = entries.filter(e => e.id !== id);
  saveEntries(updated);
  return updated;
};

export const updateEntry = (updatedEntry: JournalEntry): JournalEntry[] => {
  const entries = getEntries();
  const updated = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
  saveEntries(updated);
  return updated;
};

export const getUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const saveUser = (user: UserProfile): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};
