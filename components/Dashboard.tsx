import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { History, ChevronRight, Settings, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateVowEntry, useTodayEntries, useHistoryEntries, useMarkAntidoteCompleted, usePostponeAntidote } from '@/hooks/useVows';
import { useDailyVows } from '@/hooks/useVowCycle';
import { VowEntry } from '@/types/database';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { getVowsByCategory } from '@/data/vows';
import { SettingsPanel } from '@/components/SettingsPanel';
import { VowSelection } from '@/components/VowSelection';
import { DiaryTab, VowCardState } from '@/components/DiaryTab';
import { HistoryTab } from '@/components/HistoryTab';
import { styles } from '@/components/DashboardStyles';
import { computeScheduledTimes } from '@/hooks/useVowNotifications';

type TabType = 'diary' | 'history' | 'settings' | 'vowSelection';
type HistorySubTab = 'antidotes' | 'history';

const vowCategoryNames: Record<string, Record<string, string>> = {
  tenPrinciples: {
    ru: '10 этических принципов', en: '10 Ethical Principles', fr: '10 Principes éthiques',
    de: '10 Ethische Prinzipien', es: '10 Principios éticos', zh: '10 条伦理原则',
    hy: '10 էթիկական սկզբունքներ', it: '10 Principi etici'
  },
  freedom: {
    ru: 'Обеты свободы', en: 'Freedom Vows', fr: 'Vœux de liberté',
    de: 'Freiheitsgelübde', es: 'Votos de libertad', zh: '自由誓言',
    hy: 'Ազատության ուխտեր', it: 'Voti di libertà'
  },
  bodhisattva: {
    ru: 'Обеты Бодхисаттвы', en: 'Bodhisattva Vows', fr: 'Vœux de Bodhisattva',
    de: 'Bodhisattva-Gelübde', es: 'Votos de Bodhisattva', zh: '菩萨戒',
    hy: 'Բոդհիսատվայի ուխտեր', it: 'Voti di Bodhisattva'
  },
  tantric: {
    ru: 'Тантрические обеты', en: 'Tantric Vows', fr: 'Vœux tantriques',
    de: 'Tantrische Gelübde', es: 'Votos tántricos', zh: '密宗誓言',
    hy: 'Տանտրական ուխտեր', it: 'Voti tantrici'
  },
  nuns: {
    ru: 'Обеты монахинь', en: 'Nun Vows', fr: 'Vœux de religieuses',
    de: 'Nonnengelübde', es: 'Votos de monjas', zh: '尼众戒',
    hy: 'Կրոնավոր կանանց ուխտեր', it: 'Voti di monache'
  },
  monks: {
    ru: 'Обеты монахов', en: 'Monk Vows', fr: 'Vœux de moines',
    de: 'Mönchsgelübde', es: 'Votos de monjes', zh: '僧众戒',
    hy: 'Կրոնավոր տղամارдκανц ուխτερ', it: 'Voti di monaci'
  },
};

const getLocalizedText = (lang: string): 'ru' | 'en' | 'it' | 'fr' | 'de' | 'es' | 'zh' | 'hy' => {
  const supportedLangs = ['ru', 'en', 'it', 'fr', 'de', 'es', 'zh', 'hy'];
  return supportedLangs.includes(lang) ? lang as any : 'en';
};

const BREAKPOINTS = { sm: 320, md: 768, lg: 1024 };

interface DashboardProps {
  selectedVows: string[];
  activeVow: string | null;
  onSetActiveVow: (vow: string) => void;
  onSelectVow: () => void;
  onOpenAdmin?: () => void;
  onRemoveVow?: (vow: string) => void;
  onToggleVow?: (vowType: string) => void;
  onConfirmVows?: () => void;
  isVowSaving?: boolean;
  notificationTimes?: Record<string, string>;
  notificationTimezone?: string;
}

export function Dashboard({
  selectedVows,
  activeVow,
  onSetActiveVow,
  onSelectVow,
  onOpenAdmin,
  onRemoveVow,
  onToggleVow,
  onConfirmVows,
  isVowSaving,
  notificationTimes = {},
  notificationTimezone = 'Europe/Moscow',
}: DashboardProps) {
  const { profile, language, isAdmin } = useAuth();
  const t = getTranslation(language);
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;

  const createEntry = useCreateVowEntry();
  const { data: todayEntries = [] } = useTodayEntries();
  const { data: historyEntries = [] } = useHistoryEntries();
  const markAntidoteCompleted = useMarkAntidoteCompleted();
  const postponeAntidote = usePostponeAntidote();

  const { dailyVows, isLoading: cycleLoading, initializeIfNeeded, advanceCyclePositions, needsUpdate } = useDailyVows(selectedVows);

  const notificationInterval: 2 | 3 =
    profile?.notification_interval === 2 || profile?.notification_interval === 3
      ? profile.notification_interval : 2;
  const notificationsEnabled = profile?.notifications_enabled || false;

  // Scheduled times for each vow card (computed once per day at 9am)
  const scheduledTimes = useMemo(() =>
    computeScheduledTimes(dailyVows.length, notificationInterval),
    [dailyVows.length, notificationInterval]
  );

  // Current time, refreshed every minute to unlock next card
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // How many vow cards are visible (progressive reveal every intervalHours)
  const visibleVowsCount = useMemo(() => {
    if (!notificationsEnabled || scheduledTimes.length === 0) return dailyVows.length;
    const visible = scheduledTimes.filter(t => new Date(t).getTime() <= nowMs).length;
    return Math.max(1, Math.min(visible, dailyVows.length));
  }, [scheduledTimes, nowMs, notificationsEnabled, dailyVows.length]);

  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>('antidotes');
  const [cardStates, setCardStates] = useState<Record<string, VowCardState>>({});

  useEffect(() => {
    if (selectedVows.length > 0) initializeIfNeeded();
  }, [selectedVows, initializeIfNeeded]);

  useEffect(() => {
    if (needsUpdate && selectedVows.length > 0) advanceCyclePositions();
  }, [needsUpdate, selectedVows, advanceCyclePositions]);

  const getVowCategoryName = useCallback((vowKey: string) => {
    const langKey = getLocalizedText(language);
    return vowCategoryNames[vowKey]?.[langKey] || vowKey;
  }, [language]);

  const handleExpandCard = useCallback((cardKey: string, type: 'keep' | 'break') => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        expanded: prev[cardKey]?.expanded === type ? null : type,
        noteText: prev[cardKey]?.noteText || '',
        antidoteText: prev[cardKey]?.antidoteText || '',
        selectedAntidotes: prev[cardKey]?.selectedAntidotes || [],
      }
    }));
  }, []);

  const handleCollapseCard = useCallback((cardKey: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: { ...prev[cardKey], expanded: null, noteText: '', antidoteText: '', selectedAntidotes: [] }
    }));
  }, []);

  const handleSaveKeep = useCallback((vowType: string, cardKey: string, vowIndex: number) => {
    const state = cardStates[cardKey];
    const entryKey = `${vowType}_${vowIndex}`;
    handleCollapseCard(cardKey);
    createEntry.mutate(
      { vowType: entryKey, status: 'kept', noteText: state?.noteText || undefined },
      {
        onError: () => Alert.alert(
          language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
          language === 'ru' ? '«Не удалось сохранить запись. Попробуйте ещё раз»' : language === 'zh' ? '保存失败，请重试' : '"Failed to save entry. Please try again"'
        ),
      }
    );
  }, [cardStates, handleCollapseCard, createEntry, language]);

  const handleSaveBreak = useCallback((vowType: string, cardKey: string, vowIndex: number) => {
    const state = cardStates[cardKey];
    const entryKey = `${vowType}_${vowIndex}`;
    handleCollapseCard(cardKey);
    createEntry.mutate(
      { vowType: entryKey, status: 'broken', antidoteText: state?.antidoteText || undefined },
      {
        onError: () => Alert.alert(
          language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
          language === 'ru' ? '«Не удалось сохранить запись. Попробуйте ещё раз»' : language === 'zh' ? '保存失败，请重试' : '"Failed to save entry. Please try again"'
        ),
      }
    );
  }, [cardStates, handleCollapseCard, createEntry, language]);

  const selectAntidoteTag = useCallback((cardKey: string, tag: string) => {
    setCardStates(prev => {
      const currentText = prev[cardKey]?.antidoteText || '';
      return { ...prev, [cardKey]: { ...prev[cardKey], antidoteText: currentText ? `${currentText}; ${tag}` : tag } };
    });
  }, []);

  const updateNoteText = useCallback((cardKey: string, text: string) => {
    setCardStates(prev => ({ ...prev, [cardKey]: { ...prev[cardKey], noteText: text } }));
  }, []);

  const updateAntidoteText = useCallback((cardKey: string, text: string) => {
    setCardStates(prev => ({ ...prev, [cardKey]: { ...prev[cardKey], antidoteText: text } }));
  }, []);

  const findTodayEntry = useCallback((vowType: string, vowIndex: number): VowEntry | null => {
    const entryKey = `${vowType}_${vowIndex}`;
    return todayEntries.filter(e => e.vow_type === entryKey)[0] || null;
  }, [todayEntries]);

  const formatTime = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    try {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: notificationTimezone,
      });
    } catch {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }, [notificationTimezone]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return language === 'ru' ? 'Вчера' : language === 'zh' ? '昨天' : 'Yesterday';
    }
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', options);
  }, [language]);

  const isOverdue = useCallback((entry: VowEntry): boolean => {
    const entryDate = new Date(entry.entry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entry.status === 'broken' && !entry.antidote_completed && entryDate < today;
  }, []);

  const handleMarkCompleted = useCallback((entryId: string) => {
    markAntidoteCompleted.mutate(entryId, {
      onError: () => Alert.alert(
        language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
        language === 'ru' ? '«Не удалось отметить антидот выполненным»' : language === 'zh' ? '无法标记解毒剂为已完成' : '"Failed to mark antidote as completed"'
      ),
    });
  }, [markAntidoteCompleted, language]);

  const handlePostpone = useCallback((entryId: string) => {
    postponeAntidote.mutate(entryId, {
      onError: () => Alert.alert(
        language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
        language === 'ru' ? '«Не удалось перенести антидот»' : language === 'zh' ? '无法推迟解毒剂' : '"Failed to postpone antidote"'
      ),
    });
  }, [postponeAntidote, language]);

  const getVowNameFromType = useCallback((vowType: string): string => {
    const [category, indexStr] = vowType.split('_');
    const index = parseInt(indexStr, 10);
    const vows = getVowsByCategory(category);
    if (vows && vows[index]) return language === 'ru' ? vows[index].textRu : vows[index].textEn;
    return vowType;
  }, [language]);

  const getVowCategoryFromType = useCallback((vowType: string): string => {
    const [category] = vowType.split('_');
    const langKey = getLocalizedText(language);
    return vowCategoryNames[category]?.[langKey] || category;
  }, [language]);

  const responsiveStyles = useMemo(() => ({
    scrollContent: {
      padding: isSmallScreen ? 16 : isLargeScreen ? 32 : 20,
      paddingBottom: 40,
      maxWidth: isLargeScreen ? 1200 : undefined,
      alignSelf: isLargeScreen ? 'center' as const : undefined,
      width: isLargeScreen ? '100%' : undefined,
    },
    greeting: { fontSize: isSmallScreen ? 24 : isLargeScreen ? 36 : 28 },
  }), [isSmallScreen, isLargeScreen]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F2ED', '#E8E1D5', '#D4C5B0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          responsiveStyles.scrollContent,
          { paddingBottom: 100 + Math.max(insets.bottom, 20) }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { fontSize: responsiveStyles.greeting.fontSize }]}>
            {language === 'ru' ? 'привет,' : language === 'zh' ? '你好，' : 'hello,'}{' '}
            <Text style={styles.username}>
              {profile?.username || profile?.full_name || 'user'}
            </Text>
          </Text>
        </View>

        {isAdmin && onOpenAdmin && (
          <Pressable style={styles.adminBanner} onPress={onOpenAdmin}>
            <Text style={styles.adminText}>{t.admin.title}</Text>
            <ChevronRight size={20} color={darkTheme.colors.primary} />
          </Pressable>
        )}

        {activeTab === 'diary' && (
          <DiaryTab
            selectedVows={selectedVows}
            dailyVows={dailyVows}
            cardStates={cardStates}
            cycleLoading={cycleLoading}
            language={language}
            t={t}
            isSmallScreen={isSmallScreen}
            isLargeScreen={isLargeScreen}
            createEntryPending={createEntry.isPending}
            onGoToVowSelection={() => setActiveTab('vowSelection')}
            onRemoveVow={onRemoveVow}
            getVowCategoryName={getVowCategoryName}
            findTodayEntry={findTodayEntry}
            formatTime={formatTime}
            handleExpandCard={handleExpandCard}
            handleCollapseCard={handleCollapseCard}
            handleSaveKeep={handleSaveKeep}
            handleSaveBreak={handleSaveBreak}
            updateNoteText={updateNoteText}
            updateAntidoteText={updateAntidoteText}
            selectAntidoteTag={selectAntidoteTag}
            scheduledTimes={scheduledTimes}
            visibleVowsCount={visibleVowsCount}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            historyEntries={historyEntries}
            historySubTab={historySubTab}
            language={language}
            t={t}
            markAntidotePending={markAntidoteCompleted.isPending}
            postponePending={postponeAntidote.isPending}
            onSetHistorySubTab={setHistorySubTab}
            handleMarkCompleted={handleMarkCompleted}
            handlePostpone={handlePostpone}
            formatDate={formatDate}
            isOverdue={isOverdue}
            getVowNameFromType={getVowNameFromType}
            getVowCategoryFromType={getVowCategoryFromType}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel onSelectVow={() => setActiveTab('vowSelection')} />
        )}

        {activeTab === 'vowSelection' && onToggleVow && onConfirmVows && (
          <VowSelection
            selectedVows={selectedVows}
            onToggleVow={(vowKey) => {
              console.log('[Dashboard] VowSelection onToggleVow called');
              console.log('[Dashboard] Vow key:', vowKey);
              console.log('[Dashboard] Current selectedVows:', selectedVows);
              console.log('[Dashboard] Calling parent onToggleVow');
              onToggleVow(vowKey);
              console.log('[Dashboard] Parent onToggleVow called');
            }}
            onConfirm={() => {
              console.log('[Dashboard] VowSelection onConfirm called');
              onConfirmVows();
              setActiveTab('diary');
            }}
            isLoading={isVowSaving}
            isInline={true}
          />
        )}
      </ScrollView>

      <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0)']}
          style={styles.bottomTabShadow}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <Pressable style={styles.bottomTabItem} onPress={() => setActiveTab('diary')}>
          <BookOpen size={24} color={activeTab === 'diary' ? darkTheme.colors.primary : '#5A6A66'} strokeWidth={activeTab === 'diary' ? 2.5 : 2} />
          <Text style={[styles.bottomTabLabel, activeTab === 'diary' && styles.bottomTabLabelActive]}>
            {t.dashboard.title.toLowerCase()}
          </Text>
        </Pressable>
        <Pressable style={styles.bottomTabItem} onPress={() => setActiveTab('history')}>
          <History size={24} color={activeTab === 'history' ? darkTheme.colors.primary : '#5A6A66'} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
          <Text style={[styles.bottomTabLabel, activeTab === 'history' && styles.bottomTabLabelActive]}>
            {t.dashboard.historyTab}
          </Text>
        </Pressable>
        <Pressable style={styles.bottomTabItem} onPress={() => setActiveTab('settings')}>
          <Settings size={24} color={activeTab === 'settings' ? darkTheme.colors.primary : '#5A6A66'} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <Text style={[styles.bottomTabLabel, activeTab === 'settings' && styles.bottomTabLabelActive]}>
            {t.common.settings.toLowerCase()}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
