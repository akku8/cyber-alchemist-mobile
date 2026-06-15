import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlchemist } from '@/context/AlchemistContext';
import { ChronicleEntry } from '@/lib/storage';
import { useColors } from '@/hooks/useColors';

const PURPLE = '#9b30ff';
const MAGENTA = '#ff00c8';
const BORDER = '#2d2d4a';

const MOODS: Array<{ id: string; icon: keyof typeof Ionicons.glyphMap; label: string; color: string }> = [
  { id: 'transcendent', icon: 'sparkles', label: 'TRANSCENDENT', color: PURPLE },
  { id: 'focused', icon: 'eye', label: 'FOCUSED', color: '#00d4ff' },
  { id: 'steady', icon: 'shield', label: 'STEADY', color: '#00ff88' },
  { id: 'troubled', icon: 'thunderstorm', label: 'TROUBLED', color: '#ff8800' },
  { id: 'defeated', icon: 'flame', label: 'DEFEATED', color: '#ff4444' },
];

function EntryCard({ item }: { item: ChronicleEntry }) {
  const mood = MOODS.find(m => m.id === item.mood) ?? MOODS[2];
  const date = new Date(item.date);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.entryMood}>
          <Ionicons name={mood.icon} size={14} color={mood.color} />
          <Text style={[styles.entryMoodLabel, { color: mood.color }]}>{mood.label}</Text>
        </View>
        <Text style={styles.entryDate}>{dateStr}</Text>
      </View>
      <Text style={styles.entryText} numberOfLines={3}>{item.text}</Text>
    </View>
  );
}

export default function ChronicleScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { entries, addChronicleEntry } = useAlchemist();
  const [selectedMood, setSelectedMood] = useState<string>('focused');
  const [journalText, setJournalText] = useState('');

  const handleSave = () => {
    if (!journalText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    addChronicleEntry(selectedMood, journalText.trim());
    setJournalText('');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <EntryCard item={item} />}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 12 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 20 }}>
            <Text style={styles.pageTitle}>CHRONICLE CHAMBER</Text>

            {/* Mood Picker */}
            <View style={styles.moodRow}>
              {MOODS.map(mood => (
                <Pressable
                  key={mood.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedMood(mood.id);
                  }}
                  style={[
                    styles.moodBtn,
                    selectedMood === mood.id && { borderColor: mood.color, backgroundColor: mood.color + '22' },
                  ]}
                >
                  <Ionicons name={mood.icon} size={20} color={selectedMood === mood.id ? mood.color : '#8b8bb5'} />
                  <Text style={[styles.moodLabel, selectedMood === mood.id && { color: mood.color }]}>
                    {mood.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Journal Input */}
            <TextInput
              style={styles.journalInput}
              value={journalText}
              onChangeText={setJournalText}
              placeholder="Record your arcane observations..."
              placeholderTextColor="#3d3d5a"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            >
              <Text style={styles.saveText}>SAVE TO CHRONICLE</Text>
            </Pressable>

            {entries.length > 0 && (
              <Text style={styles.pastTitle}>PAST ENTRIES</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={32} color={BORDER} />
            <Text style={styles.emptyText}>No chronicles yet</Text>
            <Text style={styles.emptySubText}>Record your first arcane observation above</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 80 }} />}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  pageTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 18,
    color: PURPLE,
    letterSpacing: 3,
    textShadowColor: PURPLE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  moodRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  moodBtn: {
    flex: 1,
    minWidth: 58,
    borderWidth: 1,
    borderColor: '#2d2d4a',
    backgroundColor: '#0f0f1a',
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  moodLabel: {
    fontFamily: 'monospace',
    fontSize: 7,
    color: '#8b8bb5',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  journalInput: {
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: MAGENTA,
    padding: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 14,
    minHeight: 120,
    lineHeight: 22,
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  saveBtn: {
    backgroundColor: MAGENTA,
    padding: 16,
    alignItems: 'center',
    shadowColor: MAGENTA,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  saveBtnPressed: { opacity: 0.8 },
  saveText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: 3,
  },

  pastTitle: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 12,
    color: '#8b8bb5',
    letterSpacing: 2,
  },

  entryCard: {
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: '#2d2d4a',
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryMood: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  entryMoodLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
  },
  entryDate: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b8bb5',
  },
  entryText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#d0d0e8',
    lineHeight: 20,
  },

  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 14,
    color: '#8b8bb5',
  },
  emptySubText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#3d3d5a',
    textAlign: 'center',
  },
});
