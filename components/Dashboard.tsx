import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  Flame,
  CheckCircle,
  XCircle,
  Calendar,
  Settings,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTodayEntry, useVowStats, useCreateVowEntry } from '@/hooks/useVows';
import { getTranslation, formatNumber } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { VowStatus } from '@/types/database';

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

interface DashboardProps {
  selectedVow: string | null;
  onSelectVow: () => void;
  onOpenSettings: () => void;
  onOpenAdmin?: () => void;
}

export function Dashboard({ selectedVow, onSelectVow, onOpenSettings, onOpenAdmin }: DashboardProps) {
  const { profile, language, isAdmin } = useAuth();
  const t = getTranslation(language);
  
  const { data: todayEntry, isLoading: entryLoading } = useTodayEntry(selectedVow);
  const { data: stats, isLoading: statsLoading } = useVowStats(selectedVow);
  const createEntry = useCreateVowEntry();
  
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [pendingStatus, setPendingStatus] = useState<VowStatus | null>(null);

  const vowColor = selectedVow ? vowColors[selectedVow] || darkTheme.colors.primary : darkTheme.colors.primary;

  const handleMarkStatus = (status: VowStatus) => {
    if (!selectedVow) return;
    
    if (status === 'broken') {
      setPendingStatus(status);
      setNoteModalVisible(true);
    } else {
      createEntry.mutate({ vowType: selectedVow, status });
    }
  };

  const handleSubmitWithNote = () => {
    if (!selectedVow || !pendingStatus) return;
    
    createEntry.mutate({
      vowType: selectedVow,
      status: pendingStatus,
      noteText: noteText || undefined,
    });
    
    setNoteModalVisible(false);
    setNoteText('');
    setPendingStatus(null);
  };

  const getStatusText = () => {
    if (!todayEntry) return t.status.pending;
    return t.status[todayEntry.status];
  };

  const getStatusColor = () => {
    if (!todayEntry) return darkTheme.colors.textMuted;
    switch (todayEntry.status) {
      case 'kept': return darkTheme.colors.success;
      case 'broken': return darkTheme.colors.error;
      case 'postponed': return darkTheme.colors.warning;
      default: return darkTheme.colors.textMuted;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t.dashboard.welcome},</Text>
          <Text style={styles.username}>{profile?.username || profile?.full_name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
          <Settings size={24} color={darkTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {isAdmin && onOpenAdmin && (
        <TouchableOpacity style={styles.adminBanner} onPress={onOpenAdmin}>
          <Text style={styles.adminText}>{t.admin.title}</Text>
          <ChevronRight size={20} color={darkTheme.colors.primary} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.vowSelector} onPress={onSelectVow}>
        <View style={styles.vowSelectorContent}>
          <View style={[styles.vowIndicator, { backgroundColor: vowColor }]} />
          <View style={styles.vowTextContainer}>
            <Text style={styles.vowLabel}>{t.dashboard.selectVow}</Text>
            <Text style={styles.vowValue}>
              {selectedVow ? t.vows[selectedVow as keyof typeof t.vows] || selectedVow : t.dashboard.noVowSelected}
            </Text>
          </View>
        </View>
        <ChevronRight size={24} color={darkTheme.colors.textMuted} />
      </TouchableOpacity>

      {selectedVow && (
        <>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.streakCard]}>
              <Flame size={32} color={darkTheme.colors.warning} />
              <Text style={styles.statValue}>
                {statsLoading ? '...' : formatNumber(stats?.streak || 0)}
              </Text>
              <Text style={styles.statLabel}>{t.dashboard.streak}</Text>
              <Text style={styles.statSubLabel}>{t.dashboard.days}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.smallStatCard]}>
                <CheckCircle size={24} color={darkTheme.colors.success} />
                <Text style={styles.smallStatValue}>
                  {statsLoading ? '...' : formatNumber(stats?.totalKept || 0)}
                </Text>
                <Text style={styles.smallStatLabel}>{t.dashboard.totalKept}</Text>
              </View>

              <View style={[styles.statCard, styles.smallStatCard]}>
                <XCircle size={24} color={darkTheme.colors.error} />
                <Text style={styles.smallStatValue}>
                  {statsLoading ? '...' : formatNumber(stats?.totalBroken || 0)}
                </Text>
                <Text style={styles.smallStatLabel}>{t.dashboard.totalBroken}</Text>
              </View>
            </View>
          </View>

          <View style={styles.todaySection}>
            <View style={styles.todaySectionHeader}>
              <Calendar size={20} color={darkTheme.colors.textSecondary} />
              <Text style={styles.todayTitle}>{t.dashboard.todayStatus}</Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {entryLoading ? t.common.loading : getStatusText()}
              </Text>
            </View>
          </View>

          {!todayEntry && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.keptButton]}
                onPress={() => handleMarkStatus('kept')}
                disabled={createEntry.isPending}
              >
                {createEntry.isPending ? (
                  <ActivityIndicator color={darkTheme.colors.text} />
                ) : (
                  <>
                    <CheckCircle size={24} color={darkTheme.colors.text} />
                    <Text style={styles.actionButtonText}>{t.dashboard.markAsKept}</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.brokenButton]}
                onPress={() => handleMarkStatus('broken')}
                disabled={createEntry.isPending}
              >
                <XCircle size={24} color={darkTheme.colors.text} />
                <Text style={styles.actionButtonText}>{t.dashboard.markAsBroken}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <Modal
        visible={noteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.dashboard.addNote}</Text>
            <TextInput
              style={styles.noteInput}
              placeholder={t.dashboard.addNote}
              placeholderTextColor={darkTheme.colors.textMuted}
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNoteModalVisible(false);
                  setNoteText('');
                  setPendingStatus(null);
                }}
              >
                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSubmitWithNote}
              >
                <Text style={styles.confirmButtonText}>{t.common.confirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.lg,
  },
  welcomeText: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.textSecondary,
  },
  username: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: darkTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: darkTheme.colors.primaryDark + '30',
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.primary,
  },
  adminText: {
    color: darkTheme.colors.primary,
    fontWeight: darkTheme.fontWeight.semibold,
    fontSize: darkTheme.fontSize.md,
  },
  vowSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  vowSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vowIndicator: {
    width: 8,
    height: 48,
    borderRadius: 4,
    marginRight: darkTheme.spacing.md,
  },
  vowTextContainer: {
    gap: 4,
  },
  vowLabel: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textMuted,
  },
  vowValue: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
  },
  statsContainer: {
    marginBottom: darkTheme.spacing.lg,
  },
  streakCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: darkTheme.spacing.xl,
    marginBottom: darkTheme.spacing.md,
  },
  statCard: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  statValue: {
    fontSize: 48,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    marginTop: darkTheme.spacing.sm,
  },
  statLabel: {
    fontSize: darkTheme.fontSize.md,
    color: darkTheme.colors.textSecondary,
  },
  statSubLabel: {
    fontSize: darkTheme.fontSize.sm,
    color: darkTheme.colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
  },
  smallStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: darkTheme.spacing.md,
  },
  smallStatValue: {
    fontSize: darkTheme.fontSize.xxl,
    fontWeight: darkTheme.fontWeight.bold,
    color: darkTheme.colors.text,
    marginTop: darkTheme.spacing.xs,
  },
  smallStatLabel: {
    fontSize: darkTheme.fontSize.xs,
    color: darkTheme.colors.textSecondary,
    marginTop: darkTheme.spacing.xs,
  },
  todaySection: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  todaySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
    marginBottom: darkTheme.spacing.md,
  },
  todayTitle: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
  },
  statusBadge: {
    paddingVertical: darkTheme.spacing.sm,
    paddingHorizontal: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  actionsContainer: {
    gap: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: darkTheme.spacing.sm,
    paddingVertical: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
  },
  keptButton: {
    backgroundColor: darkTheme.colors.success,
  },
  brokenButton: {
    backgroundColor: darkTheme.colors.error,
  },
  actionButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: darkTheme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.lg,
    padding: darkTheme.spacing.lg,
  },
  modalTitle: {
    fontSize: darkTheme.fontSize.lg,
    fontWeight: darkTheme.fontWeight.semibold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.md,
  },
  noteInput: {
    backgroundColor: darkTheme.colors.backgroundSecondary,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    color: darkTheme.colors.text,
    fontSize: darkTheme.fontSize.md,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: darkTheme.spacing.md,
    marginTop: darkTheme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    paddingVertical: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: darkTheme.colors.backgroundTertiary,
  },
  confirmButton: {
    backgroundColor: darkTheme.colors.primary,
  },
  cancelButtonText: {
    color: darkTheme.colors.textSecondary,
    fontWeight: darkTheme.fontWeight.semibold,
  },
  confirmButtonText: {
    color: darkTheme.colors.text,
    fontWeight: darkTheme.fontWeight.semibold,
  },
});
