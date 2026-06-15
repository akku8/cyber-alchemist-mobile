import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlchemist } from '@/context/AlchemistContext';
import { getQuoteForPercent, HP_QUOTES } from '@/lib/xp';
import { useColors } from '@/hooks/useColors';

const PURPLE = '#9b30ff';
const MAGENTA = '#ff00c8';

function ProgressRing({ percent }: { percent: number }) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#1a1a2e"
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={PURPLE}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <Text style={styles.percentText}>{Math.round(percent)}%</Text>
    </View>
  );
}

export default function SortingAIScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { incantations, quests, today } = useAlchemist();
  const [quoteIdx, setQuoteIdx] = useState<number | null>(null);

  const totalToday = incantations.length + quests.filter(q => !q.completed || q.createdAt.split('T')[0] === today).length;
  const habitsToday = incantations.filter(i => i.completedDates.includes(today)).length;
  const questsToday = quests.filter(q => q.completed && q.createdAt.split('T')[0] === today).length;
  const completedToday = habitsToday + questsToday;
  const percent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const activeQuote = useMemo(() => {
    if (quoteIdx !== null) return HP_QUOTES[quoteIdx];
    return getQuoteForPercent(percent);
  }, [percent, quoteIdx]);

  const recalibrate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const randomIdx = Math.floor(Math.random() * HP_QUOTES.length);
    setQuoteIdx(randomIdx);
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SORTING ALGORITHM ACTIVE</Text>
        </View>

        <View style={styles.ringContainer}>
          <ProgressRing percent={percent} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statItem}>
            HABITS TODAY: <Text style={{ color: '#fff' }}>{habitsToday}</Text>
          </Text>
          <Text style={styles.statItem}>
            QUESTS TODAY: <Text style={{ color: '#fff' }}>{questsToday}</Text>
          </Text>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{activeQuote.quote}"</Text>
          <Text style={styles.quoteAuthor}>{activeQuote.author}</Text>
        </View>

        <Pressable
          onPress={recalibrate}
          style={({ pressed }) => [styles.recalBtn, pressed && styles.recalBtnPressed]}
        >
          <Text style={styles.recalText}>RECALIBRATE</Text>
        </Pressable>
      </View>

      <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16, alignItems: 'center' },

  card: {
    width: '100%',
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: PURPLE,
    padding: 24,
    alignItems: 'center',
    gap: 24,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MAGENTA,
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  statusText: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: MAGENTA,
    letterSpacing: 2,
    textShadowColor: MAGENTA,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  ringContainer: { alignItems: 'center', justifyContent: 'center' },

  percentText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 42,
    color: '#ffffff',
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },

  statsRow: { gap: 6, alignItems: 'center' },
  statItem: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#8b8bb5',
    letterSpacing: 1,
  },

  quoteCard: {
    borderWidth: 1,
    borderColor: '#2d2d4a',
    padding: 20,
    gap: 12,
    width: '100%',
  },
  quoteText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#d0d0e8',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: MAGENTA,
    textAlign: 'right',
    letterSpacing: 1,
  },

  recalBtn: {
    borderWidth: 1,
    borderColor: PURPLE,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  recalBtnPressed: {
    opacity: 0.7,
    shadowOpacity: 0.8,
  },
  recalText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 13,
    color: PURPLE,
    letterSpacing: 3,
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
