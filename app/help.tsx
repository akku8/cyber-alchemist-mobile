import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PURPLE = '#9b30ff';
const MAGENTA = '#ff00c8';
const BORDER = '#2d2d4a';
const BG = '#0a0a12';
const CARD = '#0f0f1a';
const MUTED = '#8b8bb5';
const CYAN = '#00d4ff';
const GREEN = '#00ff88';

interface Section {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
  items: Array<{ label: string; desc: string }>;
}

const SECTIONS: Section[] = [
  {
    id: 'nexus',
    icon: 'grid',
    iconColor: PURPLE,
    title: 'HOME SCREEN',
    subtitle: 'Your personal dashboard',
    items: [
      {
        label: 'Your Level',
        desc: 'The number inside the diamond is your level. It goes up as you earn XP.',
      },
      {
        label: 'XP Bar',
        desc: 'The bar below your name fills up as you complete tasks. When it\'s full, you level up.',
      },
      {
        label: 'Stats',
        desc: 'Four boxes show your totals: tasks done, how many days in a row you\'ve been active, quests finished today, and total XP earned.',
      },
      {
        label: 'Today\'s Progress',
        desc: 'At the bottom, a bar shows how much of today\'s habits and quests you\'ve finished.',
      },
    ],
  },
  {
    id: 'incantations',
    icon: 'flash',
    iconColor: PURPLE,
    title: 'DAILY HABITS',
    subtitle: 'Things you want to do every day',
    items: [
      {
        label: 'Adding a habit',
        desc: 'Type it in the box at the top and press Enter. It shows up in your list right away.',
      },
      {
        label: 'Marking it done',
        desc: 'Tap the circle on the left to tick it off. You\'ll earn XP. Tap again to undo.',
      },
      {
        label: 'Easy / Medium / Hard',
        desc: 'Tap the label on the right to change how hard the habit is. Harder habits give more XP (Easy = 10, Medium = 25, Hard = 50).',
      },
      {
        label: 'Resets every day',
        desc: 'Habits start fresh each morning so you can do them again tomorrow.',
      },
      {
        label: 'Removing a habit',
        desc: 'Tap the × on the right to delete it permanently.',
      },
    ],
  },
  {
    id: 'quests',
    icon: 'shield-checkmark',
    iconColor: MAGENTA,
    title: 'QUESTS',
    subtitle: 'One-time tasks you want to finish',
    items: [
      {
        label: 'Adding a quest',
        desc: 'Type it in the Quests box and press Enter. Unlike habits, quests don\'t reset — they\'re one-time goals.',
      },
      {
        label: 'Completing a quest',
        desc: 'Tap the circle to finish it. Once done, it stays done.',
      },
      {
        label: 'Difficulty',
        desc: 'Same Easy / Medium / Hard system as habits. Set the level before you complete it.',
      },
      {
        label: 'Good for',
        desc: 'Use quests for big goals, project milestones, or anything you only need to do once.',
      },
    ],
  },
  {
    id: 'sorting',
    icon: 'hardware-chip',
    iconColor: CYAN,
    title: 'PROGRESS TRACKER',
    subtitle: 'See how your day is going',
    items: [
      {
        label: 'The ring',
        desc: 'Shows what percentage of today\'s habits and quests you\'ve completed. It fills up as you check things off.',
      },
      {
        label: 'The quote',
        desc: 'A Harry Potter quote appears based on your progress. The more you\'ve done, the more encouraging it gets.',
      },
      {
        label: 'Recalibrate button',
        desc: 'Tap it to get a random quote for extra motivation.',
      },
    ],
  },
  {
    id: 'chronicle',
    icon: 'book',
    iconColor: GREEN,
    title: 'JOURNAL',
    subtitle: 'Write down how your day went',
    items: [
      {
        label: 'Pick a mood',
        desc: 'Choose one of five icons that matches how you\'re feeling right now.',
      },
      {
        label: 'Write an entry',
        desc: 'Type your thoughts in the box — anything you want. Then tap Save.',
      },
      {
        label: 'Your past entries',
        desc: 'Everything you\'ve written shows up below, newest first, with the date and mood you picked.',
      },
    ],
  },
  {
    id: 'leveling',
    icon: 'star',
    iconColor: MAGENTA,
    title: 'RANKS',
    subtitle: 'Titles you earn as you level up',
    items: [
      { label: 'Level 1–2', desc: 'Apprentice Alchemist' },
      { label: 'Level 3–5', desc: 'Rune Initiate' },
      { label: 'Level 6–9', desc: 'Arcane Scholar' },
      { label: 'Level 10–14', desc: 'Shadow Adept' },
      { label: 'Level 15–19', desc: 'Void Mage' },
      { label: 'Level 20–29', desc: 'Hex Master' },
      { label: 'Level 30–49', desc: 'Grand Artificer' },
      { label: 'Level 50+', desc: 'Legendary Alchemist' },
    ],
  },
  {
    id: 'tips',
    icon: 'bulb',
    iconColor: '#ffcc00',
    title: 'TIPS',
    subtitle: 'Get the most out of the app',
    items: [
      {
        label: 'Do at least one thing daily',
        desc: 'Completing even one habit a day keeps your streak alive.',
      },
      {
        label: 'Be honest with difficulty',
        desc: 'Set the level that reflects real effort — harder tasks give more XP.',
      },
      {
        label: 'Use quests for big goals',
        desc: 'Break large projects into quests and mark them Hard to earn big XP when you finish.',
      },
      {
        label: 'Write in your journal',
        desc: 'A quick note each day helps you see how far you\'ve come.',
      },
    ],
  },
];

function GuideSection({ section }: { section: Section }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconBg, { borderColor: section.iconColor }]}>
          <Ionicons name={section.icon} size={18} color={section.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: section.iconColor }]}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        </View>
      </View>
      <View style={styles.sectionBody}>
        {section.items.map((item, i) => (
          <View key={i} style={styles.item}>
            <View style={[styles.itemDot, { backgroundColor: section.iconColor }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 20 : insets.top;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HOW IT WORKS</Text>
          <Text style={styles.headerSubtitle}>Quick guide to the app</Text>
        </View>
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
        >
          <Feather name="x" size={22} color={MUTED} />
        </Pressable>
      </View>

      <View style={styles.scanLine} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={styles.introCard}>
          <Ionicons name="sparkles" size={20} color={PURPLE} />
          <Text style={styles.introText}>
            This app turns your daily habits and goals into a game. Complete tasks to earn XP, level up, and unlock new ranks. The more consistent you are, the higher you climb.
          </Text>
        </View>

        {SECTIONS.map(section => (
          <GuideSection key={section.id} section={section} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 16,
    color: PURPLE,
    letterSpacing: 2,
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  headerSubtitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },

  scanLine: {
    height: 2,
    backgroundColor: PURPLE,
    opacity: 0.4,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  introCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: PURPLE,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 4,
  },
  introText: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#d0d0e8',
    lineHeight: 20,
  },

  section: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#13131f',
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },

  sectionBody: { padding: 14, gap: 14 },

  item: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  itemLabel: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  itemDesc: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: MUTED,
    lineHeight: 18,
  },
});
