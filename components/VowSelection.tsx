import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Ban,
  Cigarette,
  Wine,
  Candy,
  Smartphone,
  Dumbbell,
  Brain,
  BookOpen,
  Star,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';

const vowIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  noFap: Ban,
  noSmoke: Cigarette,
  noAlcohol: Wine,
  noSugar: Candy,
  noSocialMedia: Smartphone,
  exercise: Dumbbell,
  meditation: Brain,
  reading: BookOpen,
  custom: Star,
};

const vowColors: Record<string, string> = {
  noFap: '#EF4444',
  noSmoke: '#F59E0B',
  noAlcohol: '#8B5CF6',
  noSugar: '#EC4899',
  noSocialMedia: '#3B82F6',
  exercise: '#10B981',
  meditation: '#06B6D4',
  reading: '#F97316',
  custom: '#6366F1',
};

interface VowSelectionProps {
  selectedVow: string | null;
  onSelect: (vowType: string) => void;
}

export function VowSelection({ selectedVow, onSelect }: VowSelectionProps) {
  const { language } = useAuth();
  const t = getTranslation(language);

  const vowTypes = [
    { key: 'noFap', title: t.vows.noFap, desc: t.vows.noFapDesc },
    { key: 'noSmoke', title: t.vows.noSmoke, desc: t.vows.noSmokeDesc },
    { key: 'noAlcohol', title: t.vows.noAlcohol, desc: t.vows.noAlcoholDesc },
    { key: 'noSugar', title: t.vows.noSugar, desc: t.vows.noSugarDesc },
    { key: 'noSocialMedia', title: t.vows.noSocialMedia, desc: t.vows.noSocialMediaDesc },
    { key: 'exercise', title: t.vows.exercise, desc: t.vows.exerciseDesc },
    { key: 'meditation', title: t.vows.meditation, desc: t.vows.meditationDesc },
    { key: 'reading', title: t.vows.reading, desc: t.vows.readingDesc },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t.vows.title}</Text>
      
      <View style={styles.grid}>
        {vowTypes.map((vow) => {
          const IconComponent = vowIcons[vow.key];
          const color = vowColors[vow.key];
          const isSelected = selectedVow === vow.key;
          
          return (
            <TouchableOpacity
              key={vow.key}
              style={[
                styles.vowCard,
                isSelected && { borderColor: color, borderWidth: 2 },
              ]}
              onPress={() => onSelect(vow.key)}
              testID={`vow-${vow.key}`}
            >
              <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <IconComponent size={28} color={color} />
              </View>
              <Text style={styles.vowTitle}>{vow.title}</Text>
              <Text style={styles.vowDesc} numberOfLines={2}>
                {vow.desc}
              </Text>
              {isSelected && (
                <View style={[styles.selectedBadge, { backgroundColor: color }]}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.lg,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
  },
  vowCard: {
    width: '47%',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    position: 'relative',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: darkTheme.spacing.sm,
  },
  vowTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
  },
  vowDesc: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textSecondary,
    lineHeight: 16,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: darkTheme.colors.text,
    fontWeight: darkTheme.fontWeight.bold,
    fontSize: darkTheme.fontSize.sm,
  },
});
