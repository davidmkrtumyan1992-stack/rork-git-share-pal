import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, Check, X, Clock, Calendar, History } from 'lucide-react-native';
import { VowEntry } from '@/types/database';
import { darkTheme } from '@/constants/theme';
import { styles } from './DashboardStyles';

interface HistoryTabProps {
  historyEntries: VowEntry[];
  historySubTab: 'antidotes' | 'history';
  language: string;
  t: any;
  markAntidotePending: boolean;
  postponePending: boolean;
  onSetHistorySubTab: (tab: 'antidotes' | 'history') => void;
  handleMarkCompleted: (id: string) => void;
  handlePostpone: (id: string) => void;
  formatDate: (date: string) => string;
  isOverdue: (entry: VowEntry) => boolean;
  getVowNameFromType: (type: string) => string;
  getVowCategoryFromType: (type: string) => string;
}

export const HistoryTab = memo(function HistoryTab({
  historyEntries,
  historySubTab,
  language,
  t,
  markAntidotePending,
  postponePending,
  onSetHistorySubTab,
  handleMarkCompleted,
  handlePostpone,
  formatDate,
  isOverdue,
  getVowNameFromType,
  getVowCategoryFromType,
}: HistoryTabProps) {

  const antidoteEntries = useMemo(
    () => historyEntries.filter(e => e.status === 'broken' && !e.antidote_completed),
    [historyEntries]
  );

  const keptEntries = useMemo(
    () => historyEntries.filter(e => e.status === 'kept'),
    [historyEntries]
  );

  const displayedEntries = historySubTab === 'antidotes' ? antidoteEntries : keptEntries;

  const renderHistoryCard = (entry: VowEntry, isOverdueEntry: boolean) => {
    const vowName = getVowNameFromType(entry.vow_type);
    const categoryName = getVowCategoryFromType(entry.vow_type);
    const isKept = entry.status === 'kept';
    const isBroken = entry.status === 'broken';
    const showActions = isBroken && !entry.antidote_completed;

    return (
      <View key={entry.id} style={[styles.historyCard, isOverdueEntry && styles.historyCardOverdue]}>
        {isOverdueEntry && (
          <View style={styles.overdueLabel}>
            <AlertTriangle size={14} color="#C5A572" />
            <Text style={styles.overdueLabelText}>{t.dashboard.overdueDeb}</Text>
          </View>
        )}
        <View style={styles.historyCardHeader}>
          <View style={styles.vowNumberContainer}>
            {isBroken ? (
              <LinearGradient colors={['#B85C4F', '#A04A3E']} style={styles.vowNumber}>
                <Text style={styles.vowNumberText}>!</Text>
              </LinearGradient>
            ) : (
              <LinearGradient colors={['#6B8E7F', '#5A7A6D']} style={styles.vowNumber}>
                <Check size={16} color="#FFFFFF" />
              </LinearGradient>
            )}
          </View>
          <View style={styles.vowCategoryBadge}>
            <Text style={styles.vowCategoryText}>{categoryName}</Text>
          </View>
          <View style={styles.historyDateBadge}>
            <Clock size={12} color={darkTheme.colors.textMuted} />
            <Text style={styles.historyDateText}>{formatDate(entry.entry_date)}</Text>
          </View>
        </View>

        <Text style={styles.historyVowText}>{vowName}</Text>

        {isKept && (
          <View style={styles.historyInfoBoxKept}>
            <Check size={18} color="#7FA88F" />
            <Text style={styles.historyInfoBoxKeptText}>{t.dashboard.vowKept}</Text>
          </View>
        )}

        {isBroken && (
          <>
            <View style={styles.historyInfoBoxBroken}>
              <X size={18} color="#B85C4F" />
              <Text style={styles.historyInfoBoxBrokenText}>{t.dashboard.vowBroken}</Text>
            </View>
            {entry.antidote_text && (
              <View style={styles.historyInfoBoxAntidote}>
                <Text style={styles.antidoteLabelSmall}>{t.dashboard.antidoteLabel}</Text>
                <Text style={styles.antidoteValueText}>{entry.antidote_text}</Text>
              </View>
            )}
            {entry.antidote_completed && (
              <View style={styles.antidoteCompletedBadge}>
                <Check size={14} color="#6B8E7F" />
                <Text style={styles.antidoteCompletedText}>{t.dashboard.antidoteCompleted}</Text>
              </View>
            )}
          </>
        )}

        {entry.note_text && isKept && (
          <View style={styles.noteDisplay}>
            <Text style={styles.noteDisplayText}>«{entry.note_text}»</Text>
          </View>
        )}

        {showActions && (
          <View style={styles.historyActions}>
            <TouchableOpacity
              style={styles.historyActionButton}
              onPress={() => handleMarkCompleted(entry.id)}
              disabled={markAntidotePending}
            >
              <LinearGradient colors={['#7FA88F', '#6B9E7D']} style={styles.historyActionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.historyActionText}>{t.dashboard.completed}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.historyPostponeButton}
              onPress={() => handlePostpone(entry.id)}
              disabled={postponePending}
            >
              <Calendar size={16} color={darkTheme.colors.textSecondary} />
              <Text style={styles.historyPostponeText}>{t.dashboard.postpone}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.historyTabsContainer}>
        <Pressable
          style={[styles.historyTab, styles.historyTabLeft, historySubTab === 'antidotes' && styles.historyTabActive]}
          onPress={() => onSetHistorySubTab('antidotes')}
        >
          <Text style={[styles.historyTabText, historySubTab === 'antidotes' && styles.historyTabTextActive]}>
            {t.dashboard.antidotesTab}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.historyTab, styles.historyTabRight, historySubTab === 'history' && styles.historyTabActive]}
          onPress={() => onSetHistorySubTab('history')}
        >
          <Text style={[styles.historyTabText, historySubTab === 'history' && styles.historyTabTextActive]}>
            {t.dashboard.historyTab}
          </Text>
        </Pressable>
      </View>

      {displayedEntries.length === 0 ? (
        <View style={styles.emptyHistory}>
          <History size={48} color={darkTheme.colors.textMuted} />
          <Text style={styles.emptyHistoryText}>
            {historySubTab === 'antidotes'
              ? language === 'ru' ? 'Нет невыполненных антидотов' : language === 'zh' ? '没有未完成的解毒剂' : 'No uncompleted antidotes'
              : language === 'ru' ? 'Нет записей' : language === 'zh' ? '没有记录' : 'No entries'}
          </Text>
          <Text style={styles.emptyHistorySubtext}>
            {historySubTab === 'antidotes'
              ? language === 'ru' ? 'Нарушенные обеты появятся здесь' : language === 'zh' ? '违反的誓言将显示在这里' : 'Broken vows will appear here'
              : language === 'ru' ? 'Соблюдённые обеты появятся здесь' : language === 'zh' ? '遵守的誓言将显示在这里' : 'Kept vows will appear here'}
          </Text>
        </View>
      ) : (
        <View style={styles.historyContainer}>
          {displayedEntries.map(entry => renderHistoryCard(entry, isOverdue(entry)))}
        </View>
      )}
    </>
  );
});
