import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlchemistProfile } from './xp';

export interface Incantation {
  id: string;
  text: string;
  tier: 'easy' | 'medium' | 'hard';
  completedDates: string[];
}

export interface SectorQuest {
  id: string;
  text: string;
  tier: 'easy' | 'medium' | 'hard';
  completed: boolean;
  createdAt: string;
}

export interface ChronicleEntry {
  id: string;
  date: string;
  mood: string;
  text: string;
}

const KEYS = {
  PROFILE: 'alchemist_profile',
  INCANTATIONS: 'daily_incantations',
  QUESTS: 'sector_quests',
  CHRONICLE: 'chronicle_entries',
};

const DEFAULT_PROFILE: AlchemistProfile = {
  totalXP: 0,
  level: 1,
  currentLevelXP: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
};

const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const storage = {
  async getProfile(): Promise<AlchemistProfile> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  async saveProfile(profile: AlchemistProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  async getIncantations(): Promise<Incantation[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.INCANTATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveIncantations(items: Incantation[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.INCANTATIONS, JSON.stringify(items));
  },

  async getQuests(): Promise<SectorQuest[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.QUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveQuests(quests: SectorQuest[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.QUESTS, JSON.stringify(quests));
  },

  async getEntries(): Promise<ChronicleEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHRONICLE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveEntries(entries: ChronicleEntry[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.CHRONICLE, JSON.stringify(entries));
  },

  genId,
};
