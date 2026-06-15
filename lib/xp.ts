export const TIER_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
} as const;

export const getXpToNextLevel = (level: number) => level * 100;

export const getRankTitle = (level: number): string => {
  if (level <= 2) return 'Apprentice Alchemist';
  if (level <= 5) return 'Rune Initiate';
  if (level <= 9) return 'Arcane Scholar';
  if (level <= 14) return 'Shadow Adept';
  if (level <= 19) return 'Void Mage';
  if (level <= 29) return 'Hex Master';
  if (level <= 49) return 'Grand Artificer';
  return 'Legendary Alchemist';
};

export interface AlchemistProfile {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  streak: number;
  lastActiveDate: string;
}

export const calculateNewProfile = (
  profile: AlchemistProfile,
  gainedXP: number,
): AlchemistProfile => {
  let { totalXP, level, currentLevelXP, streak, lastActiveDate } = profile;

  totalXP += gainedXP;
  currentLevelXP += gainedXP;

  let xpNeeded = getXpToNextLevel(level);
  while (currentLevelXP >= xpNeeded) {
    currentLevelXP -= xpNeeded;
    level += 1;
    xpNeeded = getXpToNextLevel(level);
  }

  const today = new Date().toISOString().split('T')[0];
  const lastActive = lastActiveDate.split('T')[0];

  if (today !== lastActive) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (lastActive === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }
    lastActiveDate = new Date().toISOString();
  } else if (streak === 0) {
    streak = 1;
  }

  return { totalXP, level, currentLevelXP, streak, lastActiveDate };
};

export const HP_QUOTES: Array<{ minPercent: number; quote: string; author: string }> = [
  { minPercent: 100, quote: 'After all this time? Always.', author: '— Severus Snape' },
  {
    minPercent: 75,
    quote: "You sort of start thinking anything's possible if you've got enough nerve.",
    author: '— Ginny Weasley',
  },
  {
    minPercent: 50,
    quote: 'It is our choices that show what we truly are, far more than our abilities.',
    author: '— Albus Dumbledore',
  },
  {
    minPercent: 25,
    quote: 'Do what is right, not what is easy.',
    author: '— Albus Dumbledore',
  },
  {
    minPercent: 1,
    quote: 'The courage it took to come this far is worth acknowledging.',
    author: '— Remus Lupin',
  },
  {
    minPercent: 0,
    quote: 'It does not do to dwell on dreams and forget to live.',
    author: '— Albus Dumbledore',
  },
];

export const getQuoteForPercent = (percent: number) => {
  return HP_QUOTES.find((q) => percent >= q.minPercent) ?? HP_QUOTES[HP_QUOTES.length - 1];
};
