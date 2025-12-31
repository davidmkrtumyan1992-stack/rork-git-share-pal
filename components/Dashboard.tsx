import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
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
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateVowEntry } from '@/hooks/useVows';
import { getTranslation } from '@/data/translations';
import { darkTheme } from '@/constants/theme';


type TabType = 'diary' | 'history' | 'settings';

const vowCategoryNames: Record<string, { ru: string; en: string }> = {
  tenPrinciples: { ru: '10 этических принципов', en: '10 Ethical Principles' },
  freedom: { ru: 'Обеты свободы', en: 'Freedom Vows' },
  bodhisattva: { ru: 'Обеты Бодхисаттвы', en: 'Bodhisattva Vows' },
  tantric: { ru: 'Тантрические обеты', en: 'Tantric Vows' },
  nuns: { ru: 'Обеты монахинь', en: 'Nun Vows' },
  monks: { ru: 'Обеты монахов', en: 'Monk Vows' },
};

const vowItems: Record<string, { ru: string; en: string }[]> = {
  tenPrinciples: [
    { ru: 'Не убивать', en: 'Not to kill' },
    { ru: 'Не воровать', en: 'Not to steal' },
    { ru: 'Не лгать', en: 'Not to lie' },
    { ru: 'Говорить о важном', en: 'Speak meaningfully' },
    { ru: 'Не злословить', en: 'Not to slander' },
    { ru: 'Не грубить', en: 'Not to speak harshly' },
    { ru: 'Не завидовать', en: 'Not to covet' },
    { ru: 'Не злиться', en: 'Not to harbor ill will' },
    { ru: 'Не иметь ложных взглядов', en: 'Not to hold wrong views' },
    { ru: 'Хранить целомудрие', en: 'To maintain purity' },
  ],
  freedom: [
    { ru: 'Освобождение от привязанностей', en: 'Freedom from attachments' },
    { ru: 'Практика осознанности', en: 'Mindfulness practice' },
    { ru: 'Культивирование сострадания', en: 'Cultivating compassion' },
  ],
  bodhisattva: [
    { ru: 'Помогать всем существам', en: 'Help all beings' },
    { ru: 'Развивать мудрость', en: 'Develop wisdom' },
    { ru: 'Практиковать щедрость', en: 'Practice generosity' },
  ],
};

const antidoteTags = {
  ru: ['Практиковать щедрость', 'Попросить прощения', 'Медитировать на сострадание'],
  en: ['Practice generosity', 'Ask for forgiveness', 'Meditate on compassion'],
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
  onOpenSettings: () => void;
  onOpenAdmin?: () => void;
  onRemoveVow?: (vow: string) => void;
}

interface VowCardState {
  vowKey: string;
  vowIndex: number;
  expanded: 'keep' | 'break' | null;
  noteText: string;
  antidoteText: string;
  selectedAntidotes: string[];
}

export function Dashboard({ 
  selectedVows, 
  activeVow, 
  onSetActiveVow, 
  onSelectVow, 
  onOpenSettings, 
  onOpenAdmin,
  onRemoveVow,
}: DashboardProps) {
  const { profile, language, isAdmin } = useAuth();
  const t = getTranslation(language);
  const { width: screenWidth } = useWindowDimensions();
  
  const isSmallScreen = screenWidth < BREAKPOINTS.md;
  const isLargeScreen = screenWidth >= BREAKPOINTS.lg;
  
  const createEntry = useCreateVowEntry();
  
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [cardStates, setCardStates] = useState<Record<string, VowCardState>>({});

  const getVowCategoryName = useCallback((vowKey: string) => {
    return vowCategoryNames[vowKey]?.[language] || vowKey;
  }, [language]);

  const getVowItems = useCallback((vowKey: string) => {
    return vowItems[vowKey] || [];
  }, []);

  const handleExpandCard = (cardKey: string, type: 'keep' | 'break') => {
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
  };

  const handleCollapseCard = (cardKey: string) => {
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
  };

  const handleSaveKeep = (vowType: string, cardKey: string) => {
    const state = cardStates[cardKey];
    createEntry.mutate({
      vowType,
      status: 'kept',
      noteText: state?.noteText || undefined,
    });
    handleCollapseCard(cardKey);
  };

  const handleSaveBreak = (vowType: string, cardKey: string) => {
    const state = cardStates[cardKey];
    const antidoteText = [
      ...(state?.selectedAntidotes || []),
      state?.antidoteText,
    ].filter(Boolean).join('; ');
    
    createEntry.mutate({
      vowType,
      status: 'broken',
      antidoteText: antidoteText || undefined,
    });
    handleCollapseCard(cardKey);
  };

  const toggleAntidoteTag = (cardKey: string, tag: string) => {
    setCardStates(prev => {
      const current = prev[cardKey]?.selectedAntidotes || [];
      const newTags = current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag];
      return {
        ...prev,
        [cardKey]: {
          ...prev[cardKey],
          selectedAntidotes: newTags,
        }
      };
    });
  };

  const updateNoteText = (cardKey: string, text: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        noteText: text,
      }
    }));
  };

  const updateAntidoteText = (cardKey: string, text: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        antidoteText: text,
      }
    }));
  };

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsScrollContainer}
      contentContainerStyle={styles.tabsScrollContent}
    >
      <View style={[styles.tabsContainer, isLargeScreen && styles.tabsContainerLarge]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'diary' && styles.tabActive]}
          onPress={() => setActiveTab('diary')}
        >
          {activeTab === 'diary' ? (
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.tabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Bell size={isSmallScreen ? 16 : 18} color="#FFFFFF" />
              {!isSmallScreen && (
                <Text style={styles.tabTextActive}>
                  {language === 'ru' ? 'Дневник' : 'Diary'}
                </Text>
              )}
            </LinearGradient>
          ) : (
            <View style={styles.tabInner}>
              <Bell size={isSmallScreen ? 16 : 18} color={darkTheme.colors.textMuted} />
              {!isSmallScreen && (
                <Text style={styles.tabText}>
                  {language === 'ru' ? 'Дневник' : 'Diary'}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          {activeTab === 'history' ? (
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.tabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <History size={isSmallScreen ? 16 : 18} color="#FFFFFF" />
              {!isSmallScreen && (
                <Text style={styles.tabTextActive}>
                  {language === 'ru' ? 'История' : 'History'}
                </Text>
              )}
            </LinearGradient>
          ) : (
            <View style={styles.tabInner}>
              <History size={isSmallScreen ? 16 : 18} color={darkTheme.colors.textMuted} />
              {!isSmallScreen && (
                <Text style={styles.tabText}>
                  {language === 'ru' ? 'История' : 'History'}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => {
            setActiveTab('settings');
            onOpenSettings();
          }}
        >
          {activeTab === 'settings' ? (
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.tabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.tabTextActive}>
                {language === 'ru' ? 'Настройки' : 'Settings'}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.tabInner}>
              <Text style={styles.tabText}>
                {language === 'ru' ? 'Настройки' : 'Settings'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSelectedVowsChips = () => (
    <View style={[styles.chipsSection, isLargeScreen && styles.chipsSectionLarge]}>
      <View style={styles.chipsSectionHeader}>
        <Text style={[styles.chipsSectionTitle, isLargeScreen && styles.chipsSectionTitleLarge]}>
          {language === 'ru' ? 'Выбранные обеты' : 'Selected Vows'}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onSelectVow}>
          <Plus size={isSmallScreen ? 18 : 20} color={darkTheme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.chipsWrapContainer}>
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
      </View>
    </View>
  );

  const renderVowCard = (vowKey: string, vowItem: { ru: string; en: string }, index: number, categoryName: string) => {
    const cardKey = `${vowKey}-${index}`;
    const state = cardStates[cardKey];
    const isKeepExpanded = state?.expanded === 'keep';
    const isBrokenExpanded = state?.expanded === 'break';

    return (
      <View key={cardKey} style={styles.vowCard}>
        <View style={styles.vowCardHeader}>
          <View style={styles.vowNumberContainer}>
            <LinearGradient
              colors={['#6B8E7F', '#5A7A6D']}
              style={styles.vowNumber}
            >
              <Text style={styles.vowNumberText}>{index + 1}</Text>
            </LinearGradient>
          </View>
          <View style={styles.vowCategoryBadge}>
            <Text style={styles.vowCategoryText}>{categoryName}</Text>
          </View>
        </View>

        <Text style={styles.vowText}>{vowItem[language]}</Text>

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
                  {language === 'ru' ? 'Соблюдал' : 'Kept'}
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
                  {language === 'ru' ? 'Нарушил' : 'Broken'}
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
                {language === 'ru' 
                  ? 'Расскажите, что вы сделали, чтобы соблюсти этот обет'
                  : 'Tell us what you did to keep this vow'}
              </Text>
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder={language === 'ru' 
                ? 'Например: помолился, попросил прощения...'
                : 'E.g.: prayed, asked for forgiveness...'}
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
                  {language === 'ru' ? 'Отмена' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSaveKeep(vowKey, cardKey)}
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
                        {language === 'ru' ? 'Сохранить' : 'Save'}
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
                {language === 'ru' 
                  ? 'Что вы собираетесь сделать, чтобы исправить это?'
                  : 'What will you do to make amends?'}
              </Text>
            </View>

            <Text style={styles.antidoteLabel}>
              {language === 'ru' ? 'Антидот' : 'Antidote'}
            </Text>

            <View style={styles.antidoteTags}>
              {antidoteTags[language].map((tag) => {
                const isSelected = state?.selectedAntidotes?.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.antidoteTag,
                      isSelected && styles.antidoteTagSelected,
                    ]}
                    onPress={() => toggleAntidoteTag(cardKey, tag)}
                  >
                    <Text style={[
                      styles.antidoteTagText,
                      isSelected && styles.antidoteTagTextSelected,
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder={language === 'ru' 
                ? 'Или введите свой вариант...'
                : 'Or enter your own...'}
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
                  {language === 'ru' ? 'Отмена' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSaveBreak(vowKey, cardKey)}
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
                        {language === 'ru' ? 'Сохранить' : 'Save'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderVowCards = () => {
    let globalIndex = 0;
    return selectedVows.map((vowKey) => {
      const items = getVowItems(vowKey);
      const categoryName = getVowCategoryName(vowKey);
      
      return items.map((item, localIndex) => {
        const card = renderVowCard(vowKey, item, globalIndex, categoryName);
        globalIndex++;
        return card;
      });
    });
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
        contentContainerStyle={[styles.scrollContent, responsiveStyles.scrollContent]}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { fontSize: responsiveStyles.greeting.fontSize }]}>
            {language === 'ru' ? 'Привет,' : 'Hello,'}{' '}
            <Text style={styles.username}>
              {profile?.username || profile?.full_name || 'User'}
            </Text>
          </Text>
        </View>

        {renderTabs()}

        {isAdmin && onOpenAdmin && (
          <TouchableOpacity style={styles.adminBanner} onPress={onOpenAdmin}>
            <Text style={styles.adminText}>{t.admin.title}</Text>
            <ChevronRight size={20} color={darkTheme.colors.primary} />
          </TouchableOpacity>
        )}

        {selectedVows.length > 0 && renderSelectedVowsChips()}

        {selectedVows.length === 0 ? (
          <TouchableOpacity style={[styles.emptyState, isLargeScreen && styles.emptyStateLarge]} onPress={onSelectVow}>
            <Plus size={isSmallScreen ? 40 : 48} color={darkTheme.colors.textMuted} />
            <Text style={[styles.emptyStateText, isSmallScreen && styles.emptyStateTextSmall]}>
              {language === 'ru' 
                ? 'Нажмите, чтобы выбрать обеты'
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
      </ScrollView>
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
  tabsScrollContainer: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  tabsScrollContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: '100%',
  },
  tabsContainerLarge: {
    maxWidth: 500,
    alignSelf: 'flex-start',
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabActive: {},
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    borderRadius: 12,
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: darkTheme.colors.textMuted,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
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
  chipsWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  antidoteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  antidoteTag: {
    backgroundColor: '#F0EBE3',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  antidoteTagSelected: {
    backgroundColor: 'rgba(197, 165, 114, 0.2)',
    borderColor: '#C5A572',
  },
  antidoteTagText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: darkTheme.colors.textSecondary,
  },
  antidoteTagTextSelected: {
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
});
