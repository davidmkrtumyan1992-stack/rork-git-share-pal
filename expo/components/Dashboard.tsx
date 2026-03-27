import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  History,
  Plus,
  X,
  Check,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Clock,
  Calendar,
  AlertTriangle,
  Settings,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateVowEntry, useTodayEntries, useHistoryEntries, useMarkAntidoteCompleted, usePostponeAntidote } from '@/hooks/useVows';
import { useDailyVows, DailyVowItem } from '@/hooks/useVowCycle';
import { VowEntry } from '@/types/database';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';
import { getVowsByCategory } from '@/data/vows';
import { SettingsPanel } from '@/components/SettingsPanel';
import { VowSelection } from '@/components/VowSelection';


type TabType = 'diary' | 'history' | 'settings' | 'vowSelection';
type HistorySubTab = 'antidotes' | 'history';

const vowCategoryNames: Record<string, Record<string, string>> = {
  tenPrinciples: { 
    ru: '10 этических принципов', 
    en: '10 Ethical Principles',
    fr: '10 Principes éthiques',
    de: '10 Ethische Prinzipien',
    es: '10 Principios éticos',
    zh: '10 条伦理原则',
    hy: '10 էթիկական սկզբունքներ',
    it: '10 Principi etici'
  },
  freedom: { 
    ru: 'Обеты свободы', 
    en: 'Freedom Vows',
    fr: 'Vœux de liberté',
    de: 'Freiheitsgelübde',
    es: 'Votos de libertad',
    zh: '自由誓言',
    hy: 'Ազատության ուխտեր',
    it: 'Voti di libertà'
  },
  bodhisattva: { 
    ru: 'Обеты Бодхисаттвы', 
    en: 'Bodhisattva Vows',
    fr: 'Vœux de Bodhisattva',
    de: 'Bodhisattva-Gelübde',
    es: 'Votos de Bodhisattva',
    zh: '菩萨戒',
    hy: 'Բոդհիսատվայի ուխտեր',
    it: 'Voti di Bodhisattva'
  },
  tantric: { 
    ru: 'Тантрические обеты', 
    en: 'Tantric Vows',
    fr: 'Vœux tantriques',
    de: 'Tantrische Gelübde',
    es: 'Votos tántricos',
    zh: '密宗誓言',
    hy: 'Տանտրական ուխտեր',
    it: 'Voti tantrici'
  },
  nuns: { 
    ru: 'Обеты монахинь', 
    en: 'Nun Vows',
    fr: 'Vœux de religieuses',
    de: 'Nonnengelübde',
    es: 'Votos de monjas',
    zh: '尼众戒',
    hy: 'Կրոնավոր կանանց ուխտեր',
    it: 'Voti di monache'
  },
  monks: { 
    ru: 'Обеты монахов', 
    en: 'Monk Vows',
    fr: 'Vœux de moines',
    de: 'Mönchsgelübde',
    es: 'Votos de monjes',
    zh: '僧众戒',
    hy: 'Կրոնավոր տղամարդկանց ուխտեր',
    it: 'Voti di monaci'
  },
};

const getLocalizedText = (lang: string): 'ru' | 'en' | 'it' | 'fr' | 'de' | 'es' | 'zh' | 'hy' => {
  const supportedLangs = ['ru', 'en', 'it', 'fr', 'de', 'es', 'zh', 'hy'];
  return supportedLangs.includes(lang) ? lang as any : 'en';
};

const VowCardComponent = memo(({ 
  vowKey,
  vowItem,
  index,
  categoryName,
  globalIdx,
  cardKey,
  state,
  isSubmitted,
  todayEntry,
  isSmallScreen,
  responsiveStyles,
  language,
  t,
  handleExpandCard,
  handleCollapseCard,
  handleSaveKeep,
  handleSaveBreak,
  updateNoteText,
  updateAntidoteText,
  selectAntidoteTag,
  formatTime,
  createEntryPending,
}: any) => {
  const isKeepExpanded = state?.expanded === 'keep';
  const isBrokenExpanded = state?.expanded === 'break';
  const isKept = todayEntry?.status === 'kept';
  const isBroken = todayEntry?.status === 'broken';

  return (
    <View key={cardKey} style={[styles.vowCard, isSubmitted && styles.vowCardSubmitted]}>
      <View style={styles.vowCardHeader}>
        <View style={styles.vowNumberContainer}>
          {isBroken ? (
            <LinearGradient
              colors={['#B85C4F', '#A04A3E']}
              style={styles.vowNumber}
            >
              <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.vowNumber}
            >
              <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.vowCategoryBadge}>
          <Text style={styles.vowCategoryText}>{categoryName}</Text>
        </View>
        {isSubmitted && todayEntry && (
          <View style={styles.timeBadge}>
            <Clock size={12} color={darkTheme.colors.textMuted} />
            <Text style={styles.timeBadgeText}>{formatTime(todayEntry.updated_at)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.vowText}>{vowItem[getLocalizedText(language)]}</Text>

      {isSubmitted ? (
        <View style={styles.submittedView}>
          {isKept && (
            <View style={styles.infoBoxKept}>
              <Check size={20} color="#7FA88F" />
              <Text style={styles.infoBoxKeptText}>
                {t.dashboard.keptVow}
              </Text>
            </View>
          )}
          {isBroken && (
            <>
              <View style={styles.infoBoxBroken}>
                <X size={20} color="#B85C4F" />
                <Text style={styles.infoBoxBrokenText}>
                  {t.dashboard.vowWasBroken}
                </Text>
              </View>
              {todayEntry.antidote_text && (
                <View style={styles.infoBoxAntidote}>
                  <Text style={styles.antidoteLabelSmall}>
                    {t.dashboard.antidoteLabel}
                  </Text>
                  <Text style={styles.antidoteValueText}>
                    {todayEntry.antidote_text}
                  </Text>
                </View>
              )}
            </>
          )}
          {todayEntry.note_text && isKept && (
            <View style={styles.noteDisplay}>
              <Text style={styles.noteDisplayText}>«{todayEntry.note_text}»</Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {!isKeepExpanded && !isBrokenExpanded && (
            <View style={styles.vowActions}>
              <TouchableOpacity
                style={styles.keepButton}
                onPress={() => handleExpandCard(cardKey, 'keep')}
              >
                <LinearGradient
                  colors={['#7FA88F', '#6B9E7D']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Check size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {t.dashboard.kept}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.brokenButton}
                onPress={() => handleExpandCard(cardKey, 'break')}
              >
                <LinearGradient
                  colors={['#B85C4F', '#A04A3E']}
                  style={styles.actionButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <X size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {t.dashboard.broken}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {isKeepExpanded && (
            <View style={styles.expandedForm}>
              <View style={styles.keepInfoBlock}>
                <Check size={20} color="#7FA88F" />
                <Text style={styles.keepInfoText}>
                  {t.dashboard.tellWhatYouDid}
                </Text>
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder={t.dashboard.notePlaceholder}
                placeholderTextColor={darkTheme.colors.textMuted}
                value={state?.noteText || ''}
                onChangeText={(text) => updateNoteText(cardKey, text)}
                multiline
                numberOfLines={3}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCollapseCard(cardKey)}
                >
                  <Text style={styles.cancelButtonText}>
                    {t.common.cancel}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveKeep(vowKey, cardKey, globalIdx)}
                  disabled={createEntryPending}
                >
                  <LinearGradient
                    colors={['#7FA88F', '#6B9E7D']}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {createEntryPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Sparkles size={18} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>
                          {t.common.save}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isBrokenExpanded && (
            <View style={styles.expandedForm}>
              <View style={styles.brokenInfoBlock}>
                <AlertCircle size={20} color="#C5A572" />
                <Text style={styles.brokenInfoText}>
                  {t.dashboard.whatWillYouDo}
                </Text>
              </View>

              <Text style={styles.antidoteLabel}>
                {t.dashboard.antidote}
              </Text>

              <View style={styles.antidoteTagsWrapper}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.antidoteTagsScroll}
                  contentContainerStyle={styles.antidoteTagsContent}
                  decelerationRate="fast"
                  snapToAlignment="start"
                >
                  {antidoteTags[getLocalizedText(language)].map((tag: string) => (
                    <AntidoteTagButton
                      key={tag}
                      tag={tag}
                      onPress={() => selectAntidoteTag(cardKey, tag)}
                    />
                  ))}
                  <View style={styles.antidoteTagsSpacer} />
                </ScrollView>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']}
                  style={styles.antidoteFadeRight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  pointerEvents="none"
                />
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder={t.dashboard.antidotePlaceholder}
                placeholderTextColor={darkTheme.colors.textMuted}
                value={state?.antidoteText || ''}
                onChangeText={(text) => updateAntidoteText(cardKey, text)}
                multiline
                numberOfLines={3}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCollapseCard(cardKey)}
                >
                  <Text style={styles.cancelButtonText}>
                    {t.common.cancel}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveBreak(vowKey, cardKey, globalIdx)}
                  disabled={createEntryPending}
                >
                  <LinearGradient
                    colors={['#C5A572', '#B09562']}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {createEntryPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Sparkles size={18} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>
                          {t.common.save}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
});

VowCardComponent.displayName = 'VowCard';



const antidoteTags: Record<string, string[]> = {
  ru: ['практиковать щедрость', 'попросить прощения', 'медитировать на сострадание', 'сделать подношение', 'прочитать мантру'],
  en: ['practice generosity', 'ask for forgiveness', 'meditate on compassion', 'make an offering', 'recite a mantra'],
  fr: ['pratiquer la générosité', 'demander pardon', 'méditer sur la compassion', 'faire une offrande', 'réciter un mantra'],
  de: ['Großzügigkeit üben', 'um Vergebung bitten', 'über Mitgefühl meditieren', 'ein Opfer darbringen', 'ein Mantra rezitieren'],
  es: ['practicar generosidad', 'pedir perdón', 'meditar sobre compasión', 'hacer una ofrenda', 'recitar un mantra'],
  zh: ['修习慷慨', '请求原谅', '慈悲冥想', '供养', '诵咒'],
  hy: ['առատաձեռնություն պրակտիկել', 'ներողություն խնդրել', 'կարեկցանք մեդիտացնել', 'ընծա մատուցել', 'մանտրա կարդալ'],
  it: ['praticare la generosità', 'chiedere perdono', 'meditare sulla compassione', 'fare un\'offerta', 'recitare un mantra'],
};

const BREAKPOINTS = {
  sm: 320,
  md: 768,
  lg: 1024,
};

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
}

interface VowCardState {
  vowKey: string;
  vowIndex: number;
  expanded: 'keep' | 'break' | null;
  noteText: string;
  antidoteText: string;
  selectedAntidotes: string[];
}

function AntidoteTagButton({ tag, onPress }: { tag: string; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.antidoteTag,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.antidoteTagText}>{tag}</Text>
      </Animated.View>
    </Pressable>
  );
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
  
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>('antidotes');
  const [cardStates, setCardStates] = useState<Record<string, VowCardState>>({});

  useEffect(() => {
    if (selectedVows.length > 0) {
      initializeIfNeeded();
    }
  }, [selectedVows, initializeIfNeeded]);

  useEffect(() => {
    if (needsUpdate && selectedVows.length > 0) {
      advanceCyclePositions();
    }
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
      [cardKey]: {
        ...prev[cardKey],
        expanded: null,
        noteText: '',
        antidoteText: '',
        selectedAntidotes: [],
      }
    }));
  }, []);

  const handleSaveKeep = useCallback((vowType: string, cardKey: string, vowIndex: number) => {
    const state = cardStates[cardKey];
    const entryKey = `${vowType}_${vowIndex}`;
    handleCollapseCard(cardKey);
    createEntry.mutate(
      {
        vowType: entryKey,
        status: 'kept',
        noteText: state?.noteText || undefined,
      },
      {
        onError: () => {
          Alert.alert(
            language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
            language === 'ru' 
              ? '«Не удалось сохранить запись. Попробуйте ещё раз»' 
              : language === 'zh'
              ? '保存失败，请重试'
              : '"Failed to save entry. Please try again"'
          );
        },
      }
    );
  }, [cardStates, handleCollapseCard, createEntry, language]);

  const handleSaveBreak = useCallback((vowType: string, cardKey: string, vowIndex: number) => {
    const state = cardStates[cardKey];
    const entryKey = `${vowType}_${vowIndex}`;
    handleCollapseCard(cardKey);
    createEntry.mutate(
      {
        vowType: entryKey,
        status: 'broken',
        antidoteText: state?.antidoteText || undefined,
      },
      {
        onError: () => {
          Alert.alert(
            language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
            language === 'ru' 
              ? '«Не удалось сохранить запись. Попробуйте ещё раз»' 
              : language === 'zh'
              ? '保存失败，请重试'
              : '"Failed to save entry. Please try again"'
          );
        },
      }
    );
  }, [cardStates, handleCollapseCard, createEntry, language]);

  const selectAntidoteTag = useCallback((cardKey: string, tag: string) => {
    setCardStates(prev => {
      const currentText = prev[cardKey]?.antidoteText || '';
      const newText = currentText ? `${currentText}; ${tag}` : tag;
      return {
        ...prev,
        [cardKey]: {
          ...prev[cardKey],
          antidoteText: newText,
        }
      };
    });
  }, []);

  const updateNoteText = useCallback((cardKey: string, text: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        noteText: text,
      }
    }));
  }, []);

  const updateAntidoteText = useCallback((cardKey: string, text: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        antidoteText: text,
      }
    }));
  }, []);

  const findTodayEntry = useCallback((vowType: string, vowIndex: number): VowEntry | null => {
    const entryKey = `${vowType}_${vowIndex}`;
    return todayEntries.find(e => e.vow_type === entryKey) || null;
  }, [todayEntries]);

  const formatTime = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

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
      onError: () => {
        Alert.alert(
          language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
          language === 'ru'
            ? '«Не удалось отметить антидот выполненным»'
            : language === 'zh'
            ? '无法标记解毒剂为已完成'
            : '"Failed to mark antidote as completed"'
        );
      },
    });
  }, [markAntidoteCompleted, language]);

  const handlePostpone = useCallback((entryId: string) => {
    postponeAntidote.mutate(entryId, {
      onError: () => {
        Alert.alert(
          language === 'ru' ? 'Ошибка' : language === 'zh' ? '错误' : 'Error',
          language === 'ru'
            ? '«Не удалось перенести антидот»'
            : language === 'zh'
            ? '无法推迟解毒剂'
            : '"Failed to postpone antidote"'
        );
      },
    });
  }, [postponeAntidote, language]);

  const getVowNameFromType = useCallback((vowType: string): string => {
    const [category, indexStr] = vowType.split('_');
    const index = parseInt(indexStr, 10);
    const vows = getVowsByCategory(category);
    if (vows && vows[index]) {
      return language === 'ru' ? vows[index].textRu : vows[index].textEn;
    }
    return vowType;
  }, [language]);

  const getVowCategoryFromType = useCallback((vowType: string): string => {
    const [category] = vowType.split('_');
    const langKey = getLocalizedText(language);
    return vowCategoryNames[category]?.[langKey] || category;
  }, [language]);

  const renderBottomTabs = () => (
    <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0)']} 
        style={styles.bottomTabShadow}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <Pressable
        style={styles.bottomTabItem}
        onPress={() => setActiveTab('diary')}
      >
        <Bell 
          size={24} 
          color={activeTab === 'diary' ? darkTheme.colors.primary : '#5A6A66'}
          strokeWidth={activeTab === 'diary' ? 2.5 : 2}
        />
        <Text style={[styles.bottomTabLabel, activeTab === 'diary' && styles.bottomTabLabelActive]}>
          {t.dashboard.title.toLowerCase()}
        </Text>
      </Pressable>

      <Pressable
        style={styles.bottomTabItem}
        onPress={() => setActiveTab('history')}
      >
        <History 
          size={24} 
          color={activeTab === 'history' ? darkTheme.colors.primary : '#5A6A66'}
          strokeWidth={activeTab === 'history' ? 2.5 : 2}
        />
        <Text style={[styles.bottomTabLabel, activeTab === 'history' && styles.bottomTabLabelActive]}>
          {t.dashboard.historyTab}
        </Text>
      </Pressable>

      <Pressable
        style={styles.bottomTabItem}
        onPress={() => setActiveTab('settings')}
      >
        <Settings 
          size={24} 
          color={activeTab === 'settings' ? darkTheme.colors.primary : '#5A6A66'}
          strokeWidth={activeTab === 'settings' ? 2.5 : 2}
        />
        <Text style={[styles.bottomTabLabel, activeTab === 'settings' && styles.bottomTabLabelActive]}>
          {t.common.settings.toLowerCase()}
        </Text>
      </Pressable>
    </View>
  );

  const renderSelectedVowsChips = () => (
    <View style={[styles.chipsSection, isLargeScreen && styles.chipsSectionLarge]}>
      <View style={styles.chipsSectionHeader}>
        <Text style={[styles.chipsSectionTitle, isLargeScreen && styles.chipsSectionTitleLarge]}>
          {language === 'ru' ? 'Выбранные обеты' : language === 'zh' ? '已选择的誓言' : 'Selected Vows'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setActiveTab('vowSelection')}>
          <Plus size={isSmallScreen ? 18 : 20} color={darkTheme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.chipsScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScrollView}
          contentContainerStyle={styles.chipsScrollContent}
          decelerationRate="fast"
        >
          {selectedVows.map((vow) => (
            <View key={vow} style={[styles.chip, isSmallScreen && styles.chipSmall]}>
              <Text style={[styles.chipText, isSmallScreen && styles.chipTextSmall]}>
                {getVowCategoryName(vow)}
              </Text>
              {onRemoveVow && (
                <TouchableOpacity 
                  style={styles.chipRemove}
                  onPress={() => onRemoveVow(vow)}
                >
                  <X size={isSmallScreen ? 12 : 14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={styles.chipsSpacer} />
        </ScrollView>
        <LinearGradient
          colors={['rgba(245, 242, 237, 0)', 'rgba(245, 242, 237, 0.95)']}
          style={styles.chipsFadeRight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
        />
      </View>
    </View>
  );

  const renderVowCard = (vowKey: string, vowItem: Record<string, string>, index: number, categoryName: string, globalIdx: number) => {
    const cardKey = `${vowKey}-${index}`;
    const state = cardStates[cardKey];
    const isKeepExpanded = state?.expanded === 'keep';
    const isBrokenExpanded = state?.expanded === 'break';
    
    const todayEntry = findTodayEntry(vowKey, globalIdx);
    const isSubmitted = !!todayEntry;
    const isKept = todayEntry?.status === 'kept';
    const isBroken = todayEntry?.status === 'broken';

    return (
      <View key={cardKey} style={[styles.vowCard, isSubmitted && styles.vowCardSubmitted]}>
        <View style={styles.vowCardHeader}>
          <View style={styles.vowNumberContainer}>
            {isBroken ? (
              <LinearGradient
                colors={['#B85C4F', '#A04A3E']}
                style={styles.vowNumber}
              >
                <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.vowNumber}
              >
                <Text style={styles.vowNumberText}>{globalIdx + 1}</Text>
              </LinearGradient>
            )}
          </View>
          <View style={styles.vowCategoryBadge}>
            <Text style={styles.vowCategoryText}>{categoryName}</Text>
          </View>
          {isSubmitted && todayEntry && (
            <View style={styles.timeBadge}>
              <Clock size={12} color={darkTheme.colors.textMuted} />
              <Text style={styles.timeBadgeText}>{formatTime(todayEntry.updated_at)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.vowText}>{vowItem[getLocalizedText(language)]}</Text>

        {isSubmitted ? (
          <View style={styles.submittedView}>
            {isKept && (
              <View style={styles.infoBoxKept}>
                <Check size={20} color="#7FA88F" />
                <Text style={styles.infoBoxKeptText}>
                  {t.dashboard.keptVow}
                </Text>
              </View>
            )}
            {isBroken && (
              <>
                <View style={styles.infoBoxBroken}>
                  <X size={20} color="#B85C4F" />
                  <Text style={styles.infoBoxBrokenText}>
                    {t.dashboard.vowWasBroken}
                  </Text>
                </View>
                {todayEntry.antidote_text && (
                  <View style={styles.infoBoxAntidote}>
                    <Text style={styles.antidoteLabelSmall}>
                      {t.dashboard.antidoteLabel}
                    </Text>
                    <Text style={styles.antidoteValueText}>
                      {todayEntry.antidote_text}
                    </Text>
                  </View>
                )}
              </>
            )}
            {todayEntry.note_text && isKept && (
              <View style={styles.noteDisplay}>
                <Text style={styles.noteDisplayText}>«{todayEntry.note_text}»</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {!isKeepExpanded && !isBrokenExpanded && (
              <View style={styles.vowActions}>
                <TouchableOpacity
                  style={styles.keepButton}
                  onPress={() => handleExpandCard(cardKey, 'keep')}
                >
                  <LinearGradient
                    colors={['#7FA88F', '#6B9E7D']}
                    style={styles.actionButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Check size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      {t.dashboard.kept}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.brokenButton}
                  onPress={() => handleExpandCard(cardKey, 'break')}
                >
                  <LinearGradient
                    colors={['#B85C4F', '#A04A3E']}
                    style={styles.actionButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <X size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      {t.dashboard.broken}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {isKeepExpanded && (
              <View style={styles.expandedForm}>
                <View style={styles.keepInfoBlock}>
                  <Check size={20} color="#7FA88F" />
                  <Text style={styles.keepInfoText}>
                    {t.dashboard.tellWhatYouDid}
                  </Text>
                </View>

                <TextInput
                  style={styles.noteInput}
                  placeholder={t.dashboard.notePlaceholder}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={state?.noteText || ''}
                  onChangeText={(text) => updateNoteText(cardKey, text)}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCollapseCard(cardKey)}
                  >
                    <Text style={styles.cancelButtonText}>
                      {t.common.cancel}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveKeep(vowKey, cardKey, globalIdx)}
                    disabled={createEntry.isPending}
                  >
                    <LinearGradient
                      colors={['#7FA88F', '#6B9E7D']}
                      style={styles.saveButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {createEntry.isPending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Sparkles size={18} color="#FFFFFF" />
                          <Text style={styles.saveButtonText}>
                            {t.common.save}
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isBrokenExpanded && (
              <View style={styles.expandedForm}>
                <View style={styles.brokenInfoBlock}>
                  <AlertCircle size={20} color="#C5A572" />
                  <Text style={styles.brokenInfoText}>
                    {t.dashboard.whatWillYouDo}
                  </Text>
                </View>

                <Text style={styles.antidoteLabel}>
                  {t.dashboard.antidote}
                </Text>

                <View style={styles.antidoteTagsWrapper}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.antidoteTagsScroll}
                    contentContainerStyle={styles.antidoteTagsContent}
                    decelerationRate="fast"
                    snapToAlignment="start"
                  >
                    {antidoteTags[getLocalizedText(language)].map((tag: string) => (
                      <AntidoteTagButton
                        key={tag}
                        tag={tag}
                        onPress={() => selectAntidoteTag(cardKey, tag)}
                      />
                    ))}
                    <View style={styles.antidoteTagsSpacer} />
                  </ScrollView>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']}
                    style={styles.antidoteFadeRight}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    pointerEvents="none"
                  />
                </View>

                <TextInput
                  style={styles.noteInput}
                  placeholder={t.dashboard.antidotePlaceholder}
                  placeholderTextColor={darkTheme.colors.textMuted}
                  value={state?.antidoteText || ''}
                  onChangeText={(text) => updateAntidoteText(cardKey, text)}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCollapseCard(cardKey)}
                  >
                    <Text style={styles.cancelButtonText}>
                      {t.common.cancel}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveBreak(vowKey, cardKey, globalIdx)}
                    disabled={createEntry.isPending}
                  >
                    <LinearGradient
                      colors={['#C5A572', '#B09562']}
                      style={styles.saveButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {createEntry.isPending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Sparkles size={18} color="#FFFFFF" />
                          <Text style={styles.saveButtonText}>
                            {t.common.save}
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderVowCards = () => {
    if (cycleLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={darkTheme.colors.primary} />
          <Text style={styles.loadingText}>
            {t.dashboard.loadingVows}
          </Text>
        </View>
      );
    }

    if (dailyVows.length === 0) {
      return null;
    }

    return dailyVows.map((dailyVow: DailyVowItem, index: number) => {
      const vowItem: Record<string, string> = {
        ru: dailyVow.vowItem.textRu,
        en: dailyVow.vowItem.textEn,
        fr: dailyVow.vowItem.textFr || dailyVow.vowItem.textEn,
        de: dailyVow.vowItem.textDe || dailyVow.vowItem.textEn,
        es: dailyVow.vowItem.textEs || dailyVow.vowItem.textEn,
        zh: dailyVow.vowItem.textZh || dailyVow.vowItem.textEn,
        hy: dailyVow.vowItem.textHy || dailyVow.vowItem.textEn,
        it: dailyVow.vowItem.textIt || dailyVow.vowItem.textEn,
      };
      const categoryName = getVowCategoryName(dailyVow.vowType);
      return renderVowCard(
        dailyVow.vowType,
        vowItem,
        dailyVow.vowIndex,
        categoryName,
        dailyVow.vowIndex
      );
    });
  };

  const renderHistoryCard = (entry: VowEntry, isOverdueEntry: boolean) => {
    const vowName = getVowNameFromType(entry.vow_type);
    const categoryName = getVowCategoryFromType(entry.vow_type);
    const isKept = entry.status === 'kept';
    const isBroken = entry.status === 'broken';
    const showActions = isBroken && !entry.antidote_completed;

    return (
      <View
        key={entry.id}
        style={[
          styles.historyCard,
          isOverdueEntry && styles.historyCardOverdue,
        ]}
      >
        {isOverdueEntry && (
          <View style={styles.overdueLabel}>
            <AlertTriangle size={14} color="#C5A572" />
            <Text style={styles.overdueLabelText}>
              {t.dashboard.overdueDeb}
            </Text>
          </View>
        )}

        <View style={styles.historyCardHeader}>
          <View style={styles.vowNumberContainer}>
            {isBroken ? (
              <LinearGradient
                colors={['#B85C4F', '#A04A3E']}
                style={styles.vowNumber}
              >
                <Text style={styles.vowNumberText}>!</Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={['#6B8E7F', '#5A7A6D']}
                style={styles.vowNumber}
              >
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
            <Text style={styles.historyInfoBoxKeptText}>
              {t.dashboard.vowKept}
            </Text>
          </View>
        )}

        {isBroken && (
          <>
            <View style={styles.historyInfoBoxBroken}>
              <X size={18} color="#B85C4F" />
              <Text style={styles.historyInfoBoxBrokenText}>
                {t.dashboard.vowBroken}
              </Text>
            </View>
            {entry.antidote_text && (
              <View style={styles.historyInfoBoxAntidote}>
                <Text style={styles.antidoteLabelSmall}>
                  {t.dashboard.antidoteLabel}
                </Text>
                <Text style={styles.antidoteValueText}>{entry.antidote_text}</Text>
              </View>
            )}
            {entry.antidote_completed && (
              <View style={styles.antidoteCompletedBadge}>
                <Check size={14} color="#6B8E7F" />
                <Text style={styles.antidoteCompletedText}>
                  {t.dashboard.antidoteCompleted}
                </Text>
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
              disabled={markAntidoteCompleted.isPending}
            >
              <LinearGradient
                colors={['#7FA88F', '#6B9E7D']}
                style={styles.historyActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.historyActionText}>
                  {t.dashboard.completed}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyPostponeButton}
              onPress={() => handlePostpone(entry.id)}
              disabled={postponeAntidote.isPending}
            >
              <Calendar size={16} color={darkTheme.colors.textSecondary} />
              <Text style={styles.historyPostponeText}>
                {t.dashboard.postpone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderHistoryTabs = () => (
    <View style={styles.historyTabsContainer}>
      <Pressable
        style={[
          styles.historyTab,
          styles.historyTabLeft,
          historySubTab === 'antidotes' && styles.historyTabActive,
        ]}
        onPress={() => setHistorySubTab('antidotes')}
      >
        <Text
          style={[
            styles.historyTabText,
            historySubTab === 'antidotes' && styles.historyTabTextActive,
          ]}
        >
          {t.dashboard.antidotesTab}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.historyTab,
          styles.historyTabRight,
          historySubTab === 'history' && styles.historyTabActive,
        ]}
        onPress={() => setHistorySubTab('history')}
      >
        <Text
          style={[
            styles.historyTabText,
            historySubTab === 'history' && styles.historyTabTextActive,
          ]}
        >
          {t.dashboard.historyTab}
        </Text>
      </Pressable>
    </View>
  );

  const renderHistoryContent = () => {
    const antidoteEntries = historyEntries.filter(
      e => e.status === 'broken' && !e.antidote_completed
    );
    const keptEntries = historyEntries.filter(
      e => e.status === 'kept'
    );

    const displayedEntries = historySubTab === 'antidotes' ? antidoteEntries : keptEntries;

    if (displayedEntries.length === 0) {
      return (
        <View style={styles.emptyHistory}>
          <History size={48} color={darkTheme.colors.textMuted} />
          <Text style={styles.emptyHistoryText}>
            {historySubTab === 'antidotes'
              ? language === 'ru'
                ? 'Нет невыполненных антидотов'
                : language === 'zh'
                ? '没有未完成的解毒剂'
                : 'No uncompleted antidotes'
              : language === 'ru'
              ? 'Нет записей'
              : language === 'zh'
              ? '没有记录'
              : 'No entries'}
          </Text>
          <Text style={styles.emptyHistorySubtext}>
            {historySubTab === 'antidotes'
              ? language === 'ru'
                ? 'Нарушенные обеты появятся здесь'
                : language === 'zh'
                ? '违反的誓言将显示在这里'
                : 'Broken vows will appear here'
              : language === 'ru'
              ? 'Соблюдённые обеты появятся здесь'
              : language === 'zh'
              ? '遵守的誓言将显示在这里'
              : 'Kept vows will appear here'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.historyContainer}>
        {displayedEntries.map(entry => {
          const isOverdueEntry = isOverdue(entry);
          return renderHistoryCard(entry, isOverdueEntry);
        })}
      </View>
    );
  };

  const responsiveStyles = {
    scrollContent: {
      padding: isSmallScreen ? 16 : isLargeScreen ? 32 : 20,
      paddingBottom: 40,
      maxWidth: isLargeScreen ? 1200 : undefined,
      alignSelf: isLargeScreen ? 'center' as const : undefined,
      width: isLargeScreen ? '100%' : undefined,
    },
    greeting: {
      fontSize: isSmallScreen ? 24 : isLargeScreen ? 36 : 28,
    },
    vowCard: {
      maxWidth: isLargeScreen ? 600 : undefined,
    },
  };

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
          <TouchableOpacity style={styles.adminBanner} onPress={onOpenAdmin}>
            <Text style={styles.adminText}>{t.admin.title}</Text>
            <ChevronRight size={20} color={darkTheme.colors.primary} />
          </TouchableOpacity>
        )}

        {activeTab === 'diary' && selectedVows.length > 0 && renderSelectedVowsChips()}

        {activeTab === 'diary' && (
          <>
            {selectedVows.length === 0 ? (
              <TouchableOpacity style={[styles.emptyState, isLargeScreen && styles.emptyStateLarge]} onPress={() => setActiveTab('vowSelection')}>
                <Plus size={isSmallScreen ? 40 : 48} color={darkTheme.colors.textMuted} />
                <Text style={[styles.emptyStateText, isSmallScreen && styles.emptyStateTextSmall]}>
                  {language === 'ru' 
                    ? 'Нажмите, чтобы выбрать обеты'
                    : language === 'zh'
                    ? '点击选择誓言'
                    : 'Tap to select vows'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={[
                styles.vowCardsContainer,
                isLargeScreen && styles.vowCardsContainerLarge
              ]}>
                {renderVowCards()}
              </View>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {renderHistoryTabs()}
            {renderHistoryContent()}
          </>
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

      {renderBottomTabs()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
  },
  username: {
    fontWeight: '700' as const,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  bottomTabShadow: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 10,
  },
  bottomTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  bottomTabLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: '#5A6A66',
  },
  bottomTabLabelActive: {
    color: darkTheme.colors.primary,
    fontWeight: '600' as const,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(107, 142, 127, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: darkTheme.colors.primary,
  },
  adminText: {
    color: darkTheme.colors.primary,
    fontWeight: '600' as const,
    fontSize: 16,
  },
  chipsSection: {
    marginBottom: 24,
  },
  chipsSectionLarge: {
    maxWidth: 800,
  },
  chipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chipsSectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
  },
  chipsSectionTitleLarge: {
    fontSize: 22,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(107, 142, 127, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScrollWrapper: {
    position: 'relative',
    marginHorizontal: -20,
  },
  chipsScrollView: {
    flexGrow: 0,
  },
  chipsScrollContent: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipsSpacer: {
    width: 30,
  },
  chipsFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    gap: 8,
    flexShrink: 0,
  },
  chipSmall: {
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 10,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#FFFFFF',
  },
  chipTextSmall: {
    fontSize: 12,
  },
  chipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vowCardsContainer: {
    gap: 16,
  },
  vowCardsContainerLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  vowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  vowCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  vowNumberContainer: {},
  vowNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vowNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  vowCategoryBadge: {
    backgroundColor: '#F0EBE3',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  vowCategoryText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: darkTheme.colors.textSecondary,
  },
  vowText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
    marginBottom: 20,
    lineHeight: 26,
  },
  vowActions: {
    flexDirection: 'row',
    gap: 12,
  },
  keepButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  brokenButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  expandedForm: {
    marginTop: 8,
  },
  keepInfoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(127, 168, 143, 0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  keepInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#5A7A6D',
    lineHeight: 20,
  },
  brokenInfoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(197, 165, 114, 0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  brokenInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#8B6A4E',
    lineHeight: 20,
  },
  antidoteLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
    marginBottom: 12,
  },
  antidoteTagsWrapper: {
    position: 'relative',
    marginBottom: 16,
    marginHorizontal: -20,
  },
  antidoteTagsScroll: {
    flexGrow: 0,
  },
  antidoteTagsContent: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  antidoteTagsSpacer: {
    width: 40,
  },
  antidoteFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 50,
  },
  antidoteTag: {
    backgroundColor: 'rgba(197, 165, 114, 0.15)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C5A572',
  },
  antidoteTagText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#8B6A4E',
  },
  noteInput: {
    backgroundColor: '#F8F5F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: darkTheme.colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E8E1D5',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E1D5',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: darkTheme.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    padding: 48,
    borderWidth: 2,
    borderColor: '#E8E1D5',
    borderStyle: 'dashed',
  },
  emptyStateLarge: {
    maxWidth: 500,
    alignSelf: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: darkTheme.colors.textMuted,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateTextSmall: {
    fontSize: 14,
  },
  vowCardSubmitted: {
    opacity: 0.95,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 'auto',
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: darkTheme.colors.textMuted,
  },
  submittedView: {
    gap: 12,
  },
  infoBoxKept: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(127, 168, 143, 0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoBoxKeptText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#5A7A6D',
  },
  infoBoxBroken: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(184, 92, 79, 0.12)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoBoxBrokenText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#A04A3E',
  },
  infoBoxAntidote: {
    backgroundColor: 'rgba(197, 165, 114, 0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  antidoteLabelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#8B6A4E',
  },
  antidoteValueText: {
    fontSize: 14,
    color: '#6B5A3E',
    lineHeight: 20,
  },
  noteDisplay: {
    backgroundColor: 'rgba(107, 142, 127, 0.08)',
    borderRadius: 12,
    padding: 12,
  },
  noteDisplayText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: darkTheme.colors.textSecondary,
    lineHeight: 20,
  },
  historyContainer: {
    gap: 20,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  historyCardOverdue: {
    borderWidth: 1,
    borderColor: '#C5A572',
    backgroundColor: 'rgba(197, 165, 114, 0.08)',
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  historyDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 'auto',
  },
  historyDateText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: darkTheme.colors.textMuted,
  },
  historyVowText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  historyInfoBoxKept: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(127, 168, 143, 0.12)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  historyInfoBoxKeptText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#5A7A6D',
  },
  historyInfoBoxBroken: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(184, 92, 79, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  historyInfoBoxBrokenText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#A04A3E',
  },
  historyInfoBoxAntidote: {
    backgroundColor: 'rgba(197, 165, 114, 0.12)',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    marginTop: 8,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  historyActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  historyActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  historyPostponeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8E1D5',
  },
  historyPostponeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: darkTheme.colors.textSecondary,
  },
  overdueLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  overdueLabelText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#C5A572',
  },
  overdueSection: {
    marginBottom: 24,
  },
  overdueSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  overdueSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#8B6A4E',
  },
  regularHistorySection: {
    gap: 0,
  },
  regularHistorySectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
    marginBottom: 12,
  },
  antidoteCompletedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 142, 127, 0.12)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  antidoteCompletedText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#6B8E7F',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    padding: 48,
    marginTop: 20,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: darkTheme.colors.text,
    marginTop: 16,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: darkTheme.colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
  },
  loadingText: {
    fontSize: 16,
    color: darkTheme.colors.textMuted,
    marginTop: 16,
  },
  historyTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E1D5',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  historyTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTabLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  historyTabRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  historyTabActive: {
    backgroundColor: darkTheme.colors.primary,
  },
  historyTabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#5A6A66',
  },
  historyTabTextActive: {
    color: '#FFFFFF',
  },
});
