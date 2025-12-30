import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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
  X,
  Check,
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
  selectedVows: string[];
  onToggleVow: (vowType: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function VowSelection({ 
  selectedVows, 
  onToggleVow, 
  onConfirm, 
  onClose,
  isLoading 
}: VowSelectionProps) {
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

  const handleToggle = (vowKey: string) => {
    console.log('Toggling vow:', vowKey);
    onToggleVow(vowKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={darkTheme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.vows.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.subtitle}>
        {language === 'ru' 
          ? `Выбрано: ${selectedVows.length}` 
          : `Selected: ${selectedVows.length}`}
      </Text>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {vowTypes.map((vow) => {
            const IconComponent = vowIcons[vow.key];
            const color = vowColors[vow.key];
            const isSelected = selectedVows.includes(vow.key);
            
            return (
              <TouchableOpacity
                key={vow.key}
                style={[
                  styles.vowCard,
                  isSelected && { borderColor: color, borderWidth: 2 },
                ]}
                onPress={() => handleToggle(vow.key)}
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
                    <Check size={14} color={darkTheme.colors.text} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedVows.length === 0 && styles.confirmButtonDisabled,
          ]}
          onPress={onConfirm}
          disabled={selectedVows.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={darkTheme.colors.text} />
          ) : (
            <Text style={styles.confirmButtonText}>
              {language === 'ru' ? 'Продолжить' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: darkTheme.spacing.sm,
    paddingTop: darkTheme.spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: darkTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: darkTheme.fontSize.xl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  subtitle: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: darkTheme.spacing.md,
  },
  scrollContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: darkTheme.spacing.md,
    paddingBottom: darkTheme.spacing.lg,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border,
  },
  confirmButton: {
    backgroundColor: darkTheme.colors.primary,
    paddingVertical: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: darkTheme.colors.backgroundTertiary,
    opacity: 0.6,
  },
  confirmButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
  },
});
