import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storage, Incantation, SectorQuest, ChronicleEntry } from '@/lib/storage';
import { AlchemistProfile, calculateNewProfile, TIER_XP } from '@/lib/xp';

interface AlchemistState {
  profile: AlchemistProfile;
  incantations: Incantation[];
  quests: SectorQuest[];
  entries: ChronicleEntry[];
  loading: boolean;
  today: string;
  addIncantation: (text: string, tier?: Incantation['tier']) => Promise<void>;
  toggleIncantation: (id: string) => Promise<void>;
  deleteIncantation: (id: string) => Promise<void>;
  setIncantationTier: (id: string, tier: Incantation['tier']) => Promise<void>;
  addQuest: (text: string, tier?: SectorQuest['tier']) => Promise<void>;
  toggleQuest: (id: string) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  setQuestTier: (id: string, tier: SectorQuest['tier']) => Promise<void>;
  addChronicleEntry: (mood: string, text: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultProfile: AlchemistProfile = {
  totalXP: 0,
  level: 1,
  currentLevelXP: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
};

const AlchemistContext = createContext<AlchemistState>({
  profile: defaultProfile,
  incantations: [],
  quests: [],
  entries: [],
  loading: true,
  today: new Date().toISOString().split('T')[0],
  addIncantation: async () => {},
  toggleIncantation: async () => {},
  deleteIncantation: async () => {},
  setIncantationTier: async () => {},
  addQuest: async () => {},
  toggleQuest: async () => {},
  deleteQuest: async () => {},
  setQuestTier: async () => {},
  addChronicleEntry: async () => {},
  refresh: async () => {},
});

export function AlchemistProvider({ children }: { children: React.ReactNode }) {
  const today = new Date().toISOString().split('T')[0];
  const [profile, setProfile] = useState<AlchemistProfile>(defaultProfile);
  const [incantations, setIncantations] = useState<Incantation[]>([]);
  const [quests, setQuests] = useState<SectorQuest[]>([]);
  const [entries, setEntries] = useState<ChronicleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [p, inc, q, ent] = await Promise.all([
      storage.getProfile(),
      storage.getIncantations(),
      storage.getQuests(),
      storage.getEntries(),
    ]);
    setProfile(p);
    setIncantations(inc);
    setQuests(q);
    setEntries(ent);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addIncantation = useCallback(async (text: string, tier: Incantation['tier'] = 'medium') => {
    const newItem: Incantation = {
      id: storage.genId(),
      text: text.trim(),
      tier,
      completedDates: [],
    };
    const updated = [...incantations, newItem];
    setIncantations(updated);
    await storage.saveIncantations(updated);
  }, [incantations]);

  const toggleIncantation = useCallback(async (id: string) => {
    const item = incantations.find(i => i.id === id);
    if (!item) return;

    const isCompleted = item.completedDates.includes(today);
    let updated: Incantation[];
    let newProfile = profile;

    if (isCompleted) {
      updated = incantations.map(i =>
        i.id === id ? { ...i, completedDates: i.completedDates.filter(d => d !== today) } : i,
      );
    } else {
      updated = incantations.map(i =>
        i.id === id ? { ...i, completedDates: [...i.completedDates, today] } : i,
      );
      newProfile = calculateNewProfile(profile, TIER_XP[item.tier]);
      setProfile(newProfile);
      await storage.saveProfile(newProfile);
    }

    setIncantations(updated);
    await storage.saveIncantations(updated);
  }, [incantations, profile, today]);

  const deleteIncantation = useCallback(async (id: string) => {
    const updated = incantations.filter(i => i.id !== id);
    setIncantations(updated);
    await storage.saveIncantations(updated);
  }, [incantations]);

  const setIncantationTier = useCallback(async (id: string, tier: Incantation['tier']) => {
    const updated = incantations.map(i => i.id === id ? { ...i, tier } : i);
    setIncantations(updated);
    await storage.saveIncantations(updated);
  }, [incantations]);

  const addQuest = useCallback(async (text: string, tier: SectorQuest['tier'] = 'medium') => {
    const newQuest: SectorQuest = {
      id: storage.genId(),
      text: text.trim(),
      tier,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...quests, newQuest];
    setQuests(updated);
    await storage.saveQuests(updated);
  }, [quests]);

  const toggleQuest = useCallback(async (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || quest.completed) return;

    const updated = quests.map(q => q.id === id ? { ...q, completed: true } : q);
    setQuests(updated);
    await storage.saveQuests(updated);

    const newProfile = calculateNewProfile(profile, TIER_XP[quest.tier]);
    setProfile(newProfile);
    await storage.saveProfile(newProfile);
  }, [quests, profile]);

  const deleteQuest = useCallback(async (id: string) => {
    const updated = quests.filter(q => q.id !== id);
    setQuests(updated);
    await storage.saveQuests(updated);
  }, [quests]);

  const setQuestTier = useCallback(async (id: string, tier: SectorQuest['tier']) => {
    const updated = quests.map(q => q.id === id ? { ...q, tier } : q);
    setQuests(updated);
    await storage.saveQuests(updated);
  }, [quests]);

  const addChronicleEntry = useCallback(async (mood: string, text: string) => {
    const newEntry: ChronicleEntry = {
      id: storage.genId(),
      date: new Date().toISOString(),
      mood,
      text: text.trim(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await storage.saveEntries(updated);
  }, [entries]);

  return (
    <AlchemistContext.Provider value={{
      profile, incantations, quests, entries, loading, today,
      addIncantation, toggleIncantation, deleteIncantation, setIncantationTier,
      addQuest, toggleQuest, deleteQuest, setQuestTier,
      addChronicleEntry, refresh,
    }}>
      {children}
    </AlchemistContext.Provider>
  );
}

export const useAlchemist = () => useContext(AlchemistContext);
