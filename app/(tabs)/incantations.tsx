import React, { useState, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlchemist } from '@/context/AlchemistContext';
import { Incantation, SectorQuest } from '@/lib/storage';
import { useColors } from '@/hooks/useColors';

const PURPLE = '#9b30ff';
const MAGENTA = '#ff00c8';
const BORDER = '#2d2d4a';
const TIERS: Incantation['tier'][] = ['easy', 'medium', 'hard'];
const TIER_COLORS = { easy: '#00ff88', medium: PURPLE, hard: MAGENTA };
const TIER_XP_LABELS = { easy: '+10', medium: '+25', hard: '+50' };

function TierBadge({
  tier,
  onPress,
}: {
  tier: Incantation['tier'];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tierBadge, { borderColor: TIER_COLORS[tier] }]}>
      <Text style={[styles.tierText, { color: TIER_COLORS[tier] }]}>
        {tier.toUpperCase()} {TIER_XP_LABELS[tier]}
      </Text>
    </Pressable>
  );
}

function IncantationItem({ item, today }: { item: Incantation; today: string }) {
  const { toggleIncantation, deleteIncantation, setIncantationTier } = useAlchemist();
  const isDone = item.completedDates.includes(today);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleIncantation(item.id);
  };

  const cycleTier = () => {
    const idx = TIERS.indexOf(item.tier);
    setIncantationTier(item.id, TIERS[(idx + 1) % TIERS.length]);
  };

  return (
    <View style={[styles.item, isDone && styles.itemDone]}>
      <Pressable onPress={handleToggle} style={styles.checkbox}>
        {isDone ? (
          <Ionicons name="checkmark-circle" size={22} color={PURPLE} />
        ) : (
          <Ionicons name="ellipse-outline" size={22} color={BORDER} />
        )}
      </Pressable>
      <Text style={[styles.itemText, isDone && styles.itemTextDone]} numberOfLines={2}>
        {item.text}
      </Text>
      <TierBadge tier={item.tier} onPress={cycleTier} />
      <Pressable onPress={() => deleteIncantation(item.id)} style={styles.deleteBtn}>
        <Feather name="x" size={14} color="#8b8bb5" />
      </Pressable>
    </View>
  );
}

function QuestItem({ item, today }: { item: SectorQuest; today: string }) {
  const { toggleQuest, deleteQuest, setQuestTier } = useAlchemist();

  const handleToggle = () => {
    if (item.completed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    toggleQuest(item.id);
  };

  const cycleTier = () => {
    if (item.completed) return;
    const idx = TIERS.indexOf(item.tier);
    setQuestTier(item.id, TIERS[(idx + 1) % TIERS.length]);
  };

  return (
    <View style={[styles.item, item.completed && styles.itemDone]}>
      <Pressable onPress={handleToggle} style={styles.checkbox}>
        {item.completed ? (
          <Ionicons name="checkmark-circle" size={22} color={MAGENTA} />
        ) : (
          <Ionicons name="ellipse-outline" size={22} color={BORDER} />
        )}
      </Pressable>
      <Text style={[styles.itemText, item.completed && styles.itemTextDone]} numberOfLines={2}>
        {item.text}
      </Text>
      <TierBadge tier={item.tier} onPress={cycleTier} />
      <Pressable onPress={() => deleteQuest(item.id)} style={styles.deleteBtn}>
        <Feather name="x" size={14} color="#8b8bb5" />
      </Pressable>
    </View>
  );
}

export default function IncantationsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { incantations, quests, addIncantation, addQuest, today } = useAlchemist();
  const [habitInput, setHabitInput] = useState('');
  const [questInput, setQuestInput] = useState('');
  const habitRef = useRef<TextInput>(null);
  const questRef = useRef<TextInput>(null);

  const handleAddHabit = () => {
    if (!habitInput.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addIncantation(habitInput.trim());
    setHabitInput('');
  };

  const handleAddQuest = () => {
    if (!questInput.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addQuest(questInput.trim());
    setQuestInput('');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <View style={[styles.content, { paddingTop: topPad + 12 }]}>
            {/* Daily Incantations */}
            <Text style={styles.sectionTitle}>DAILY INCANTATIONS</Text>

            <View style={styles.inputRow}>
              <TextInput
                ref={habitRef}
                style={styles.input}
                value={habitInput}
                onChangeText={setHabitInput}
                onSubmitEditing={handleAddHabit}
                placeholder="Cast a new incantation... [Enter]"
                placeholderTextColor="#3d3d5a"
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>

            {incantations.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="zap" size={24} color={BORDER} />
                <Text style={styles.emptyText}>No incantations yet</Text>
              </View>
            ) : (
              incantations.map(item => (
                <IncantationItem key={item.id} item={item} today={today} />
              ))
            )}

            <View style={styles.divider} />

            {/* Sector Quests */}
            <Text style={[styles.sectionTitle, { color: MAGENTA }]}>SECTOR QUESTS</Text>

            <View style={styles.inputRow}>
              <TextInput
                ref={questRef}
                style={[styles.input, styles.inputMagenta]}
                value={questInput}
                onChangeText={setQuestInput}
                onSubmitEditing={handleAddQuest}
                placeholder="Name a quest... [Enter]"
                placeholderTextColor="#3d3d5a"
                returnKeyType="done"
                blurOnSubmit={false}
              />
            </View>

            {quests.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="target" size={24} color={BORDER} />
                <Text style={styles.emptyText}>No quests assigned</Text>
              </View>
            ) : (
              quests.map(item => (
                <QuestItem key={item.id} item={item} today={today} />
              ))
            )}

            <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />
          </View>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 10 },

  sectionTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    color: PURPLE,
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: PURPLE,
    padding: 12,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 14,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputMagenta: {
    borderColor: MAGENTA,
    shadowColor: MAGENTA,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: '#2d2d4a',
    padding: 12,
    gap: 10,
    marginBottom: 6,
  },
  itemDone: {
    opacity: 0.5,
  },
  checkbox: { width: 28, alignItems: 'center' },
  itemText: {
    flex: 1,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: '#8b8bb5',
  },

  tierBadge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tierText: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 1,
  },

  deleteBtn: {
    padding: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#2d2d4a',
    marginVertical: 12,
  },

  emptyState: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#8b8bb5',
  },
});
