import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlchemist } from '@/context/AlchemistContext';
import { getXpToNextLevel, getRankTitle } from '@/lib/xp';
import { useColors } from '@/hooks/useColors';

const PURPLE = '#9b30ff';
const MAGENTA = '#ff00c8';
const BORDER = '#2d2d4a';

function StatCard({ title, value, label }: { title: string; value: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function NexusScreen() {
  const insets = useSafeAreaInsets();
  const { profile, incantations, quests, today } = useAlchemist();
  const colors = useColors();

  const xpNeeded = getXpToNextLevel(profile.level);
  const progressPct = Math.min(100, (profile.currentLevelXP / xpNeeded) * 100);

  const habitsToday = incantations.filter(i => i.completedDates.includes(today)).length;
  const questsToday = quests.filter(q => q.completed && q.createdAt.split('T')[0] === today).length;
  const totalTasks =
    incantations.reduce((a, i) => a + i.completedDates.length, 0) +
    quests.filter(q => q.completed).length;
  const totalToday =
    incantations.length +
    quests.filter(q => !q.completed || q.createdAt.split('T')[0] === today).length;
  const completedToday = habitsToday + questsToday;
  const todayPct = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const openHelp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/help');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Banner */}
      <View style={styles.banner}>
        {/* Help button — top-right corner of banner */}
        <Pressable
          onPress={openHelp}
          style={({ pressed }) => [styles.helpBtn, pressed && { opacity: 0.6 }]}
          accessibilityLabel="Open help guide"
        >
          <Feather name="help-circle" size={22} color={PURPLE} />
        </Pressable>

        {/* Level Diamond */}
        <View style={styles.diamondOuter}>
          <View style={styles.diamondInner}>
            <Text style={styles.levelText}>{profile.level}</Text>
          </View>
        </View>

        <Text style={styles.heroName}>THE ALCHEMIST</Text>
        <Text style={styles.rankTitle}>{getRankTitle(profile.level)}</Text>

        {/* XP Bar */}
        <View style={styles.xpSection}>
          <View style={styles.xpLabels}>
            <Text style={styles.xpLabel}>XP: {profile.currentLevelXP}</Text>
            <Text style={styles.xpLabel}>NEXT: {xpNeeded}</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${progressPct}%` as any }]} />
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard title="ALCHEMY" value={totalTasks} label="All-time Casts" />
        <StatCard title="RUNES" value={profile.streak} label="Day Streak" />
        <StatCard title="WANDS UP" value={questsToday} label="Quests Today" />
        <StatCard title="GALLEONS" value={profile.totalXP} label="Total XP" />
      </View>

      {/* Daily Communique */}
      <View style={styles.communique}>
        <Text style={styles.communiqueTitle}>DAILY COMMUNIQUE</Text>
        <Text style={styles.communiqueText}>
          <Text style={{ color: '#fff' }}>{habitsToday}</Text>
          {' '}Incantations Cast |{' '}
          <Text style={{ color: '#fff' }}>{questsToday}</Text>
          {' '}Quests Vanquished
        </Text>
        <View style={styles.todayTrack}>
          <View style={[styles.todayFill, { width: `${todayPct}%` as any }]} />
        </View>
      </View>

      {/* Guide prompt for new users */}
      <Pressable
        onPress={openHelp}
        style={({ pressed }) => [styles.guidePrompt, pressed && { opacity: 0.7 }]}
      >
        <Feather name="book-open" size={14} color={PURPLE} />
        <Text style={styles.guidePromptText}>New here? Open the Transmission Guide</Text>
        <Feather name="chevron-right" size={14} color={PURPLE} />
      </Pressable>

      <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },

  banner: {
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: PURPLE,
    padding: 24,
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },

  helpBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 20,
    backgroundColor: 'rgba(155,48,255,0.15)',
    zIndex: 1,
  },

  diamondOuter: {
    width: 72,
    height: 72,
    transform: [{ rotate: '45deg' }],
    borderWidth: 1.5,
    borderColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  diamondInner: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 28,
    color: '#ffffff',
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  heroName: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 4,
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  rankTitle: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 13,
    color: MAGENTA,
    letterSpacing: 3,
    marginTop: 4,
    textShadowColor: MAGENTA,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  xpSection: { width: '100%', marginTop: 16 },
  xpLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { fontFamily: 'monospace', fontSize: 11, color: '#8b8bb5' },
  xpTrack: {
    height: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: MAGENTA,
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statTitle: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b8bb5',
    letterSpacing: 2,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 32,
    color: '#ffffff',
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    lineHeight: 38,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#8b8bb5',
    marginTop: 4,
  },

  communique: {
    backgroundColor: 'rgba(15,15,26,0.5)',
    borderWidth: 1,
    borderColor: MAGENTA,
    padding: 20,
    gap: 12,
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  communiqueTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    color: MAGENTA,
    letterSpacing: 2,
    textShadowColor: MAGENTA,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  communiqueText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#8b8bb5',
  },
  todayTrack: {
    height: 4,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: MAGENTA,
    overflow: 'hidden',
  },
  todayFill: {
    height: '100%',
    backgroundColor: MAGENTA,
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },

  guidePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: 'rgba(155,48,255,0.1)',
    padding: 16,
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  guidePromptText: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    color: PURPLE,
    letterSpacing: 1,
  },
});
